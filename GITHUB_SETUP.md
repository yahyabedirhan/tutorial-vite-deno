# 🚀 GitHub Actions Setup Guide

## How GitHub Actions Authentication Works

GitHub Actions uses **OIDC (OpenID Connect)** to authenticate with Deno Deploy. This means:

✅ **No tokens needed** in GitHub Secrets  
✅ **More secure** - GitHub authenticates directly  
✅ **Automatic** - Just link your repo once  

---

## 📋 Step-by-Step Setup

### Step 1: Create/Choose a Deno Deploy Project

**Option A: Use Existing Project**
1. Go to [dash.deno.com](https://dash.deno.com)
2. Note your project name (e.g., "kind-boar-83")

**Option B: Create New Project**
1. Go to [dash.deno.com](https://dash.deno.com)
2. Click "New Project"
3. Choose a name or let it auto-generate
4. Don't connect GitHub yet - we'll do that next

---

### Step 2: Link GitHub Repository to Deno Deploy

1. **Go to your Deno Deploy project:**
   - Visit: https://dash.deno.com/projects/your-project-name

2. **Click "Settings" tab**

3. **Under "Git Integration":**
   - Click "Link GitHub repository"
   - Authorize Deno Deploy to access your GitHub account
   - Select your repository
   - Select branch: `main`
   - **IMPORTANT:** Set "Production branch" to `main`

4. **Under "Build Settings":**
   - Entry point: `server.ts`
   - Build command: (leave empty or add if needed)
   - Install command: `npm ci`

5. **Save settings**

---

### Step 3: Update GitHub Workflow

The workflow file is already configured! Just make sure the project name matches:

```yaml
# .github/workflows/deploy.yml
project: "kind-boar-83"  # ← Change this to YOUR project name
```

---

### Step 4: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   cd vite-deno-app
   git init
   git add .
   git commit -m "Initial commit: Vite + React + Deno app"
   ```

2. **Create GitHub Repository:**
   - Go to [github.com/new](https://github.com/new)
   - Create a new repository
   - Copy the repository URL

3. **Push to GitHub:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/username/repo.git
   git push -u origin main
   ```

4. **Watch the Magic! ✨**
   - Go to your repo → Actions tab
   - You'll see the workflow running
   - Wait for it to complete
   - Your app will be deployed!

---

## 🔍 Verification

### Check Deployment Status

**In GitHub:**
1. Go to your repo
2. Click "Actions" tab
3. Click on the latest workflow run
4. Watch the deployment steps

**In Deno Deploy:**
1. Go to [dash.deno.com](https://dash.deno.com)
2. Click your project
3. You'll see the new deployment
4. Click on it to see logs and URL

---

## 🎯 How It Works

### Authentication Flow:

```
1. You push code to GitHub (main branch)
   ↓
2. GitHub Actions workflow triggers
   ↓
3. Workflow builds your app (npm run build)
   ↓
4. GitHub requests OIDC token from Deno Deploy
   ↓
5. Deno Deploy verifies GitHub's identity
   ↓
6. Deployment proceeds (no tokens needed!)
   ↓
7. Your app is live! 🎉
```

### Key Points:

✅ **No Secrets Required** - OIDC handles authentication  
✅ **Secure** - Tokens never stored in GitHub  
✅ **Automatic** - Deploys on every push to main  
✅ **Same Project** - Always deploys to your linked project  

---

## ⚙️ Workflow Configuration

Your `.github/workflows/deploy.yml` does the following:

```yaml
on:
  push:
    branches: [main]    # Triggers on push to main
  
permissions:
  id-token: write       # Enables OIDC authentication
  contents: read        # Read repository contents

steps:
  1. Checkout code
  2. Setup Node.js (for npm)
  3. Install dependencies (npm ci)
  4. Build Vite app (npm run build)
  5. Setup Deno
  6. Deploy to Deno Deploy (using OIDC)
```

---

## 🔧 Troubleshooting

### Issue: "Project not found"

**Solution:**
- Make sure project name in workflow matches Deno Deploy
- Check: `project: "your-project-name"` in deploy.yml

### Issue: "Authentication failed"

**Solution:**
1. Ensure repository is linked in Deno Deploy settings
2. Check permissions in workflow (id-token: write)
3. Re-link GitHub integration in Deno Deploy

### Issue: "Build failed"

**Solution:**
- Check GitHub Actions logs for specific error
- Ensure `npm ci` and `npm run build` work locally
- Verify `dist/` folder is created

### Issue: "server.ts not found"

**Solution:**
- Make sure `server.ts` is in repository root (not in src/)
- Check `entrypoint: server.ts` in workflow
- Verify file is committed to git

---

## 📊 Comparison: API vs GitHub Actions

| Feature | API Deployment | GitHub Actions |
|---------|---------------|----------------|
| **Auth** | Manual tokens | OIDC (automatic) |
| **Setup** | .env file | Link GitHub repo |
| **Trigger** | Manual command | Automatic (on push) |
| **Projects** | Creates new each time* | Same project |
| **Best For** | Testing, scripts | Production, CI/CD |

*Unless modified to use existing project

---

## 🎓 Advanced Configuration

### Deploy Only on Tag Releases

```yaml
on:
  push:
    tags:
      - 'v*'
```

### Add Environment Variables

```yaml
- name: Deploy to Deno Deploy
  uses: denoland/deployctl@v1
  with:
    project: "your-project"
    entrypoint: server.ts
  env:
    MY_VAR: ${{ secrets.MY_VAR }}
```

### Deploy to Staging vs Production

```yaml
- name: Deploy to Deno Deploy
  uses: denoland/deployctl@v1
  with:
    project: ${{ github.ref == 'refs/heads/main' && 'prod-project' || 'staging-project' }}
    entrypoint: server.ts
```

---

## 🚀 Ready to Deploy!

Once set up, your workflow is:

```bash
# Make changes
vim src/App.tsx

# Commit and push
git add .
git commit -m "Update title"
git push

# ✨ Automatically deploys!
```

No manual deployment needed - GitHub Actions handles everything!

---

## 📞 Need Help?

- **GitHub Actions Logs**: Check Actions tab in your repo
- **Deno Deploy Logs**: Check project dashboard
- **Deno Discord**: [discord.gg/deno](https://discord.gg/deno)

---

**Happy Auto-Deploying! 🎉**

