# 📡 API Development Guide with Hono

This project uses **Hono** - a lightweight, ultra-fast web framework for Deno. It's the industry-standard solution for building APIs on Deno.

## 🎯 Why Hono?

- ✅ **Ultra-fast** - Blazing performance
- ✅ **Simple** - Clean, intuitive API
- ✅ **Web Standards** - Built on standard web APIs
- ✅ **TypeScript-first** - Excellent type safety
- ✅ **Works everywhere** - Deno, Cloudflare Workers, Bun, Node.js
- ✅ **Industry standard** - Most popular Deno framework

## 📁 Project Structure

```
vite-deno-app/
├── server.ts          # Main server file (Hono app setup)
├── api/               # API route handlers
│   ├── hello.ts       # GET /api/hello
│   ├── random.ts      # GET /api/random
│   └── health.ts      # GET /api/health
├── src/               # React frontend
└── dist/              # Built Vite app (static files)
```

---

## 🚀 Adding a New API Endpoint

### Step 1: Create Route Handler

Create a new file in `api/` directory:

**Example: `api/users.ts`**

```typescript
// API endpoint: /api/users
// Returns list of users

import type { Context } from "https://deno.land/x/hono@v4.6.14/mod.ts";

export function GET(c: Context) {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  
  return c.json({ users });
}

export function POST(c: Context) {
  // Handle POST request
  const body = await c.req.json();
  
  return c.json({ 
    message: "User created", 
    data: body 
  }, 201);
}
```

### Step 2: Register Route in server.ts

Add your route handler:

```typescript
// Import your new route
import * as users from "./api/users.ts";

// Register it
app.get("/api/users", users.GET);
app.post("/api/users", users.POST);
```

That's it! ✅

---

## 📝 Route Handler Patterns

### Basic GET Endpoint

```typescript
import type { Context } from "https://deno.land/x/hono@v4.6.14/mod.ts";

export function GET(c: Context) {
  return c.json({ message: "Hello!" });
}
```

### POST with Body

```typescript
export async function POST(c: Context) {
  const body = await c.req.json();
  
  // Process body...
  
  return c.json({ success: true, data: body }, 201);
}
```

### URL Parameters

```typescript
// In server.ts
app.get("/api/users/:id", users.GET);

// In api/users.ts
export function GET(c: Context) {
  const id = c.req.param("id");
  
  return c.json({ userId: id });
}
```

### Query Parameters

```typescript
export function GET(c: Context) {
  const page = c.req.query("page") || "1";
  const limit = c.req.query("limit") || "10";
  
  return c.json({ page, limit });
}
```

### Error Handling

```typescript
export function GET(c: Context) {
  try {
    // Your logic here
    return c.json({ success: true });
  } catch (error) {
    return c.json({ 
      error: error.message 
    }, 500);
  }
}
```

---

## 🎨 Advanced Hono Features

### Middleware

Add middleware for specific routes:

```typescript
import { cors } from "https://deno.land/x/hono@v4.6.14/middleware.ts";

// CORS for all API routes
app.use("/api/*", cors());

// Custom middleware
app.use("/api/*", async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  await next();
});
```

### Route Groups

Organize routes better:

```typescript
// Create a sub-app for API v1
const api = new Hono().basePath("/api/v1");

api.get("/users", users.GET);
api.get("/posts", posts.GET);

// Mount it
app.route("/", api);
```

### Validation

Use Zod for validation:

```typescript
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(c: Context) {
  const body = await c.req.json();
  
  // Validate
  const result = userSchema.safeParse(body);
  if (!result.success) {
    return c.json({ errors: result.error }, 400);
  }
  
  return c.json({ user: result.data }, 201);
}
```

---

## 🔧 Common Patterns

### Database Query

```typescript
// api/posts.ts
export async function GET(c: Context) {
  // Example with hypothetical DB
  const posts = await db.query("SELECT * FROM posts");
  
  return c.json({ posts });
}
```

### File Upload

```typescript
export async function POST(c: Context) {
  const body = await c.req.parseBody();
  const file = body.file;
  
  if (file instanceof File) {
    // Process file...
    return c.json({ filename: file.name });
  }
  
  return c.json({ error: "No file" }, 400);
}
```

### Authentication

```typescript
// middleware/auth.ts
export const requireAuth = async (c: Context, next: () => Promise<void>) => {
  const token = c.req.header("Authorization");
  
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  // Verify token...
  await next();
};

// Use it
app.get("/api/protected", requireAuth, protectedRoute.GET);
```

---

## 📊 Real-World Example

**Complete CRUD API for a blog:**

```typescript
// api/posts.ts
import type { Context } from "https://deno.land/x/hono@v4.6.14/mod.ts";

const posts = [
  { id: 1, title: "Hello Deno", content: "..." },
];

// List all posts
export function GET(c: Context) {
  return c.json({ posts });
}

// Create post
export async function POST(c: Context) {
  const body = await c.req.json();
  const newPost = { id: posts.length + 1, ...body };
  posts.push(newPost);
  
  return c.json({ post: newPost }, 201);
}

// Get single post
export function GET_BY_ID(c: Context) {
  const id = parseInt(c.req.param("id"));
  const post = posts.find(p => p.id === id);
  
  if (!post) {
    return c.json({ error: "Not found" }, 404);
  }
  
  return c.json({ post });
}

// Update post
export async function PUT(c: Context) {
  const id = parseInt(c.req.param("id"));
  const body = await c.req.json();
  const index = posts.findIndex(p => p.id === id);
  
  if (index === -1) {
    return c.json({ error: "Not found" }, 404);
  }
  
  posts[index] = { ...posts[index], ...body };
  return c.json({ post: posts[index] });
}

// Delete post
export function DELETE(c: Context) {
  const id = parseInt(c.req.param("id"));
  const index = posts.findIndex(p => p.id === id);
  
  if (index === -1) {
    return c.json({ error: "Not found" }, 404);
  }
  
  posts.splice(index, 1);
  return c.json({ success: true });
}
```

**Register in server.ts:**

```typescript
import * as posts from "./api/posts.ts";

app.get("/api/posts", posts.GET);
app.post("/api/posts", posts.POST);
app.get("/api/posts/:id", posts.GET_BY_ID);
app.put("/api/posts/:id", posts.PUT);
app.delete("/api/posts/:id", posts.DELETE);
```

---

## 🧪 Testing Your API

### Local Testing

```bash
# Start server
deno task dev

# Test with curl
curl http://localhost:8000/api/hello
curl -X POST http://localhost:8000/api/users -d '{"name":"Alice"}' -H "Content-Type: application/json"
```

### In Browser

Visit: http://localhost:8000/api/hello

---

## 📚 Learn More

- **Hono Docs**: https://hono.dev/
- **Hono GitHub**: https://github.com/honojs/hono
- **Deno Docs**: https://docs.deno.com/

---

## 💡 Quick Tips

1. **Keep route handlers in `api/` directory** - Clean organization
2. **One file per route** - Easy to find and maintain
3. **Use TypeScript types** - Better DX and fewer bugs
4. **Return `c.json()` for JSON responses** - Automatic headers
5. **Use status codes properly** - 200 success, 201 created, 404 not found, etc.

---

**Happy API Building with Hono! 🚀**

