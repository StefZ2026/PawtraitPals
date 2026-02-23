import type { Express, Request, Response } from "express";
import crypto from "crypto";
import { storage } from "../storage";
import { pool } from "../db";
import { isAuthenticated } from "../auth";
import { getUserId, getUserEmail, ADMIN_EMAIL, getOrgForUser, getBaseUrl } from "./helpers";

const GRAPH_API = 'https://graph.instagram.com';
const GRAPH_API_V = 'https://graph.instagram.com/v21.0';
const IG_APP_ID = process.env.INSTAGRAM_APP_ID;
const IG_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;

// In-memory image cache for serving base64 images as public URLs
const imageCache = new Map<string, { data: Buffer; contentType: string; expiresAt: number }>();
const MAX_IMAGE_CACHE_SIZE = 50;
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

// Helper: store base64 image and return a public URL
function storePublicImage(base64DataUri: string): string {
  const matches = base64DataUri.match(/^data:(image\/\w+);base64,(.+)$/s);
  if (!matches) throw new Error("Invalid base64 image data");
  const contentType = matches[1];
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    throw new Error(`Unsupported image type: ${contentType}`);
  }
  const buffer = Buffer.from(matches[2], 'base64');
  if (imageCache.size >= MAX_IMAGE_CACHE_SIZE) {
    const oldestKey = imageCache.keys().next().value;
    if (oldestKey) imageCache.delete(oldestKey);
  }
  const token = crypto.randomUUID();
  imageCache.set(token, {
    data: buffer,
    contentType,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 min TTL
  });
  const host = process.env.NODE_ENV === 'production' ? 'https://pawtraitpals.com' : 'http://localhost:5000';
  return `${host}/api/public-image/${token}`;
}

// Helper: verify Meta signed_request HMAC
function verifyMetaSignedRequest(signedRequest: string): any | null {
  if (!IG_APP_SECRET) return null;
  const [sig, payload] = signedRequest.split('.');
  if (!sig || !payload) return null;
  const expectedSig = crypto.createHmac('sha256', IG_APP_SECRET).update(payload).digest('base64url');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
  } catch { return null; }
  return JSON.parse(Buffer.from(payload, 'base64url').toString());
}

