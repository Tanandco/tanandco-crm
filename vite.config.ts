import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "client"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@shared/*": path.resolve(__dirname, "shared/*")
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
  },
  // Note: In development, Vite runs as middleware through Express server (port 3000)
  // This config is only used if running 'npm run dev' standalone
  server: {
    port: 5173,
    host: true,
    open: false, // Don't auto-open when running standalone
    allowedHosts: [
      'crm.tanandco.co.il',
      'localhost',
      '127.0.0.1',
      '.tanandco.co.il', // Allow all subdomains
    ],
  },
});
