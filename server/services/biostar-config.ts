export interface BioStarConfig {
  host: string;
  port: number;
  apiKey?: string;
  serverUrl?: string;
  timeout?: number;
  debug?: boolean;
}

export const defaultBioStarConfig: BioStarConfig = {
  host: "127.0.0.1",
  port: 51212,
  apiKey: "",
  serverUrl: process.env.BIOSTAR_SERVER_URL || "http://127.0.0.1:5000",
  timeout: 30000,
  debug: false,
};

// BioStar API Endpoints
export const BIOSTAR_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/login",
  },
  FACE: {
    IDENTIFY: "/api/faces/identify",
    REGISTER: "/api/faces/register",
  },
  USERS: {
    GET: "/api/users/:id",
    CREATE: "/api/users",
  },
  ACCESS: {
    LOGS: "/api/access/logs",
  },
};

// Additional types for BioStar API
export interface BioStarCredentials {
  sessionToken: string;
  expiresAt: number;
}

export interface BioStarResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserData {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  accessLevel?: number;
}

export interface FaceTemplate {
  id: string;
  userId: string;
  quality: number;
  createdAt: string;
}

export interface FaceIdentificationResult {
  userId: string;
  confidence: number;
  faceId: string;
  timestamp: string;
}

export interface AccessEvent {
  id: string;
  userId: string;
  doorId: string;
  timestamp: string;
  eventType: string;
  result: string;
}
