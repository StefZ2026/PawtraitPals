import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../auth";
import { smsRateLimiter } from "./helpers";

export function registerSmsRoutes(app: Express): void {
  app.post("/api/send-sms", isAuthenticated, smsRateLimiter, async (req: any, res: Response) => {
    try {
      const { to, message } = req.body;
      if (!to || !message) {
        return res.status(400).json({ error: "Phone number and message are required" });
      }

      const cleaned = to.replace(/[\s\-().]/g, "");
      if (!/^\+?1?\d{10,15}$/.test(cleaned)) {
        return res.status(400).json({ error: "Please enter a valid phone number" });
      }

      const twilioSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioKeySid = process.env.TWILIO_API_KEY_SID;
      const twilioKeySecret = process.env.TWILIO_API_KEY_SECRET;
      const twilioMsgSvc = process.env.TWILIO_MESSAGING_SERVICE_SID;

      if (!twilioSid || !twilioKeySid || !twilioKeySecret || !twilioMsgSvc) {
        return res.status(503).json({ error: "SMS service is not configured" });
      }

      const phone = cleaned.startsWith("+") ? cleaned : cleaned.startsWith("1") ? `+${cleaned}` : `+1${cleaned}`;

      const twilioAuth = Buffer.from(`${twilioKeySid}:${twilioKeySecret}`).toString("base64");
      const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${twilioAuth}`,
        },
        body: new URLSearchParams({ To: phone, MessagingServiceSid: twilioMsgSvc, Body: message }).toString(),
      });

      if (!twilioRes.ok) {
        const err = await twilioRes.json();
        throw new Error(err.message || "Failed to send text message");
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("SMS send error:", error);
      const errMsg = error?.message || "Failed to send text message";
      res.status(500).json({ error: errMsg });
    }
  });
}
