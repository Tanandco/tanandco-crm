// server/biostar.ts
import type { RequestHandler } from "express";

// ========= ENV =========
export const BASE = (process.env.BIOSTAR_SERVER_URL ?? "").replace(/\/+$/, "");
export const USER = process.env.BIOSTAR_USERNAME ?? "";
export const PASS = process.env.BIOSTAR_PASSWORD ?? "";
export const DEFAULT_DOOR_ID =
  Number(process.env.BIOSTAR_DOOR_ID ?? 0) || undefined;

function requireEnv(): string | null {
  if (!BASE) return "BIOSTAR_SERVER_URL missing";
  if (!USER) return "BIOSTAR_USERNAME missing";
  if (!PASS) return "BIOSTAR_PASSWORD missing";
  return null;
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36";
const ORI = BASE;
const REF = BASE.replace(/\/+$/, "") + "/";

function commonHeaders() {
  return {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": UA,
    Origin: ORI,
    Referer: REF,
  } as Record<string, string>;
}

function apiHeadersWithSID(sid: string) {
  const cookie = `be-session-id=${sid}; bs-session-id=${sid}`;
  return {
    ...commonHeaders(),
    "be-session-id": sid,
    "bs-session-id": sid,
    Cookie: cookie,
  } as Record<string, string>;
}

function sidFromHeaders(h: Headers): string | null {
  const d = h.get("be-session-id") || h.get("bs-session-id");
  if (d) return d;
  const sc = h.get("set-cookie");
  if (sc) {
    const m = sc.match(/(?:^|;|\s)(?:be-session-id|bs-session-id)=([^;]+)/i);
    if (m) return m[1];
  }
  return null;
}

// ======== AUTH (v1 -> v2 fallback) ========
async function loginV1(): Promise<string> {
  const url = `${BASE}/api/login`;
  const body = JSON.stringify({ User: { login_id: USER, password: PASS } });
  const r = await fetch(url, {
    method: "POST",
    headers: { ...commonHeaders(), "Content-Type": "application/json" },
    body,
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`login(v1) HTTP ${r.status}: ${t}`);
  const sid = sidFromHeaders(r.headers);
  if (!sid) throw new Error(`login(v1) no SID in headers`);
  return sid;
}

async function loginV2(): Promise<string> {
  const url = `${BASE}/api/v2/login`;
  const pair = Buffer.from(`${USER}:${PASS}`).toString("base64");
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Basic ${pair}`, ...commonHeaders() },
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`login(v2) HTTP ${r.status}: ${t}`);
  const sid = sidFromHeaders(r.headers);
  if (!sid) throw new Error(`login(v2) no SID in headers`);
  return sid;
}

async function login(): Promise<string> {
  try {
    return await loginV1();
  } catch (e1: any) {
    try {
      return await loginV2();
    } catch (e2: any) {
      throw new Error(`Login failed: ${e1?.message} | ${e2?.message}`);
    }
  }
}

type DoorLite = { id: string; name?: string; entryDeviceId?: string };

async function listDoors(sid: string, trace: any[]): Promise<DoorLite[]> {
  const H = apiHeadersWithSID(sid);
  const url = `${BASE}/api/doors`;
  try {
    const r = await fetch(url, { headers: H });
    const txt = await r.text();
    trace.push({ step: "GET /api/doors", status: r.status, body: cut(txt) });
    if (!r.ok) return [];
    const j = JSON.parse(txt);
    const rows: any[] =
      j?.DoorCollection?.rows ??
      j?.DoorCollection ??
      (Array.isArray(j) ? j : []);
    const out: DoorLite[] = [];
    for (const row of rows) {
      const id =
        row?.id?.toString() ??
        row?.door_id?.toString() ??
        row?.idx?.toString();
      if (!id) continue;
      const name =
        row?.name ?? row?.door_name ?? row?.text ?? row?.label ?? undefined;
      const entryDeviceId =
        row?.entry_device_id?.id?.toString() ??
        row?.device_id?.toString() ??
        undefined;
      out.push({ id, name, entryDeviceId });
    }
    return out;
  } catch (e: any) {
    trace.push({ step: "GET /api/doors", error: String(e) });
    return [];
  }
}

function cut(s: string, n = 220) {
  return (s || "").slice(0, n);
}

async function tryPost(
  url: string,
  H: Record<string, string>,
  body: string | undefined,
  ct: "json" | "form" | null,
  trace: any[]
) {
  const headers = { ...H };
  if (ct === "json") headers["Content-Type"] = "application/json";
  if (ct === "form") headers["Content-Type"] = "application/x-www-form-urlencoded";
  const r = await fetch(url, { method: "POST", headers, body });
  const txt = await r.text();
  trace.push({ step: `POST ${new URL(url).pathname}${new URL(url).search}`, status: r.status, body: cut(txt) });
  return { ok: r.ok && /"code"\s*:\s*"0"/.test(txt), status: r.status, txt };
}

async function openDoorInternal(
  sid: string,
  doorId: number,
  entryDeviceId: string | undefined,
  trace: any[]
) {
  const H = apiHeadersWithSID(sid);
  const idStr = String(doorId);

  // 1) endpoints על דלת יחידה
  const singlePaths = [
    `/api/doors/${idStr}/open`,
    `/api/doors/${idStr}/unlock`,
    `/api/doors/${idStr}/unlatch`,
    `/api/v2/doors/${idStr}/open`,
    `/api/v2/doors/${idStr}/unlock`,
    `/api/v2/doors/${idStr}/unlatch`,
  ];

  for (const p of singlePaths) {
    const r = await tryPost(`${BASE}${p}`, H, "", null, trace);
    if (r.ok) return { ok: true, endpoint: p, status: r.status, body: r.txt };
  }

  // 2) endpoints על מערך דלתות (payload שונים)
  const bulk = [
    { p: "/api/doors/open", ct: "json", body: JSON.stringify({ ids: [doorId] }) },
    { p: "/api/doors/open", ct: "json", body: JSON.stringify({ door_ids: [doorId] }) },
    { p: "/api/doors/open", ct: "json", body: JSON.stringify({ id: [doorId] }) },
    { p: "/api/doors/open", ct: "json", body: JSON.stringify({ DoorCollection: { rows: [{ id: idStr }] } }) },
    { p: "/api/doors/open", ct: "form", body: `ids=${encodeURIComponent(idStr)}` },
    { p: "/api/door/open", ct: "json", body: JSON.stringify({ id: doorId }) }, // צורה סינגולרית
    { p: "/api/v2/doors/open", ct: "json", body: JSON.stringify({ ids: [doorId] }) },
    { p: "/api/v2/doors/unlock", ct: "json", body: JSON.stringify({ ids: [doorId] }) },
  ] as const;

  for (const b of bulk) {
    const r = await tryPost(`${BASE}${b.p}`, H, b.body, b.ct, trace);
    if (r.ok) return { ok: true, endpoint: b.p, status: r.status, body: r.txt };
  }

  // 3) ניסיון דרך ממסרים של הבקר (relay) אם יש לנו device id
  if (entryDeviceId) {
    const dev = encodeURIComponent(entryDeviceId);
    const relayPaths = [
      { p: `/api/devices/${dev}/relays/0/trigger`, ct: "json", body: JSON.stringify({}) },
      { p: `/api/devices/${dev}/relays/0/on`, ct: null, body: "" },
      { p: `/api/devices/${dev}/relays/0/pulse`, ct: "json", body: JSON.stringify({ duration: 3000 }) },
      { p: `/api/v2/devices/${dev}/relays/0/trigger`, ct: "json", body: JSON.stringify({}) },
      { p: `/api/v2/devices/${dev}/relays/0/pulse`, ct: "json", body: JSON.stringify({ duration: 3000 }) },
    ] as const;
    for (const rp of relayPaths) {
      const r = await tryPost(`${BASE}${rp.p}`, H, rp.body, rp.ct, trace);
      if (r.ok) return { ok: true, endpoint: rp.p, status: r.status, body: r.txt };
    }
  }

  return { ok: false, endpoint: null, status: 500, body: "all endpoints failed" };
}

// ====== Express Handlers ======
export const doorHealthHandler: RequestHandler = (req, res) => {
  const err = requireEnv();
  res.json({
    ok: !err,
    error: err ?? null,
    base: BASE,
    hasUser: Boolean(USER),
    hasPass: Boolean(PASS),
    defaultDoorId: DEFAULT_DOOR_ID ?? null,
  });
};

export const doorOpenHandler: RequestHandler = async (req, res) => {
  const envErr = requireEnv();
  if (envErr) return res.status(500).json({ ok: false, error: envErr });

  const q = (req.query.doorId as string) ?? "";
  const doorId = Number(q || DEFAULT_DOOR_ID);
  if (!doorId) {
    return res.status(400).json({
      ok: false,
      error: "doorId missing (query ?doorId= or env BIOSTAR_DOOR_ID)",
    });
  }

  const trace: any[] = [];
  try {
    const sid = await login();
    // נשלוף רשימת דלתות כדי להשיג deviceId אם יש:
    const doors = await listDoors(sid, trace);
    const d = doors.find((x) => x.id === String(doorId));
    const entryDev = d?.entryDeviceId;

    const out = await openDoorInternal(sid, doorId, entryDev, trace);
    return res
      .status(out.ok ? 200 : 500)
      .json({ ...out, trace, door: d || null });
  } catch (err: any) {
    trace.push({ step: "exception", error: String(err?.message || err) });
    return res.status(500).json({ ok: false, error: String(err?.message || err), trace });
  }
};

// ====== EMERGENCY DOOR OPEN - NO DEPENDENCIES ======
// כפתור חירום - פותח דלת ישירות ללא תלות בשום גורם
export const emergencyDoorOpenHandler: RequestHandler = async (req, res) => {
  // אין בדיקות - רק ניסיון ישיר לפתוח
  const q = (req.query.doorId as string) ?? "";
  const doorId = Number(q || DEFAULT_DOOR_ID || 1); // Default to door 1 if nothing specified

  const trace: any[] = [];
  try {
    // ניסיון התחברות ישיר - ללא תלות ב-startup או services אחרים
    let sid: string;
    try {
      sid = await login();
    } catch (loginErr: any) {
      trace.push({ step: "login failed", error: String(loginErr?.message || loginErr) });
      // נסה שוב עם fallback
      try {
        sid = await loginV2();
      } catch (e2: any) {
        return res.status(500).json({ 
          ok: false, 
          error: "Cannot connect to BioStar server",
          trace,
          emergency: true
        });
      }
    }

    // נסה למצוא את הדלת
    let entryDev: string | undefined;
    try {
      const doors = await listDoors(sid, trace);
      const d = doors.find((x) => x.id === String(doorId));
      entryDev = d?.entryDeviceId;
    } catch (e: any) {
      trace.push({ step: "list doors failed", error: String(e?.message || e), note: "continuing anyway" });
    }

    // נסה לפתוח - עם כל האפשרויות
    const out = await openDoorInternal(sid, doorId, entryDev, trace);
    
    return res.status(out.ok ? 200 : 500).json({ 
      ...out, 
      trace, 
      emergency: true,
      message: out.ok ? "Door opened successfully (EMERGENCY MODE)" : "Failed to open door"
    });
  } catch (err: any) {
    trace.push({ step: "exception", error: String(err?.message || err) });
    return res.status(500).json({ 
      ok: false, 
      error: String(err?.message || err), 
      trace,
      emergency: true
    });
  }
};

