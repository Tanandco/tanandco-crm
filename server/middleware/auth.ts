import { Request, Response, NextFunction } from 'express';

const ALLOWED_IPS = new Set([
  '127.0.0.1',
  '::1',
  '::ffff:127.0.0.1',
  'localhost'
]);

const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 10;

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

function isLocalhost(ip: string): boolean {
  return ALLOWED_IPS.has(ip);
}

export function requireLocalAccess(req: Request, res: Response, next: NextFunction) {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  
  if (!isLocalhost(clientIp)) {
    console.warn(`[Auth] Blocked non-localhost access attempt from IP: ${clientIp}`);
    return res.status(403).json({
      success: false,
      error: 'Access denied. Door control is only available from localhost.'
    });
  }
  
  next();
}

export function requireDoorAccessKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-door-access-key'] as string | undefined;
  const expectedKey = process.env.DOOR_ACCESS_KEY;
  const isDevMode = process.env.NODE_ENV === 'development';
  
  if (!expectedKey) {
    if (isDevMode) {
      console.warn('[Auth] DOOR_ACCESS_KEY not configured - allowing in development mode');
      next();
      return;
    }
    
    console.error('[Auth] DOOR_ACCESS_KEY is required in production but not configured');
    return res.status(503).json({
      success: false,
      error: 'Door control service not configured. Contact administrator.'
    });
  }
  
  if (!apiKey || apiKey !== expectedKey) {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    console.warn(`[Auth] Invalid door access key from IP: ${clientIp}`);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Invalid access key.'
    });
  }
  
  next();
}

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  
  const record = rateLimitMap.get(clientIp);
  
  if (record) {
    if (now < record.resetTime) {
      if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return res.status(429).json({
          success: false,
          error: 'Too many requests. Please wait before trying again.',
          retryAfter: Math.ceil((record.resetTime - now) / 1000)
        });
      }
      record.count++;
    } else {
      record.count = 1;
      record.resetTime = now + RATE_LIMIT_WINDOW_MS;
    }
  } else {
    rateLimitMap.set(clientIp, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    });
  }
  
  const currentRecord = rateLimitMap.get(clientIp)!;
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW.toString());
  res.setHeader('X-RateLimit-Remaining', (MAX_REQUESTS_PER_WINDOW - currentRecord.count).toString());
  res.setHeader('X-RateLimit-Reset', new Date(currentRecord.resetTime).toISOString());
  
  setTimeout(() => {
    if (rateLimitMap.get(clientIp)?.resetTime === currentRecord.resetTime) {
      rateLimitMap.delete(clientIp);
    }
  }, RATE_LIMIT_WINDOW_MS + 1000);
  
  next();
}
