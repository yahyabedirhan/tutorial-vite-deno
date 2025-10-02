# 🤖 Fully Automated GitHub CI/CD Setup (No Dashboard Required)

This guide shows how to set up GitHub Actions deployment using **only API and CI/CD** - no manual dashboard configuration needed!

## 🎯 Architecture

```
GitHub Actions (CI/CD)
  ↓
  Build Vite app
  ↓
  Use Deno Deploy API (with token)
  ↓
  Deploy to existing or new project
  ↓
  Done! 🎉
```

---

## 📋 Setup Steps

### Step 1: Get Your Deno Deploy Credentials

1. **Get Access Token:**
   - Go to: https://dash.deno.com/account#access-tokens
   - Click "New Access Token"
   - Give it a name (e.g., "GitHub Actions")
   - Copy the token (you'll only see it once!)

2. **Get Organization ID:**
   - Go to: https://dash.deno.com/orgs
   - Look at the URL or settings to find your org ID
   - It looks like: `abc123-def456-ghi789`

---

### Step 2: Add Secrets to GitHub Repository

1. **Go to your GitHub repository**
   - Settings → Secrets and variables → Actions

2. **Click "New repository secret"**

3. **Add these secrets:**

   **Secret 1: DEPLOY_ACCESS_TOKEN**
   ```
   Name: DEPLOY_ACCESS_TOKEN
   Value: <your-access-token-from-step-1>
   ```

   **Secret 2: DEPLOY_ORG_ID**
   ```
   Name: DEPLOY_ORG_ID
   Value: <your-org-id-from-step-1>
   ```

   **Secret 3: PROJECT_NAME** (Optional)
   ```
   Name: PROJECT_NAME
   Value: my-awesome-app
   ```
   
   If you set PROJECT_NAME:
   - ✅ It will deploy to same project every time
   - ✅ If project doesn't exist, it creates it
   - ❌ If you don't set it, creates a new project each time

---

### Step 3: Push to GitHub

```bash
cd vite-deno-app

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Vite + React + Deno"

# Create GitHub repo at github.com/new

# Push to GitHub
git branch -M main
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

---

### Step 4: Watch It Deploy! 🚀

1. **Go to your repo → Actions tab**
2. **Click on the workflow run**
3. **Watch the steps:**
   - ✓ Checkout code
   - ✓ Setup Node.js
   - ✓ Install dependencies
   - ✓ Build Vite app
   - ✓ Setup Deno
   - ✓ Deploy via API

4. **Check deployment output:**
   ```
   🚀 Starting deployment to Deno Subhosting...
   📦 Reading server file...
   📦 Reading built assets...
   ✓ Found existing project: my-awesome-app
   🚢 Deploying application...
   ✅ Deployment successful!
   🌐 Your app is live at: https://...
   ```

---

## 🎨 How It Works

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml

on:
  push:
    branches: [main]  # Triggers on push to main

jobs:
  deploy:
    steps:
      - Build the Vite app
      - Run deploy_to_subhosting.ts
      - Uses secrets from GitHub
      - Deploys via Deno API
```

### Deployment Script

The `deploy_to_subhosting.ts` script:
1. Reads `DEPLOY_ACCESS_TOKEN` and `DEPLOY_ORG_ID` from environment
2. Checks if `PROJECT_NAME` is set
3. If PROJECT_NAME exists:
   - Looks for existing project
   - Deploys to it if found
   - Creates it if not found
4. If no PROJECT_NAME:
   - Creates new project with random name

---

## 🔑 Environment Variables

| Variable | Required | Source | Purpose |
|----------|----------|--------|---------|
| `DEPLOY_ACCESS_TOKEN` | ✅ Yes | GitHub Secret | API authentication |
| `DEPLOY_ORG_ID` | ✅ Yes | GitHub Secret | Your organization |
| `PROJECT_NAME` | ⚠️ Optional | GitHub Secret | Deploy to same project |

---

## 🎯 Two Deployment Modes

### Mode 1: Same Project Every Time (Recommended)

**Set PROJECT_NAME secret:**
```
PROJECT_NAME=my-vite-app
```

**Result:**
```
Push #1 → Deploys to "my-vite-app"
Push #2 → Deploys to "my-vite-app" (same project)
Push #3 → Deploys to "my-vite-app" (same project)
```

**Advantages:**
- ✅ Consistent URL
- ✅ Deployment history
- ✅ Production ready

---

### Mode 2: New Project Each Time

**Don't set PROJECT_NAME secret**

**Result:**
```
Push #1 → Creates "happy-dino-12"
Push #2 → Creates "great-rhino-53"
Push #3 → Creates "cool-whale-89"
```

**Advantages:**
- ✅ Good for testing
- ✅ Each deployment isolated
- ⚠️ Creates many projects (cleanup needed)

---

## 📊 Complete Workflow

```bash
# 1. Make changes locally
vim src/App.tsx

# 2. Commit changes
git add .
git commit -m "Update homepage"

# 3. Push to GitHub
git push

# 4. GitHub Actions automatically:
   - Builds your app
   - Deploys via API
   - Updates/creates project
   
# 5. Done! Check Actions tab for deployment URL
```

---

## 🧪 Testing Locally Before Push

```bash
# Test the full deployment locally
npm run deploy

# This uses your local .env file
# GitHub Actions will use secrets instead
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Store tokens in GitHub Secrets (encrypted)
- Use separate tokens for dev/prod
- Rotate tokens periodically
- Use minimal required permissions

### ❌ DON'T:
- Commit `.env` to git (already in .gitignore)
- Share tokens in logs or output
- Use the same token everywhere
- Store tokens in code

---

## 🔧 Troubleshooting

### Issue: "DEPLOY_ACCESS_TOKEN is undefined"

**Solution:**
```bash
# Check secrets are set in GitHub:
# Settings → Secrets and variables → Actions
# Make sure you added:
#   - DEPLOY_ACCESS_TOKEN
#   - DEPLOY_ORG_ID
```

### Issue: "Project not found"

**Solution:**
```bash
# If using PROJECT_NAME:
# 1. Check the name is correct (case-sensitive)
# 2. The script will create it if it doesn't exist
# 3. Check GitHub Actions logs for details
```

### Issue: "Authentication failed"

**Solution:**
```bash
# 1. Check token is valid
# 2. Go to dash.deno.com/account#access-tokens
# 3. Generate new token if expired
# 4. Update GitHub secret
```

### Issue: "Deployment succeeds but app doesn't work"

**Solution:**
```bash
# 1. Check build succeeded: npm run build
# 2. Check dist/ folder exists
# 3. Test locally: deno task dev
# 4. Check GitHub Actions logs for errors
```

---

## 📈 Monitoring Deployments

### In GitHub:
1. Actions tab → See all deployments
2. Each workflow run shows:
   - Build logs
   - Deployment output
   - Deployment URL

### Via Deno Dashboard:
1. https://dash.deno.com/projects
2. Find your project
3. See deployment history

### Via API:
```bash
# List deployments for a project
curl -H "Authorization: Bearer $TOKEN" \
  https://api.deno.com/v1/projects/PROJECT_ID/deployments
```

---

## 🎓 Advanced: Multiple Environments

### Deploy to Staging and Production

**Add secrets:**
```
STAGING_PROJECT_NAME=my-app-staging
PRODUCTION_PROJECT_NAME=my-app-prod
```

**Update workflow:**
```yaml
- name: Deploy
  env:
    DEPLOY_ACCESS_TOKEN: ${{ secrets.DEPLOY_ACCESS_TOKEN }}
    DEPLOY_ORG_ID: ${{ secrets.DEPLOY_ORG_ID }}
    PROJECT_NAME: ${{ github.ref == 'refs/heads/main' && secrets.PRODUCTION_PROJECT_NAME || secrets.STAGING_PROJECT_NAME }}
  run: deno run --allow-env --allow-net --allow-read deploy_to_subhosting.ts
```

**Result:**
- Push to `main` → Deploys to production
- Push to other branches → Deploys to staging

---

## 💰 Cost Considerations

**GitHub Actions:**
- Free for public repositories
- 2000 minutes/month for private repos (free tier)

**Deno Deploy:**
- Free tier: 100K requests/month
- Pro tier: $20/month for 5M requests
- Only pay for what you use (serverless)

**Multiple Projects:**
- If creating new project each push, remember to clean up
- Use `PROJECT_NAME` secret to avoid accumulating projects

---

## 🧹 Cleanup Old Projects

If you deployed without PROJECT_NAME and have many projects:

```bash
# Use the delete script from parent directory
cd ..
deno task delete-projects
```

---

## ✅ Checklist

Before first deployment:

- [ ] Generated Deno Deploy access token
- [ ] Got organization ID
- [ ] Added `DEPLOY_ACCESS_TOKEN` to GitHub Secrets
- [ ] Added `DEPLOY_ORG_ID` to GitHub Secrets
- [ ] (Optional) Added `PROJECT_NAME` to GitHub Secrets
- [ ] Pushed code to GitHub
- [ ] Checked Actions tab for workflow run
- [ ] Verified deployment succeeded

---

## 🎉 You're Done!

Now every time you push to `main`, your app automatically:
1. ✅ Builds via GitHub Actions
2. ✅ Deploys via Deno API
3. ✅ Updates your project
4. ✅ Goes live instantly!

**No dashboard needed. Pure automation!** 🤖

---

## 📞 Need Help?

- Check GitHub Actions logs (Actions tab)
- Check deployment script output
- Review this guide
- Ask in Deno Discord: discord.gg/deno

---

**Happy Automated Deploying! 🚀**

