// API endpoint: /api/health
// Health check endpoint

import type { Context } from "jsr:@hono/hono@^4";

export function GET(c: Context) {
  return c.json({ 
    status: "ok", 
    uptime: Date.now(),
    timestamp: new Date().toISOString(),
  });
}

