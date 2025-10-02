// Deno backend server that serves Vite app and handles API routes
import { serveDir } from "https://deno.land/std@0.208.0/http/file_server.ts";

interface ApiData {
  message: string;
  timestamp: string;
  deno: string;
  randomNumber: number;
  requestCount: number;
}

let requestCount = 0;

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    // API Routes
    if (url.pathname === "/api/hello") {
      requestCount++;
      const data: ApiData = {
        message: "Hello from Deno Deploy API! 🦕",
        timestamp: new Date().toISOString(),
        deno: Deno.version.deno,
        randomNumber: Math.floor(Math.random() * 1000),
        requestCount,
      };
      
      return new Response(JSON.stringify(data), {
        headers: { 
          "content-type": "application/json",
          "access-control-allow-origin": "*",
        },
      });
    }

    if (url.pathname === "/api/random") {
      const data = {
        number: Math.floor(Math.random() * 100),
        timestamp: Date.now(),
      };
      
      return new Response(JSON.stringify(data), {
        headers: { 
          "content-type": "application/json",
          "access-control-allow-origin": "*",
        },
      });
    }

    // Health check endpoint
    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "ok", uptime: Date.now() }), {
        headers: { 
          "content-type": "application/json",
          "access-control-allow-origin": "*",
        },
      });
    }

    // Serve static files from dist directory
    return serveDir(request, {
      fsRoot: "dist",
      urlRoot: "",
      showDirListing: false,
      enableCors: true,
    });
  },
};

