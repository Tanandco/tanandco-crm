// server/index.ts
import dotenv from "dotenv";
dotenv.config({ override: true }); // טעינת משתני סביבה מ-.env (דורס משתני מערכת)
import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { bioStarStartup } from "./services/biostar-startup";
import { doorHealthHandler, doorOpenHandler, emergencyDoorOpenHandler } from "./biostar";

// ====== יצירת אפליקציית אקספרס ======
const app = express();

// ====== דיבאג ל-BioStar ======
app.get("/api/biostar/debug", (req: Request, res: Response) => {
  res.json({
    BIOSTAR_SERVER_URL: process.env.BIOSTAR_SERVER_URL,
    BIOSTAR_USERNAME: process.env.BIOSTAR_USERNAME,
    BIOSTAR_PASSWORD: process.env.BIOSTAR_PASSWORD ? "***set***" : "(missing)",
    DOOR_ID: process.env.BIOSTAR_DOOR_ID || process.env.DOOR_ID || null,
  });
});

// ====== raw body ל-WhatsApp ======
app.use("/api/webhooks/whatsapp", express.raw({ type: "application/json" }));

// ====== טיפול ב-Host header מ-Cloudflare Tunnel ======
app.use((req: Request, res: Response, next: NextFunction) => {
  // Cloudflare Tunnel שולח את ה-Host header המקורי
  // Vite צריך את זה כדי לאפשר את ה-host
  const host = req.get('host') || req.get('x-forwarded-host') || 'localhost:3001';
  req.headers.host = host;
  next();
});

// ====== JSON לכל שאר הראוטים ======
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ====== נתיבי BioStar ======
app.get("/api/biostar/health", doorHealthHandler);
app.all("/api/biostar/open", doorOpenHandler);
app.all("/api/door/open", doorOpenHandler);
// ====== כפתור חירום - ללא תלות בשום גורם ======
app.all("/api/emergency/door/open", emergencyDoorOpenHandler);
app.all("/api/emergency/open", emergencyDoorOpenHandler);

// ====== לוגים פשוטים ======
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, path } = req;
  const originalJson = res.json;

  (res as any).json = function (body: unknown, ...args: unknown[]) {
    return (originalJson as any).apply(this, [body, ...args]);
  };

  res.on("finish", () => {
    if (path.startsWith("/api/")) {
      const took = Date.now() - start;
      console.log(`${method} ${path} → ${res.statusCode} (${took}ms)`);
    }
  });

  next();
});

// ====== הפעלה ======
async function start() {
  // ניסיון חיבור לביוסטאר
  try {
    console.log("Starting BioStar initialization...");
    await bioStarStartup.initialize();
  } catch (error) {
    console.error("BioStar initialization failed — continuing without facial recognition:", error);
  }

  const isProd = process.env.NODE_ENV === "production";

  // ====== הפורט && ההוסט ======
  // בפיתוח: פורט 5080 (לא 5000 - זה BioStar!)
  // בפרודקשן: Cloud Run קובע את הפורט דרך PORT env var
  const PORT = Number(process.env.PORT || (isProd ? 5000 : 5080));
  const HOST = isProd ? "0.0.0.0" : "127.0.0.1";

  const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT} (${isProd ? "production" : "development"})`);
  });

  // ====== פרודקשן → מגיש סטטי ======
  if (isProd) {
    try {
      serveStatic(app);
      console.log("[static] serving built client (production)");
    } catch (e: any) {
      console.warn("[static] static serve failed:", e?.message);
    }
    return;
  }

  // ====== דב → מפעיל Vite כ־middleware לפני ה-routes ======
  let vite;
  try {
    vite = await setupVite(app, server);
    console.log("[vite] dev middleware attached");
  } catch (e: any) {
    console.error("[vite] failed to attach middleware:", e?.message);
    return;
  }

  // ====== רישום ראוטים כללי אחרי Vite middleware ======
  registerRoutes(app);

  // ====== Catch-all route למסירת ה-HTML של React - חייב להיות אחרון! ======
  app.use("*", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileURLToPath } = await import("url");
      const pathModule = await import("path");
      const { nanoid } = await import("nanoid");
      const fs = await import("fs");

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = pathModule.dirname(__filename);
      const clientTemplate = pathModule.resolve(__dirname, "../client/index.html");

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      const page = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (err) {
      vite.ssrFixStacktrace(err as Error);
      next(err);
    }
  });
}

start().catch((err) => {
  console.error("Fatal start error:", err);
  process.exit(1);
});
