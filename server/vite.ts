import { fileURLToPath } from "url";
import path from "path";
import express, { type Express } from "express";
import fs from "fs";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

// ✅ תיקון נכון לשימוש בנתיב
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Resolve paths relative to project root (not client root)
  const projectRoot = path.resolve(__dirname, "..");
  
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    root: viteConfig.root, // Keep client as root for Vite
    resolve: {
      ...viteConfig.resolve,
      alias: {
        ...viteConfig.resolve?.alias,
        // Ensure @shared resolves correctly from project root
        "@shared": path.resolve(projectRoot, "shared"),
        "@shared/*": path.resolve(projectRoot, "shared/*"),
      },
    },
    server: {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: [
        'crm.tanandco.co.il',
        'localhost',
        '127.0.0.1',
        '.tanandco.co.il', // Allow all subdomains
      ],
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
  
  // Return vite instance so catch-all route can be added after all routes
  return vite;
}

export function serveStatic(app: Express) {
  // Vite בונה ל-dist (בשורש), לא ל-client/dist
  const distPath = path.resolve(__dirname, "../dist");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `⚠️ Build folder not found at ${distPath}. Please run 'npm run build' first.`
    );
  }

  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
