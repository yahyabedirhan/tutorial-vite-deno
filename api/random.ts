// API endpoint: /api/random
// Returns a random number

import type { Context } from "jsr:@hono/hono@^4";

export function GET(c: Context) {
  const data = {
    number: Math.floor(Math.random() * 100),
    timestamp: Date.now(),
  };
  
  return c.json(data);
}

