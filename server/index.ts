// server/index.ts
import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { bioStarStartup } from "./services/biostar-startup";
import { doorHealthHandler, doorOpenHandler } from "./biostar";

// ====== יצירת אפליקציית אקספרס ======
const app = express();

// ====== ראוטים קטנים לדיבאג (אופציונלי אבל שימושי) ======
app.get("/api/biostar/debug", (req: Request, res: Response) => {
  res.json({
    BIOSTAR_SERVER_URL: process.env.BIOSTAR_SERVER_URL,
    BIOSTAR_USERNAME: process.env.BIOSTAR_USERNAME,
    BIOSTAR_PASSWORD: process.env.BIOSTAR_PASSWORD ? "***set***" : "(missing)",
    DOOR_ID: process.env.BIOSTAR_DOOR_ID || process.env.DOOR_ID || null,
  });
});

// ====== raw body ל-WhatsApp (אם צריך חתימת webhook) ======
app.use("/api/webhooks/whatsapp", express.raw({ type: "application/json" }));

// ====== JSON/URLENCODED לכל שאר הראוטים ======
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ====== BioStar routes (לשים לפני שאר ה-middlewares/Routes) ======
app.get("/api/biostar/health", doorHealthHandler);
// שני נתיבים לפתיחת דלת (alias זהים):
app.all("/api/biostar/open", doorOpenHandler);
app.all("/api/door/open", doorOpenHandler);

// ====== לוג/מדידות פשוטים (לא חובה) ======
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { path, method } = req;
  const original = res.json;
  let bodyJson: unknown;
  (res as any).json = function (b: unknown, ...args: unknown[]) {
    bodyJson = b;
    return (original as any).apply(res, [b, ...args]);
  };
  res.on("finish", () => {
    if (path.startsWith("/api/")) {
      const ms = Date.now() - start;
      console.log(`${method} ${path} ${res.statusCode} in ${ms}ms`, bodyJson ? "" : "");
    }
  });
  next();
});

// ====== רישום ראוטים אחרים של המערכת ======
registerRoutes(app);

// ====== הפעלת Vite/סטטי לפי סביבת העבודה ======
async function start() {
  // Initialize BioStar connection
  try {
    console.log('Starting BioStar initialization...');
    await bioStarStartup.initialize();
  } catch (error) {
    console.error('BioStar initialization failed, continuing without facial recognition:', error);
  }

  const isProd = process.env.NODE_ENV === "production";

  const PORT = Number(process.env.PORT || 5000);
  // ב-production מאזינים על 0.0.0.0 כדי לקבל חיבורים חיצוניים
  // ב-development מאזינים על 127.0.0.1 לביטחון
  const HOST = isProd ? "0.0.0.0" : "127.0.0.1";
  const server = app.listen(PORT, HOST, () => {
    console.log(`[express] serving on ${HOST}:${PORT} (${isProd ? "production" : "development"})`);
  });

  if (isProd) {
    // ב־production מגישים קבצים סטטיים (דרוש build של ה-client)
    try {
      serveStatic(app);
      console.log("[static] serving built client (production)");
    } catch (e: any) {
      console.warn("[static] skipping serveStatic:", e?.message || e);
    }
  } else {
    // ב־development מריצים Vite middleware – לא צריך תיקיית build
    await setupVite(app, server);
    console.log("[vite] dev middleware attached");
  }
}

start().catch((err) => {
  console.error("Fatal start error:", err);
  process.exit(1);
});
