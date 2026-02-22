import type { Express, Request, Response } from "express";
import { storage } from "../storage";
import { pool } from "../db";
import { isAuthenticated } from "../auth";
import { getUserId, getUserEmail, ADMIN_EMAIL } from "./helpers";

const AYRSHARE_API_URL = 'https://api.ayrshare.com/api';

function getAyrshareHeaders(profileKey?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
    'Content-Type': 'application/json',
  };
  if (profileKey) {
    headers['Profile-Key'] = profileKey;
  }
  return headers;
}

export function registerInstagramRoutes(app: Express): void {
  // Ensure DB columns exist for Ayrshare integration
  (async () => {
    try {
      await pool.query(`
        ALTER TABLE organizations
          ADD COLUMN IF NOT EXISTS ayrshare_profile_key TEXT,
          ADD COLUMN IF NOT EXISTS instagram_access_token TEXT,
          ADD COLUMN IF NOT EXISTS instagram_user_id TEXT,
          ADD COLUMN IF NOT EXISTS instagram_username TEXT,
          ADD COLUMN IF NOT EXISTS instagram_page_id TEXT,
          ADD COLUMN IF NOT EXISTS instagram_token_expires_at TIMESTAMP
      `);
      console.log("[instagram] DB columns ready (Ayrshare mode)");
    } catch (e: any) {
      console.warn("[instagram] Could not add columns:", e.message);
    }
  })();

  app.get("/api/instagram/status", isAuthenticated, async (req: Request, res: Response) => {
    const apiKey = process.env.AYRSHARE_API_KEY;
    if (!apiKey) return res.json({ connected: false });

    try {
      const userId = getUserId(req);
      const email = getUserEmail(req);
      const userIsAdmin = email === ADMIN_EMAIL;

      const orgIdParam = req.query.orgId ? parseInt(req.query.orgId as string) : null;
      let org;
      if (userIsAdmin && orgIdParam) {
        org = await storage.getOrganization(orgIdParam);
      } else {
        org = await storage.getOrganizationByOwner(userId);
      }
      if (!org) return res.json({ connected: false });

      const result = await pool.query(
        'SELECT ayrshare_profile_key, instagram_username FROM organizations WHERE id = $1',
        [org.id]
      );
      const profileKey = result.rows[0]?.ayrshare_profile_key;

      const userRes = await fetch(`${AYRSHARE_API_URL}/user`, {
        headers: getAyrshareHeaders(profileKey),
      });
      const userData = await userRes.json() as any;

      const connected = Array.isArray(userData.activeSocialAccounts) &&
        userData.activeSocialAccounts.includes('instagram');
      const username = userData.displayNames?.instagram ||
        result.rows[0]?.instagram_username || null;

      if (connected && username && username !== result.rows[0]?.instagram_username) {
        await pool.query('UPDATE organizations SET instagram_username = $1 WHERE id = $2', [username, org.id]);
      }

      res.json({ connected, username, orgId: org.id });
    } catch (error) {
      console.error("[instagram] Status error:", error);
      res.json({ connected: false });
    }
  });

  app.get("/api/instagram/connect", isAuthenticated, async (req: Request, res: Response) => {
    const apiKey = process.env.AYRSHARE_API_KEY;
    if (!apiKey) return res.status(503).json({ error: "Instagram integration not configured" });

    try {
      const userId = getUserId(req);
      const email = getUserEmail(req);
      const userIsAdmin = email === ADMIN_EMAIL;
      const orgIdParam = req.query.orgId ? parseInt(req.query.orgId as string) : null;

      let orgId: number | null = null;
      if (userIsAdmin && orgIdParam) {
        orgId = orgIdParam;
      } else {
        const org = await storage.getOrganizationByOwner(userId);
        if (org) orgId = org.id;
      }
      if (!orgId) return res.status(400).json({ error: "No organization found" });

      const result = await pool.query(
        'SELECT ayrshare_profile_key FROM organizations WHERE id = $1',
        [orgId]
      );
      let profileKey = result.rows[0]?.ayrshare_profile_key;

      if (!profileKey) {
        const org = await storage.getOrganization(orgId);
        const profileRes = await fetch(`${AYRSHARE_API_URL}/profiles`, {
          method: 'POST',
          headers: getAyrshareHeaders(),
          body: JSON.stringify({
            title: `PP-Org-${orgId}-${(org?.name || 'Unknown').replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 30)}`,
          }),
        });
        const profileData = await profileRes.json() as any;

        if (profileData.profileKey) {
          profileKey = profileData.profileKey;
          await pool.query(
            'UPDATE organizations SET ayrshare_profile_key = $1 WHERE id = $2',
            [profileKey, orgId]
          );
          console.log(`[instagram] Created Ayrshare profile for org ${orgId}: ${profileKey}`);
        } else {
          console.error("[instagram] Failed to create Ayrshare profile:", profileData);
          return res.redirect('/settings?instagram=error&detail=' + encodeURIComponent(profileData.message || 'profile_creation_failed'));
        }
      }

      const privateKey = process.env.AYRSHARE_PRIVATE_KEY;
      const domain = process.env.AYRSHARE_DOMAIN;

      if (!privateKey || !domain) {
        console.error("[instagram] Missing AYRSHARE_PRIVATE_KEY or AYRSHARE_DOMAIN env vars");
        return res.redirect('/settings?instagram=error&detail=missing_ayrshare_config');
      }

      const jwtRes = await fetch(`${AYRSHARE_API_URL}/profiles/generateJWT`, {
        method: 'POST',
        headers: getAyrshareHeaders(),
        body: JSON.stringify({
          domain,
          privateKey: privateKey.replace(/\\n/g, '\n'),
          profileKey,
          redirect: `${process.env.NODE_ENV === 'production' ? 'https://pawtraitpals.com' : 'http://localhost:5000'}/settings?instagram=connected`,
          allowedSocial: ['instagram'],
        }),
      });
      const jwtData = await jwtRes.json() as any;

      if (jwtData.url) {
        console.log(`[instagram] Redirecting org ${orgId} to Ayrshare Social Connect`);
        return res.redirect(jwtData.url);
      } else {
        console.error("[instagram] JWT generation failed:", jwtData);
        return res.redirect('/settings?instagram=error&detail=' + encodeURIComponent(jwtData.message || 'jwt_failed'));
      }
    } catch (error: any) {
      console.error("[instagram] Connect error:", error);
      res.redirect('/settings?instagram=error&detail=' + encodeURIComponent(error.message || 'unknown'));
    }
  });

  app.post("/api/instagram/post", isAuthenticated, async (req: Request, res: Response) => {
    const apiKey = process.env.AYRSHARE_API_KEY;
    if (!apiKey) return res.status(503).json({ error: "Instagram integration not configured" });

    try {
      const userId = getUserId(req);
      const email = getUserEmail(req);
      const userIsAdmin = email === ADMIN_EMAIL;
      const { dogId, caption, image, orgId: bodyOrgId } = req.body;

      let imageToUpload: string;
      let fileName: string;
      let description: string;
      let org: any;
      let defaultCaption: string;

      if (image && bodyOrgId) {
        org = await storage.getOrganization(parseInt(bodyOrgId));
        if (!org) return res.status(404).json({ error: "Organization not found" });
        if (!userIsAdmin) {
          const userOrg = await storage.getOrganizationByOwner(userId);
          if (!userOrg || userOrg.id !== org.id) {
            return res.status(403).json({ error: "You don't have access to this organization" });
          }
        }
        imageToUpload = image;
        fileName = `showcase-${org.id}-${Date.now()}.png`;
        description = `Showcase from ${org.name}`;
        defaultCaption = caption || `Check out the adorable pets at ${org.name}! #adoptdontshop #rescuepets #pawtraitpals`;
      } else if (dogId) {
        const dog = await storage.getDog(parseInt(dogId));
        if (!dog) return res.status(404).json({ error: "Dog not found" });
        org = await storage.getOrganization(dog.organizationId);
        if (!org) return res.status(404).json({ error: "Organization not found" });
        if (!userIsAdmin) {
          const userOrg = await storage.getOrganizationByOwner(userId);
          if (!userOrg || userOrg.id !== org.id) {
            return res.status(403).json({ error: "You don't have access to this organization" });
          }
        }
        const portrait = await storage.getSelectedPortraitByDog(dog.id);
        if (!portrait || !portrait.generatedImageUrl) {
          return res.status(400).json({ error: "No portrait found for this pet" });
        }
        imageToUpload = portrait.generatedImageUrl;
        fileName = `portrait-${dog.id}-${Date.now()}.png`;
        description = `Pawtrait of ${dog.name}`;
        const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
        const host = (req.headers['x-forwarded-host'] as string) || (req.headers['host'] as string) || 'pawtraitpals.com';
        defaultCaption = caption || `Meet ${dog.name}! ${dog.breed ? `A beautiful ${dog.breed} ` : ''}Looking for a forever home. View their full profile at ${proto}://${host}/pawfile/${dog.id}\n\n#adoptdontshop #rescuepets #pawtraitpals`;
      } else {
        return res.status(400).json({ error: "dogId or image+orgId is required" });
      }

      const result = await pool.query(
        'SELECT ayrshare_profile_key FROM organizations WHERE id = $1',
        [org.id]
      );
      const profileKey = result.rows[0]?.ayrshare_profile_key;

      console.log(`[instagram] Uploading image for org ${org.id} to Ayrshare`);
      const uploadRes = await fetch(`${AYRSHARE_API_URL}/media/upload`, {
        method: 'POST',
        headers: getAyrshareHeaders(),
        body: JSON.stringify({ file: imageToUpload, fileName, description }),
      });
      const uploadData = await uploadRes.json() as any;

      if (!uploadData.url) {
        console.error("[instagram] Upload failed:", uploadData);
        throw new Error(uploadData.message || "Failed to upload image");
      }
      console.log(`[instagram] Uploaded: ${uploadData.url}`);

      const postRes = await fetch(`${AYRSHARE_API_URL}/post`, {
        method: 'POST',
        headers: getAyrshareHeaders(profileKey),
        body: JSON.stringify({
          post: defaultCaption,
          platforms: ['instagram'],
          mediaUrls: [uploadData.url],
        }),
      });
      const postData = await postRes.json() as any;

      if (postData.status === 'error') {
        console.error("[instagram] Post failed:", postData);
        throw new Error(postData.message || "Failed to post to Instagram");
      }

      const igPost = postData.postIds?.find((p: any) => p.platform === 'instagram');
      console.log(`[instagram] Posted to Instagram for org ${org.id} via Ayrshare`);

      res.json({
        success: true,
        mediaId: igPost?.id || postData.id,
        postUrl: igPost?.postUrl || null,
      });
    } catch (error: any) {
      console.error("[instagram] Post error:", error);
      res.status(500).json({ error: error.message || "Failed to post to Instagram" });
    }
  });

  app.delete("/api/instagram/disconnect", isAuthenticated, async (req: Request, res: Response) => {
    const apiKey = process.env.AYRSHARE_API_KEY;
    if (!apiKey) return res.status(503).json({ error: "Instagram integration not configured" });

    try {
      const userId = getUserId(req);
      const email = getUserEmail(req);
      const userIsAdmin = email === ADMIN_EMAIL;

      const orgIdParam = req.query.orgId ? parseInt(req.query.orgId as string) : null;
      let org;
      if (userIsAdmin && orgIdParam) {
        org = await storage.getOrganization(orgIdParam);
      } else {
        org = await storage.getOrganizationByOwner(userId);
      }
      if (!org) return res.status(404).json({ error: "Organization not found" });

      const result = await pool.query(
        'SELECT ayrshare_profile_key FROM organizations WHERE id = $1',
        [org.id]
      );
      const profileKey = result.rows[0]?.ayrshare_profile_key;

      if (profileKey) {
        await fetch(`${AYRSHARE_API_URL}/profiles/social`, {
          method: 'DELETE',
          headers: getAyrshareHeaders(profileKey),
          body: JSON.stringify({ platform: 'instagram' }),
        });
      }

      await pool.query(
        `UPDATE organizations SET instagram_username = NULL, instagram_user_id = NULL, instagram_access_token = NULL WHERE id = $1`,
        [org.id]
      );

      res.json({ success: true });
    } catch (error: any) {
      console.error("[instagram] Disconnect error:", error);
      res.status(500).json({ error: "Failed to disconnect Instagram" });
    }
  });

  app.get("/api/admin/instagram-debug", isAuthenticated, async (req: Request, res: Response) => {
    const email = getUserEmail(req);
    if (email !== ADMIN_EMAIL) return res.status(403).json({ error: "Admin only" });

    const apiKey = process.env.AYRSHARE_API_KEY;
    if (!apiKey) return res.json({ error: "AYRSHARE_API_KEY not set" });

    try {
      const userRes = await fetch(`${AYRSHARE_API_URL}/user`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      const userData = await userRes.json();

      const profilesRes = await fetch(`${AYRSHARE_API_URL}/profiles`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      const profilesData = await profilesRes.json();

      res.json({
        ayrshare_user: userData,
        profiles: profilesData,
        env: {
          hasApiKey: !!apiKey,
          hasDomain: !!process.env.AYRSHARE_DOMAIN,
          hasPrivateKey: !!process.env.AYRSHARE_PRIVATE_KEY,
        },
      });
    } catch (e: any) {
      res.json({ error: e.message });
    }
  });
}
