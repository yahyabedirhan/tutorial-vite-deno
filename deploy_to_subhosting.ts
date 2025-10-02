#!/usr/bin/env -S deno run --allow-env --allow-net --allow-read --env-file

// Deploy Vite React app to Deno Subhosting via API

// Check if we're in the right directory
try {
  await Deno.stat("server.ts");
} catch {
  console.error("❌ Error: Must run this script from the vite-deno-app directory");
  console.error("Run: cd vite-deno-app && npm run deploy");
  Deno.exit(1);
}

const accessToken = Deno.env.get("DEPLOY_ACCESS_TOKEN");
const orgId = Deno.env.get("DEPLOY_ORG_ID");
const projectName = Deno.env.get("PROJECT_NAME"); // Optional: deploy to existing project
const API = "https://api.deno.com/v1";

if (!accessToken || !orgId) {
  console.error("❌ Error: DEPLOY_ACCESS_TOKEN and DEPLOY_ORG_ID must be set");
  console.error("\nOption 1: Create a .env file in vite-deno-app/");
  console.error("  DEPLOY_ACCESS_TOKEN=your-token");
  console.error("  DEPLOY_ORG_ID=your-org-id");
  console.error("\nOption 2: Export them in your terminal:");
  console.error("  export DEPLOY_ACCESS_TOKEN='your-token'");
  console.error("  export DEPLOY_ORG_ID='your-org-id'");
  console.error("\nOption 3: Copy .env from parent directory:");
  console.error("  cp ../.env .");
  console.error("\nFor GitHub Actions, set these as repository secrets.");
  Deno.exit(1);
}

const headers = {
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
};

console.log("🚀 Starting deployment to Deno Subhosting...\n");

// Helper functions
async function readFileAsText(path: string): Promise<string> {
  try {
    return await Deno.readTextFile(path);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error reading ${path}:`, message);
    throw error;
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}

// Check if dist exists
if (!await fileExists("dist/index.html")) {
  console.error("❌ Error: dist/index.html not found!");
  console.error("Run 'npm run build' first to build the Vite app.");
  Deno.exit(1);
}

// Read server.ts
console.log("📦 Reading server file...");
const serverContent = await readFileAsText("server.ts");

// Read built Vite files
console.log("📦 Reading built assets...");
const indexHtml = await readFileAsText("dist/index.html");

// Read assets (you may need to adjust this based on your build output)
const assets: Record<string, { kind: string; content: string; encoding: string }> = {
  "server.ts": {
    kind: "file",
    content: serverContent,
    encoding: "utf-8",
  },
  "dist/index.html": {
    kind: "file",
    content: indexHtml,
    encoding: "utf-8",
  },
};

// Read all JS and CSS files from dist/assets
try {
  for await (const entry of Deno.readDir("dist/assets")) {
    if (entry.isFile) {
      const filePath = `dist/assets/${entry.name}`;
      const content = await readFileAsText(filePath);
      assets[filePath] = {
        kind: "file",
        content: content,
        encoding: "utf-8",
      };
      console.log(`  ✓ Added ${filePath}`);
    }
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn("⚠️  Warning: Could not read assets directory:", message);
}

// Get or create project
let project;

if (projectName) {
  // Try to get existing project by name
  console.log(`\n🔍 Looking for existing project: ${projectName}...`);
  const listProjectsResponse = await fetch(
    `${API}/organizations/${orgId}/projects`,
    { method: "GET", headers },
  );
  
  if (listProjectsResponse.ok) {
    const projects = await listProjectsResponse.json();
    project = projects.find((p: { name: string }) => p.name === projectName);
    
    if (project) {
      console.log(`✓ Found existing project: ${project.name} (${project.id})`);
    } else {
      console.log(`⚠️  Project "${projectName}" not found, creating new one...`);
    }
  }
}

if (!project) {
  // Create new project
  console.log("\n🔨 Creating new project...");
  const projectResponse = await fetch(
    `${API}/organizations/${orgId}/projects`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: projectName || null, // Use specified name or auto-generate
      }),
    },
  );

  if (!projectResponse.ok) {
    console.error("❌ Failed to create project:", await projectResponse.text());
    Deno.exit(1);
  }

  project = await projectResponse.json();
  console.log(`✓ Project created: ${project.name} (${project.id})`);
}

// Deploy
console.log("\n🚢 Deploying application...");
const deploymentResponse = await fetch(
  `${API}/projects/${project.id}/deployments`,
  {
    method: "POST",
    headers,
    body: JSON.stringify({
      entryPointUrl: "server.ts",
      assets,
      envVars: {},
    }),
  },
);

const deployment = await deploymentResponse.json();

if (deploymentResponse.ok) {
  console.log("\n✅ Deployment successful!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🌐 Your app is live at:`);
  console.log(`   https://${project.name}-${deployment.id}.deno.dev`);
  console.log(`\n📡 API endpoint:`);
  console.log(`   https://${project.name}-${deployment.id}.deno.dev/api/hello`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
} else {
  console.error("❌ Deployment failed:");
  console.error(JSON.stringify(deployment, null, 2));
  Deno.exit(1);
}

