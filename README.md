# Vite + React + Deno Full-Stack App

A modern full-stack application with Vite React frontend and Deno backend, deployed on Deno Deploy.

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         Deno Deploy (Edge)          │
├─────────────────────────────────────┤
│  server.ts (Deno Backend)           │
│  ├─ Serves Vite static files        │
│  └─ Handles /api/* routes           │
│                                     │
│  dist/ (Vite Build Output)          │
│  ├─ index.html                      │
│  ├─ React App (SPA)                 │
│  └─ Assets (JS, CSS)                │
└─────────────────────────────────────┘
```

## ✨ Features

- ⚡ **Vite** - Lightning-fast build tool
- ⚛️ **React** - Modern UI library with TypeScript
- 🦕 **Deno** - Secure TypeScript runtime for backend
- 🚀 **Deno Deploy** - Edge computing platform
- 🔄 **API Routes** - Backend endpoints under `/api`
- 🎨 **Beautiful UI** - Gradient design with animations
- 📦 **Single Deployment** - Frontend + Backend together
- 🔁 **CI/CD Ready** - GitHub Actions workflow included

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Deno](https://deno.land/) (v1.x)
- [Git](https://git-scm.com/)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the Vite app:**
   ```bash
   npm run build
   ```

3. **Run the Deno server:**
   ```bash
   deno task dev
   ```

4. **Open in browser:**
   ```
   http://localhost:8000
   ```

### Development Mode (with HMR)

For frontend development with hot reload:

```bash
# Terminal 1 - Vite dev server
npm run dev

# Terminal 2 - Deno server
deno task dev
```

Visit `http://localhost:5173` for Vite HMR (API calls will proxy to port 8000).

## 📡 API Endpoints

- `GET /api/hello` - Returns server info and random data
- `GET /api/random` - Returns a random number
- `GET /api/health` - Health check endpoint

## 🌐 Deployment Options

### Option 1: GitHub Actions (Recommended)

1. **Create a Deno Deploy project:**
   - Go to [dash.deno.com](https://dash.deno.com)
   - Create a new project
   - Note the project name

2. **Update workflow:**
   ```yaml
   # .github/workflows/deploy.yml
   project: "your-project-name" # Change this
   ```

3. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

4. **GitHub will automatically deploy!**

### Option 2: Manual Deployment via API

1. **Set environment variables:**
   ```bash
   export DEPLOY_ACCESS_TOKEN="your-token"
   export DEPLOY_ORG_ID="your-org-id"
   ```

2. **Build and deploy:**
   ```bash
   npm run build
   deno run --allow-env --allow-net --allow-read deploy_to_subhosting.ts
   ```

### Option 3: Deno Deploy CLI

```bash
npm run build
deployctl deploy --project=your-project-name server.ts
```

## 📁 Project Structure

```
vite-deno-app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── src/
│   ├── App.tsx                 # Main React component
│   ├── App.css                 # Styles
│   └── main.tsx                # React entry point
├── dist/                       # Vite build output (generated)
├── server.ts                   # Deno backend server
├── deno.json                   # Deno configuration
├── vite.config.ts              # Vite configuration
├── deploy_to_subhosting.ts     # Deployment script
└── package.json                # Node dependencies
```

## 🛠️ Technologies

- **Frontend:**
  - React 18
  - TypeScript
  - Vite 6
  - CSS3 (with animations)

- **Backend:**
  - Deno (latest)
  - TypeScript
  - Standard library file server

- **Deployment:**
  - Deno Deploy
  - GitHub Actions
  - Deno Subhosting API

## 🔧 Configuration

### Vite Proxy (vite.config.ts)

The Vite dev server proxies API calls to Deno:

```typescript
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

### Deno Server (server.ts)

Handles both API routes and static file serving:

```typescript
// API routes: /api/*
// Static files: everything else from dist/
```

## 🌟 Key Features Explained

### Server-Side Architecture

The Deno server (`server.ts`):
1. Checks if request path starts with `/api` → handle as API
2. Otherwise → serve static files from `dist/`

### API Communication

Frontend makes fetch requests to `/api/hello`:
```typescript
const response = await fetch('/api/hello');
const data = await response.json();
```

Backend responds with JSON:
```typescript
return new Response(JSON.stringify(data), {
  headers: { "content-type": "application/json" }
});
```

### Serverless Benefits

- 🚀 Scales to zero (no cost when idle)
- ⚡ Edge computing (fast globally)
- 🔒 Secure by default
- 💰 Pay per use

## 📊 Cost Estimation

For 1000 apps like this:
- **Low traffic** (1K requests/app/month): ~$20-50/month
- **Medium traffic** (10K requests/app/month): ~$50-150/month
- **High traffic** (100K requests/app/month): ~$200-500/month

*Contact Deno for exact enterprise pricing*

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📝 License

MIT

## 🔗 Links

- [Deno Documentation](https://deno.land/manual)
- [Deno Deploy](https://deno.com/deploy)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

Built with ❤️ using modern web technologies
