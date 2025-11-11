// BioStar 2 Configuration
export interface BioStarConfig {
  serverUrl: string;
  apiVersion: string;
  timeout: number;
  maxRetries: number;
  debug: boolean;
}

export interface BioStarCredentials {
  username: string;
  password: string;
  sessionToken?: string;
  expiresAt?: Date;
}

export interface FaceRecognitionSettings {
  qualityThreshold: number;
  confidenceThreshold: number;
  antiSpoofing: boolean;
  liveDetection: boolean;
  maxFaceSize: number;
  minFaceSize: number;
}

// Default configuration for BioStar 2 integration
export const defaultBioStarConfig: BioStarConfig = {
  serverUrl: process.env.BIOSTAR_SERVER_URL || 'https://192.168.1.100:443',
  apiVersion: 'v1',
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  debug: process.env.NODE_ENV === 'development'
};

export const defaultFaceSettings: FaceRecognitionSettings = {
  qualityThreshold: 0.7,
  confidenceThreshold: 0.8,
  antiSpoofing: true,
  liveDetection: true,
  maxFaceSize: 4000,
  minFaceSize: 190
};

// API Endpoints
export const BIOSTAR_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    REFRESH: '/api/refresh'
  },
  USERS: {
    LIST: '/api/users',
    GET: '/api/users/:id',
    CREATE: '/api/users',
    UPDATE: '/api/users/:id',
    DELETE: '/api/users/:id'
  },
  FACE: {
    SCAN: '/api/face/scan',
    REGISTER: '/api/face/register',
    IDENTIFY: '/api/face/identify',
    VERIFY: '/api/face/verify',
    EXTRACT_TEMPLATE: '/api/face/template'
  },
  DEVICES: {
    LIST: '/api/devices',
    STATUS: '/api/devices/:id/status',
    EVENTS: '/api/devices/:id/events'
  },
  ACCESS: {
    LOGS: '/api/access-logs',
    GROUPS: '/api/access-groups'
  },
  DOORS: {
    LIST: '/api/doors',
    OPEN: '/api/doors/:id/open',
    CLOSE: '/api/doors/:id/close',
    STATUS: '/api/doors/:id/status'
  }
} as const;

// Response types
export interface BioStarResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface UserData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  accessLevel: number;
  faceTemplates?: FaceTemplate[];
}

export interface FaceTemplate {
  id: string;
  templateData: string;
  quality: number;
  isActive: boolean;
  createdAt: Date;
}

export interface FaceIdentificationResult {
  userId?: string;
  userName?: string;
  confidence: number;
  matchTime: number;
  isLive: boolean;
  qualityScore: number;
}

export interface AccessEvent {
  id: string;
  userId: string;
  deviceId: string;
  timestamp: Date;
  accessType: 'granted' | 'denied';
  method: 'face' | 'card' | 'pin';
  confidence?: number;
}