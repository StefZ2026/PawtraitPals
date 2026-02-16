import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

console.log("Building Pawtrait Pals...");

// Step 1: Build the client with Vite
console.log("\n[1/3] Building client...");
execSync("npx vite build", { cwd: rootDir, stdio: "inherit" });

// Step 2: Bundle the server with esbuild
console.log("\n[2/3] Bundling server...");
execSync(
  `npx esbuild server/index.ts --bundle --platform=node --format=cjs --outfile=dist/index.cjs --packages=external --loader:.ts=ts --target=node20`,
  { cwd: rootDir, stdio: "inherit" }
);

// Step 3: Copy client build to dist/public
console.log("\n[3/3] Copying client assets...");
const clientDist = path.join(rootDir, "client", "dist", "public");
const serverPublic = path.join(rootDir, "dist", "public");

if (fs.existsSync(clientDist)) {
  fs.cpSync(clientDist, serverPublic, { recursive: true });
  console.log("Client assets copied to dist/public/");
} else {
  console.error("Warning: client/dist/public not found, checking client/dist...");
  const altDist = path.join(rootDir, "client", "dist");
  if (fs.existsSync(altDist)) {
    fs.cpSync(altDist, serverPublic, { recursive: true });
    console.log("Client assets copied from client/dist/");
  }
}

console.log("\nBuild complete! Run 'npm run start' to launch.");
