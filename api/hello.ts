// API endpoint: /api/hello
// Returns server information and statistics

import type { Context } from "jsr:@hono/hono@^4";

interface ApiData {
  message: string;
  timestamp: string;
  deno: string;
  randomNumber: number;
  requestCount: number;
}

let requestCount = 0;

export function GET(c: Context) {
  requestCount++;
  
  const data: ApiData = {
    message: "Hello from Deno Deploy API! 🦕",
    timestamp: new Date().toISOString(),
    deno: Deno.version.deno,
    randomNumber: Math.floor(Math.random() * 1000),
    requestCount,
  };
  
  return c.json(data);
}