export function registerInstagramNativeRoutes(app: Express): void {
  // Clean expired images every 2 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [token, entry] of imageCache) {
      if (now > entry.expiresAt) {
        imageCache.delete(token);
      }
    }
  }, 2 * 60 * 1000);

  // Public image endpoint — serves cached images by token (no auth required)
  app.get("/api/public-image/:token", (req: Request, res: Response) => {
    const entry = imageCache.get(req.params.token);
    if (!entry || Date.now() > entry.expiresAt) {
      imageCache.delete(req.params.token);
      return res.status(404).json({ error: "Image not found or expired" });
    }
    res.set('Content-Type', entry.contentType);
    res.set('Cache-Control', 'public, max-age=600');
    res.send(entry.data);
  });

  // Native Instagram: Check connection status
  app.get("/api/instagram-native/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const orgIdParam = req.query.orgId ? parseInt(req.query.orgId as string) : null;
      const org = await getOrgForUser(req, orgIdParam);
      if (!org) return res.json({ connected: false });

      const result = await pool.query(
        'SELECT instagram_access_token, instagram_user_id, instagram_username, instagram_token_expires_at FROM organizations WHERE id = $1',
        [org.id]
      );
      const row = result.rows[0];
      if (!row?.instagram_access_token || !row?.instagram_user_id) {
        return res.json({ connected: false });
      }

      // Check if token is expired
      if (row.instagram_token_expires_at && new Date(row.instagram_token_expires_at) < new Date()) {
        return res.json({ connected: false, reason: "token_expired" });
      }

      // Auto-refresh if token expires within 7 days
      const expiresAt = row.instagram_token_expires_at ? new Date(row.instagram_token_expires_at) : null;
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      if (expiresAt && expiresAt < sevenDaysFromNow && IG_APP_SECRET) {
        try {
          const refreshRes = await fetch(
            `${GRAPH_API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${row.instagram_access_token}`
          );
          const refreshData = await refreshRes.json() as any;
          if (refreshData.access_token) {
            const newExpires = new Date(Date.now() + (refreshData.expires_in || 5184000) * 1000);
            await pool.query(
              'UPDATE organizations SET instagram_access_token = $1, instagram_token_expires_at = $2 WHERE id = $3',
              [refreshData.access_token, newExpires.toISOString(), org.id]
            );
            console.log(`[instagram-native] Token refreshed for org ${org.id}`);
          }
        } catch (refreshErr) {
          console.warn("[instagram-native] Token refresh failed:", refreshErr);
        }
      }

      // Verify token is still valid by calling Graph API
      const verifyRes = await fetch(`${GRAPH_API_V}/me?fields=user_id,username&access_token=${row.instagram_access_token}`);
      const verifyData = await verifyRes.json() as any;

      if (verifyData.error) {
        console.warn("[instagram-native] Token invalid:", verifyData.error.message);
        return res.json({ connected: false, reason: "token_invalid" });
      }

      // Sync username if changed
      if (verifyData.username && verifyData.username !== row.instagram_username) {
        await pool.query('UPDATE organizations SET instagram_username = $1 WHERE id = $2', [verifyData.username, org.id]);
      }

      res.json({ connected: true, username: verifyData.username || row.instagram_username, orgId: org.id });
    } catch (error) {
      console.error("[instagram-native] Status error:", error);
      res.json({ connected: false });
    }
  });

  // Native Instagram: Start OAuth connect flow
  app.get("/api/instagram-native/connect", isAuthenticated, async (req: Request, res: Response) => {
    if (!IG_APP_ID || !IG_APP_SECRET) {
      return res.redirect('/settings?instagram=error&detail=missing_instagram_config');
    }

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
      if (!orgId) return res.redirect('/settings?instagram=error&detail=no_organization');

      // Store orgId in state param for callback, HMAC-signed to prevent tampering
      const statePayload = JSON.stringify({ orgId, ts: Date.now() });
      const stateHmac = crypto.createHmac('sha256', IG_APP_SECRET!).update(statePayload).digest('hex');
      const state = Buffer.from(JSON.stringify({ p: statePayload, s: stateHmac })).toString('base64url');
      const redirectUri = `${process.env.NODE_ENV === 'production' ? 'https://pawtraitpals.com' : 'http://localhost:5000'}/api/instagram-native/callback`;

      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${IG_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_business_basic,instagram_business_content_publish&response_type=code&state=${state}`;

      console.log(`[instagram-native] Redirecting org ${orgId} to Facebook OAuth`);
      res.redirect(authUrl);
    } catch (error: any) {
      console.error("[instagram-native] Connect error:", error);
      res.redirect('/settings?instagram=error&detail=' + encodeURIComponent(error.message || 'unknown'));
    }
  });

  // Native Instagram: OAuth callback
  app.get("/api/instagram-native/callback", async (req: Request, res: Response) => {
    const { code, state, error: oauthError } = req.query;

    if (oauthError) {
      console.error("[instagram-native] OAuth denied:", oauthError);
      return res.redirect('/settings?instagram=error&detail=' + encodeURIComponent(oauthError as string));
    }

    if (!code || !state) {
      return res.redirect('/settings?instagram=error&detail=missing_code_or_state');
    }

    try {
      const stateOuter = JSON.parse(Buffer.from(state as string, 'base64url').toString());
      const expectedHmac = crypto.createHmac('sha256', IG_APP_SECRET!).update(stateOuter.p).digest('hex');
      if (!crypto.timingSafeEqual(Buffer.from(stateOuter.s, 'hex'), Buffer.from(expectedHmac, 'hex'))) {
        return res.redirect('/settings?instagram=error&detail=invalid_state');
      }
      const stateData = JSON.parse(stateOuter.p);
      const orgId = stateData.orgId;
      if (!orgId) throw new Error("No orgId in state");

      const redirectUri = `${process.env.NODE_ENV === 'production' ? 'https://pawtraitpals.com' : 'http://localhost:5000'}/api/instagram-native/callback`;

      // Step 1: Exchange code for short-lived token
      const cleanCode = (code as string).replace(/#_$/, '');
      console.log(`[instagram-native] Token exchange: client_id=${IG_APP_ID}, redirect_uri=${redirectUri}, code_length=${cleanCode.length}`);
      const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: IG_APP_ID!,
          client_secret: IG_APP_SECRET!,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code: cleanCode,
        }).toString(),
      });
      const tokenData = await tokenRes.json() as any;
      if (tokenData.error_type || tokenData.error) {
        console.error("[instagram-native] Token exchange error:", JSON.stringify(tokenData));
        console.error("[instagram-native] Used redirect_uri:", redirectUri);
        console.error("[instagram-native] Used client_id:", IG_APP_ID);
        throw new Error(tokenData.error_message || tokenData.error?.message || "Token exchange failed");
      }
      const shortLivedToken = tokenData.access_token;

      // Step 2: Exchange for long-lived token (60 days)
      const longTokenRes = await fetch(
        `${GRAPH_API}/access_token?grant_type=ig_exchange_token&client_secret=${IG_APP_SECRET}&access_token=${shortLivedToken}`
      );
      const longTokenData = await longTokenRes.json() as any;
      if (longTokenData.error) {
        console.error("[instagram-native] Long-lived token error:", longTokenData.error);
        throw new Error(longTokenData.error.message || "Long-lived token exchange failed");
      }
      const longLivedToken = longTokenData.access_token;
      const expiresIn = longTokenData.expires_in || 5184000;

      // Step 3: Get Instagram profile
      const igProfileRes = await fetch(`${GRAPH_API_V}/me?fields=user_id,username&access_token=${longLivedToken}`);
      const igProfileData = await igProfileRes.json() as any;
      const igUserId = igProfileData.id; // Use 'id' field (string) — NOT tokenData.user_id (number, loses precision)
      const igUsername = igProfileData.username || null;
      console.log(`[instagram-native] Profile: id=${igUserId}, username=${igUsername}`);

      // Step 4: Store everything in DB
      const expiresAt = new Date(Date.now() + expiresIn * 1000);
      await pool.query(
        `UPDATE organizations SET
          instagram_access_token = $1,
          instagram_user_id = $2,
          instagram_username = $3,
          instagram_page_id = $4,
          instagram_token_expires_at = $5
        WHERE id = $6`,
        [longLivedToken, igUserId, igUsername, null, expiresAt.toISOString(), orgId]
      );

      console.log(`[instagram-native] Connected org ${orgId}: @${igUsername} (IG ID: ${igUserId})`);
      res.redirect('/settings?instagram=connected');
    } catch (error: any) {
      console.error("[instagram-native] Callback error:", error);
      res.redirect('/settings?instagram=error&detail=' + encodeURIComponent(error.message || 'callback_failed'));
    }
  });

  // Native Instagram: Post image
  app.post("/api/instagram-native/post", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const email = getUserEmail(req);
      const userIsAdmin = email === ADMIN_EMAIL;
      const { dogId, caption, image, orgId: bodyOrgId } = req.body;

      let imageToPost: string;
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
        imageToPost = image;
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
        imageToPost = portrait.generatedImageUrl;
        const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
        const host = (req.headers['x-forwarded-host'] as string) || (req.headers['host'] as string) || 'pawtraitpals.com';
        defaultCaption = caption || `Meet ${dog.name}! ${dog.breed ? `A beautiful ${dog.breed} ` : ''}Looking for a forever home. View their full profile at ${proto}://${host}/pawfile/${dog.id}\n\n#adoptdontshop #rescuepets #pawtraitpals`;
      } else {
        return res.status(400).json({ error: "dogId or image+orgId is required" });
      }

      // Get org's Instagram credentials
      const result = await pool.query(
        'SELECT instagram_access_token, instagram_user_id FROM organizations WHERE id = $1',
        [org.id]
      );
      const token = result.rows[0]?.instagram_access_token;
      const igUserId = result.rows[0]?.instagram_user_id;
      if (!token || !igUserId) {
        return res.status(400).json({ error: "Instagram not connected. Please connect Instagram first." });
      }

      // If image is already a public URL (Supabase Storage), use directly; otherwise cache as temp public URL
      const imageUrl = imageToPost.startsWith('http') ? imageToPost : storePublicImage(imageToPost);
      console.log(`[instagram-native] Posting for org ${org.id}, image URL: ${imageUrl}`);

      // Step 1: Create media container
      console.log(`[instagram-native] Creating container: user=${igUserId}, image_url=${imageUrl}`);
      const containerRes = await fetch(`${GRAPH_API_V}/${igUserId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: defaultCaption,
          access_token: token,
        }),
      });
      const containerText = await containerRes.text();
      console.log(`[instagram-native] Container response (${containerRes.status}): ${containerText}`);
      const containerData = JSON.parse(containerText);

      if (containerData.error) {
        console.error("[instagram-native] Container creation error:", JSON.stringify(containerData.error));
        throw new Error(containerData.error.message || "Failed to create media container");
      }
      const containerId = containerData.id;
      console.log(`[instagram-native] Container created: ${containerId}`);

      // Step 2: Poll for container status (max 30 seconds)
      let ready = false;
      for (let i = 0; i < 15; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const statusRes = await fetch(
          `${GRAPH_API_V}/${containerId}?fields=status_code&access_token=${token}`
        );
        const statusData = await statusRes.json() as any;
        if (statusData.status_code === 'FINISHED') {
          ready = true;
          break;
        }
        if (statusData.status_code === 'ERROR') {
          throw new Error("Instagram rejected the image. It may be too large or in an unsupported format.");
        }
      }
      if (!ready) {
        throw new Error("Image processing timed out. Please try again.");
      }

      // Step 3: Publish
      console.log(`[instagram-native] Publishing container ${containerId} for user ${igUserId}`);
      const publishRes = await fetch(`${GRAPH_API_V}/${igUserId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: token,
        }),
      });
      const publishText = await publishRes.text();
      console.log(`[instagram-native] Publish response (${publishRes.status}): ${publishText}`);
      const publishData = JSON.parse(publishText);

      if (publishData.error) {
        console.error("[instagram-native] Publish error:", JSON.stringify(publishData.error));
        throw new Error(publishData.error.message || "Failed to publish to Instagram");
      }

      console.log(`[instagram-native] Published to Instagram: ${publishData.id}`);

      // Clean up cached image
      const tokenFromUrl = imageUrl.split('/').pop();
      if (tokenFromUrl) imageCache.delete(tokenFromUrl);

      res.json({
        success: true,
        mediaId: publishData.id,
        postUrl: null,
      });
    } catch (error: any) {
      console.error("[instagram-native] Post error:", error);
      res.status(500).json({ error: error.message || "Failed to post to Instagram" });
    }
  });

  // Native Instagram: Disconnect
  app.delete("/api/instagram-native/disconnect", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const orgIdParam = req.query.orgId ? parseInt(req.query.orgId as string) : null;
      const org = await getOrgForUser(req, orgIdParam);
      if (!org) return res.status(404).json({ error: "Organization not found" });

      await pool.query(
        `UPDATE organizations SET
          instagram_access_token = NULL,
          instagram_user_id = NULL,
          instagram_username = NULL,
          instagram_page_id = NULL,
          instagram_token_expires_at = NULL
        WHERE id = $1`,
        [org.id]
      );

      console.log(`[instagram-native] Disconnected org ${org.id}`);
      res.json({ success: true });
    } catch (error: any) {
      console.error("[instagram-native] Disconnect error:", error);
      res.status(500).json({ error: "Failed to disconnect Instagram" });
    }
  });

  // Native Instagram: Data deletion callback (required by Meta)
  app.post("/api/instagram-native/data-deletion", async (req: Request, res: Response) => {
    try {
      const { signed_request } = req.body;
      if (!signed_request || !IG_APP_SECRET) {
        return res.status(400).json({ error: "Invalid request" });
      }

      const data = verifyMetaSignedRequest(signed_request);
      if (!data) {
        return res.status(403).json({ error: "Invalid signature" });
      }
      const fbUserId = data.user_id;

      if (fbUserId) {
        await pool.query(
          `UPDATE organizations SET
            instagram_access_token = NULL,
            instagram_user_id = NULL,
            instagram_username = NULL,
            instagram_page_id = NULL,
            instagram_token_expires_at = NULL
          WHERE instagram_user_id = $1`,
          [String(fbUserId)]
        );
        console.log(`[instagram-native] Data deletion processed for IG user ${fbUserId}`);
      }

      const confirmationCode = crypto.randomUUID();
      res.json({
        url: `https://pawtraitpals.com/privacy`,
        confirmation_code: confirmationCode,
      });
    } catch (error: any) {
      console.error("[instagram-native] Data deletion error:", error);
      res.status(500).json({ error: "Failed to process data deletion" });
    }
  });

  // Native Instagram: Deauthorize callback (required by Meta)
  app.post("/api/instagram-native/deauthorize", async (req: Request, res: Response) => {
    try {
      const { signed_request } = req.body;
      if (!signed_request || !IG_APP_SECRET) {
        return res.status(400).json({ error: "Invalid request" });
      }

      const data = verifyMetaSignedRequest(signed_request);
      if (!data) {
        return res.status(403).json({ error: "Invalid signature" });
      }
      const fbUserId = data.user_id;

      if (fbUserId) {
        await pool.query(
          `UPDATE organizations SET
            instagram_access_token = NULL,
            instagram_user_id = NULL,
            instagram_username = NULL,
            instagram_page_id = NULL,
            instagram_token_expires_at = NULL
          WHERE instagram_user_id = $1`,
          [String(fbUserId)]
        );
        console.log(`[instagram-native] Deauthorized IG user ${fbUserId}`);
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("[instagram-native] Deauthorize error:", error);
      res.status(500).json({ error: "Failed to process deauthorization" });
    }
  });
}
