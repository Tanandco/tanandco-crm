import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "client"), // 👈 זה מכוון את Vite לתיקיית client
  build: {
    outDir: path.resolve(__dirname, "dist"),
  },
  server: {
    port: 5173,
    open: true,
  },
});
