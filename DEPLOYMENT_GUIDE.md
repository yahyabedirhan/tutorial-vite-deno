# 🚀 Deployment Guide

This guide will help you deploy your Vite + React + Deno app to Deno Deploy.

## Prerequisites

1. ✅ **Deno Deploy Account** - Sign up at [dash.deno.com](https://dash.deno.com)
2. ✅ **GitHub Account** - For CI/CD deployment
3. ✅ **Access Token & Org ID** - For API deployment

---

## 🎯 Deployment Methods

### Method 1: GitHub Actions (Recommended) ⭐

**Best for:** Production apps with continuous deployment

#### Steps:

1. **Create Deno Deploy Project**
   ```bash
   # Go to https://dash.deno.com
   # Click "New Project"
   # Note the project name
   ```

2. **Update GitHub Workflow**
   ```yaml
   # Edit .github/workflows/deploy.yml
   # Change this line:
   project: "your-project-name"  # <- Use your project name
   ```

3. **Create GitHub Repository**
   ```bash
   cd vite-deno-app
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   ```

4. **Link to Deno Deploy**
   - Go to your Deno Deploy project settings
   - Connect to GitHub repository
   - Select the repository you just created

5. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/username/repo.git
   git push -u origin main
   ```

6. **Automatic Deployment!**
   - Every push to `main` triggers automatic deployment
   - Check deployment status in GitHub Actions tab

#### ✅ Advantages:
- ✓ Fully automated
- ✓ Deployment history
- ✓ Easy rollbacks
- ✓ Production-ready

---

### Method 2: API Deployment (Manual)

**Best for:** Testing, quick deployments, automation scripts

#### Steps:

1. **Get Your Credentials**
   ```bash
   # Get Access Token
   # Go to: https://dash.deno.com/account#access-tokens
   # Create new token
   
   # Get Organization ID
   # Go to: https://dash.deno.com/orgs
   # Check URL or settings for org ID
   ```

2. **Set Environment Variables**
   
   **Option A: Create .env file**
   ```bash
   # In vite-deno-app directory
   echo 'DEPLOY_ACCESS_TOKEN="your-token-here"' > .env
   echo 'DEPLOY_ORG_ID="your-org-id-here"' >> .env
   ```
   
   **Option B: Export in terminal**
   ```bash
   export DEPLOY_ACCESS_TOKEN="your-token-here"
   export DEPLOY_ORG_ID="your-org-id-here"
   ```

3. **Build and Deploy**
   ```bash
   npm run deploy
   ```
   
   Or manually:
   ```bash
   npm run build
   deno run --allow-env --allow-net --allow-read deploy_to_subhosting.ts
   ```

4. **Visit Your App**
   ```
   The script will output:
   🌐 Your app is live at:
      https://project-name-deployment-id.deno.dev
   ```

#### ✅ Advantages:
- ✓ Quick deployment
- ✓ No GitHub needed
- ✓ Good for testing
- ✓ Scriptable

---

### Method 3: Deno Deploy CLI

**Best for:** Local testing, manual deployments

#### Steps:

1. **Install deployctl**
   ```bash
   deno install -Arf jsr:@deno/deployctl
   ```

2. **Link Your Project**
   ```bash
   # Create project on dash.deno.com first
   deployctl deploy --project=your-project-name server.ts
   ```

3. **Build First**
   ```bash
   npm run build
   deployctl deploy --project=your-project-name server.ts
   ```

#### ✅ Advantages:
- ✓ Simple CLI
- ✓ Direct control
- ✓ Fast iteration

---

## 🧪 Testing Locally

Before deploying, test everything locally:

### 1. Test Production Build

```bash
# Build the app
npm run build

# Run Deno server
deno task dev

# Visit http://localhost:8000
# Test API: http://localhost:8000/api/hello
```

### 2. Development Mode

```bash
# Terminal 1: Vite dev server (with HMR)
npm run dev

# Terminal 2: Deno backend
deno task dev

# Visit http://localhost:5173 (Vite proxies API to :8000)
```

---

## 🔧 Troubleshooting

### Issue: "DEPLOY_ACCESS_TOKEN is undefined"

**Solution:**
```bash
# Make sure .env file exists
cat .env

# Or export variables
export DEPLOY_ACCESS_TOKEN="your-token"
export DEPLOY_ORG_ID="your-org-id"
```

### Issue: "Cannot find dist/index.html"

**Solution:**
```bash
# Build first!
npm run build

# Check dist folder exists
ls -la dist/
```

### Issue: GitHub Actions failing

**Solution:**
1. Check project name in `.github/workflows/deploy.yml`
2. Ensure project exists on Deno Deploy
3. Check GitHub Actions logs for specific error

### Issue: API calls not working

**Solution:**
1. Check Deno server is running: `deno task dev`
2. Verify API endpoints work: `curl http://localhost:8000/api/hello`
3. Check browser console for CORS errors
4. Ensure vite.config.ts has proxy configuration

---

## 📊 Monitoring

After deployment, monitor your app:

1. **Deno Deploy Dashboard**
   - Visit: https://dash.deno.com/projects/your-project
   - Check: Requests, errors, performance

2. **Logs**
   ```bash
   # View logs in Deno Deploy dashboard
   # Or use deployctl
   deployctl logs --project=your-project-name
   ```

3. **Analytics**
   - Request counts
   - Response times
   - Error rates
   - Geographic distribution

---

## 💰 Cost Management

For 1000 apps:

| Traffic Level | Requests/App/Month | Total Cost (Est.) |
|---------------|-------------------|-------------------|
| Low | 1,000 | $20-50/month |
| Medium | 10,000 | $50-150/month |
| High | 100,000 | $200-500/month |

**Tips:**
- Start with Free/Pro tier for testing
- Contact Deno for Enterprise pricing
- Monitor usage in dashboard
- Set up billing alerts

---

## 🎯 Best Practices

### 1. Environment Variables
```bash
# Never commit .env to git
echo ".env" >> .gitignore

# Use separate tokens for dev/prod
```

### 2. Build Optimization
```bash
# Always build before deploying
npm run build

# Check build size
ls -lh dist/assets/
```

### 3. Testing
```bash
# Test locally first
deno task dev

# Test all API endpoints
curl http://localhost:8000/api/hello
curl http://localhost:8000/api/random
curl http://localhost:8000/api/health
```

### 4. Version Control
```bash
# Use semantic versioning
git tag v1.0.0
git push --tags

# Create releases on GitHub
```

---

## 🔗 Useful Commands

```bash
# Full development cycle
npm install          # Install dependencies
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run server      # Run Deno backend
npm run deploy      # Build and deploy

# Deno-specific
deno task dev       # Run Deno server directly
deno fmt           # Format code
deno lint          # Lint code

# Git workflow
git add .
git commit -m "Update"
git push           # Triggers GitHub Actions
```

---

## 📞 Need Help?

- **Deno Discord**: [discord.gg/deno](https://discord.gg/deno)
- **Deno Deploy Docs**: [deno.com/deploy/docs](https://deno.com/deploy/docs)
- **GitHub Issues**: Create an issue in your repo

---

**Happy Deploying! 🚀**

