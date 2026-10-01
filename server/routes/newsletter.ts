import { RequestHandler } from "express";
import { z } from "zod";
import Newsletter from "../models/Newsletter";

const subscribeSchema = z.object({
  email: z.string().trim().email().max(254),
});

const newsletterLimiterWindow = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_HOUR = 5;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (newsletterLimiterWindow.get(key) || []).filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );
  if (timestamps.length >= MAX_PER_HOUR) {
    newsletterLimiterWindow.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  newsletterLimiterWindow.set(key, timestamps);
  return false;
}

export const handleNewsletterSubscribe: RequestHandler = async (req, res) => {
  const clientKey = req.ip || "unknown";
  if (isRateLimited(clientKey)) {
    res.status(429).json({ message: "Too many subscribe attempts. Please try again later." });
    return;
  }

  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Please provide a valid email address." });
    return;
  }

  try {
    const email = parsed.data.email.toLowerCase();
    await Newsletter.updateOne(
      { email },
      { $setOnInsert: { email } },
      { upsert: true }
    );
    res.status(201).json({ message: "Thanks for subscribing! Check your inbox for welcome offers." });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    res.status(500).json({ message: "Unable to subscribe right now. Please try again." });
  }
};
