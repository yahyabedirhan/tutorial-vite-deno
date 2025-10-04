// Deno backend server using Hono framework
import { Hono } from "jsr:@hono/hono@^4";
import { serveStatic } from "jsr:@hono/hono@^4/deno";

// Import API routes
import * as hello from "./api/hello.ts";
import * as random from "./api/random.ts";
import * as health from "./api/health.ts";

// Create Hono app
const app = new Hono();

// API routes
app.get("/api/hello", hello.GET);
app.get("/api/random", random.GET);
app.get("/api/health", health.GET);

// Serve static files from dist directory
app.use("/*", serveStatic({ root: "./dist" }));

// 404 handler
app.notFound((c) => c.json({ error: "Not found" }, 404));

console.log("🚀 Server starting with Hono...");
console.log("📡 API routes: /api/hello, /api/random, /api/health");

export default app;
