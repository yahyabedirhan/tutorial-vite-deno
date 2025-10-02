# ⚡ Quick Start Guide

## 🎯 Two Ways to Deploy

### Option 1: Manual Deployment (API) - Quick Testing

**Use this for:** Quick tests, creating multiple projects

```bash
# 1. Make sure .env file exists with credentials
cat .env

# 2. Deploy
npm run deploy

# ✓ Creates a new project each time
# ✓ No GitHub needed
```

---

### Option 2: GitHub Actions - Production/CI/CD

**Use this for:** Production apps, automatic deployment

**One-Time Setup:**

1. **Update project name in workflow:**
   ```bash
   # Edit .github/workflows/deploy.yml
   # Change line 44:
   project: "your-project-name"  # ← Your Deno Deploy project
   ```

2. **Link GitHub to Deno Deploy:**
   - Go to https://dash.deno.com/projects/your-project-name
   - Settings → Git Integration
   - Link your GitHub repository
   - Select `main` branch

3. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/repo.git
   git push -u origin main
   ```

4. **Done!** Every push to `main` auto-deploys! 🎉

---

## 🔑 Key Differences

| | **Manual (API)** | **GitHub Actions** |
|---|---|---|
| **Authentication** | Tokens in `.env` | OIDC (auto) |
| **Command** | `npm run deploy` | `git push` |
| **Creates** | New project | Updates same project |
| **When** | On demand | Every push |

---

## 🚀 Recommended Workflow

**For Development:**
```bash
# Local testing
npm run build
deno task dev

# Manual deploy to test
npm run deploy
```

**For Production:**
```bash
# Make changes
vim src/App.tsx

# Push to trigger auto-deploy
git add .
git commit -m "Update"
git push
```

---

## 📖 Detailed Guides

- **GITHUB_SETUP.md** - Complete GitHub Actions setup
- **DEPLOYMENT_GUIDE.md** - All deployment methods
- **README.md** - Full project documentation

---

## 💡 Pro Tip

Use **both methods**:
- Manual deployment for quick testing
- GitHub Actions for production

They can coexist! Each serves a different purpose.

---

**Questions?** Check the detailed guides above! 📚

