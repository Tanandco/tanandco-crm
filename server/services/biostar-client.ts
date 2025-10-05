import fetch from 'node-fetch';
import https from 'https';
import { 
  BioStarConfig, 
  BioStarCredentials, 
  BioStarResponse, 
  UserData,
  FaceTemplate,
  FaceIdentificationResult,
  AccessEvent,
  BIOSTAR_ENDPOINTS,
  defaultBioStarConfig 
} from './biostar-config';

export class BioStarClient {
  private config: BioStarConfig;
  private credentials: BioStarCredentials | null = null;

  constructor(config: Partial<BioStarConfig> = {}) {
    this.config = { ...defaultBioStarConfig, ...config };
  }

  // Create HTTPS agent with configurable certificate validation (only for HTTPS URLs)
  private createHttpsAgent(): https.Agent | undefined {
    // Only use HTTPS agent for HTTPS URLs
    if (!this.config.serverUrl.startsWith('https://')) {
      return undefined;
    }
    
    const allowSelfSigned = process.env.BIOSTAR_ALLOW_SELF_SIGNED === 'true';
    
    return new https.Agent({
      rejectUnauthorized: !allowSelfSigned,
      timeout: this.config.timeout
    });
  }

  // Authentication methods
  async authenticate(username: string, password: string): Promise<boolean> {
    try {
      const url = `${this.config.serverUrl}${BIOSTAR_ENDPOINTS.AUTH.LOGIN}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          id: username,
          password: password
        }),
        agent: this.createHttpsAgent()
      } as any);

      if (!response.ok) {
        const errorText = await response.text();
        if (this.config.debug) {
          console.error('BioStar auth failed:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
        }
        throw new Error(`Authentication failed: ${response.statusText} (${response.status})`);
      }

      // BioStar 2 returns session ID in headers
      const sessionId = response.headers.get('bs-session-id');
      
      if (this.config.debug) {
        console.log('BioStar login response headers:', {
          sessionId,
          allHeaders: Object.fromEntries(response.headers.entries())
        });
      }
      
      if (sessionId) {
        this.credentials = {
          username,
          password,
          sessionToken: sessionId,
          expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24 hours
        };
        console.log('✅ BioStar authentication successful');
        return true;
      }

      throw new Error('No session ID received');
    } catch (error) {
      if (this.config.debug) {
        console.error('BioStar authentication error:', error);
      }
      return false;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.credentials?.sessionToken) return false;
    if (this.credentials.expiresAt && this.credentials.expiresAt < new Date()) {
      return await this.refreshToken();
    }
    return true;
  }

  private async refreshToken(): Promise<boolean> {
    if (!this.credentials) return false;
    
    try {
      return await this.authenticate(this.credentials.username, this.credentials.password);
    } catch (error) {
      this.credentials = null;
      return false;
    }
  }

  // Face recognition methods
  async identifyFace(imageData: string | Buffer): Promise<FaceIdentificationResult | null> {
    if (!await this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      const url = `${this.config.serverUrl}${BIOSTAR_ENDPOINTS.FACE.IDENTIFY}`;
      
      // Convert image to base64 if it's a Buffer
      const base64Image = Buffer.isBuffer(imageData) 
        ? imageData.toString('base64')
        : imageData;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bs-session-id': this.credentials!.sessionToken,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          image: base64Image,
          antiSpoofing: true,
          liveDetection: true
        }),
        agent: this.createHttpsAgent()
      } as any);

      if (!response.ok) {
        throw new Error(`Face identification failed: ${response.statusText}`);
      }

      const result = await response.json() as BioStarResponse<FaceIdentificationResult>;
      
      if (result.success && result.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      if (this.config.debug) {
        console.error('Face identification error:', error);
      }
      throw error;
    }
  }

  async registerFace(userId: string, imageData: string | Buffer): Promise<FaceTemplate | null> {
    if (!await this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      const url = `${this.config.serverUrl}${BIOSTAR_ENDPOINTS.FACE.REGISTER}`;
      
      const base64Image = Buffer.isBuffer(imageData) 
        ? imageData.toString('base64')
        : imageData;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bs-session-id': this.credentials!.sessionToken,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId,
          image: base64Image,
          extractTemplate: true
        }),
        agent: this.createHttpsAgent()
      } as any);

      if (!response.ok) {
        throw new Error(`Face registration failed: ${response.statusText}`);
      }

      const result = await response.json() as BioStarResponse<FaceTemplate>;
      
      if (result.success && result.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      if (this.config.debug) {
        console.error('Face registration error:', error);
      }
      throw error;
    }
  }

  // User management methods
  async getUser(userId: string): Promise<UserData | null> {
    if (!await this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      const url = `${this.config.serverUrl}${BIOSTAR_ENDPOINTS.USERS.GET.replace(':id', userId)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'bs-session-id': this.credentials!.sessionToken,
          'Accept': 'application/json'
        },
        agent: this.createHttpsAgent()
      } as any);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Get user failed: ${response.statusText}`);
      }

      const result = await response.json() as BioStarResponse<UserData>;
      return result.success ? result.data || null : null;
    } catch (error) {
      if (this.config.debug) {
        console.error('Get user error:', error);
      }
      throw error;
    }
  }

  async createUser(userData: Omit<UserData, 'id'>): Promise<UserData | null> {
    if (!await this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      const url = `${this.config.serverUrl}${BIOSTAR_ENDPOINTS.USERS.CREATE}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bs-session-id': this.credentials!.sessionToken,
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData),
        agent: this.createHttpsAgent()
      } as any);

      if (!response.ok) {
        throw new Error(`Create user failed: ${response.statusText}`);
      }

      const result = await response.json() as BioStarResponse<UserData>;
      return result.success ? result.data || null : null;
    } catch (error) {
      if (this.config.debug) {
        console.error('Create user error:', error);
      }
      throw error;
    }
  }

  // Access log methods
  async getAccessLogs(limit: number = 100): Promise<AccessEvent[]> {
    if (!await this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      const url = `${this.config.serverUrl}${BIOSTAR_ENDPOINTS.ACCESS.LOGS}?limit=${limit}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'bs-session-id': this.credentials!.sessionToken,
          'Accept': 'application/json'
        },
        agent: this.createHttpsAgent()
      } as any);

      if (!response.ok) {
        throw new Error(`Get access logs failed: ${response.statusText}`);
      }

      const result = await response.json() as BioStarResponse<AccessEvent[]>;
      return result.success ? result.data || [] : [];
    } catch (error) {
      if (this.config.debug) {
        console.error('Get access logs error:', error);
      }
      throw error;
    }
  }

  // Utility methods
  async testConnection(): Promise<boolean> {
    try {
      // Test connection by checking if the root page is accessible
      const url = this.config.serverUrl;
      
      const response = await fetch(url, {
        method: 'GET',
        agent: this.createHttpsAgent()
      } as any);

      return response.ok;
    } catch (error) {
      if (this.config.debug) {
        console.error('Connection test failed:', error);
      }
      return false;
    }
  }

  // Door control methods
  async openDoor(doorId: string = '1'): Promise<boolean> {
    if (!await this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      const url = `${this.config.serverUrl}${BIOSTAR_ENDPOINTS.DOORS.OPEN.replace(':id', doorId)}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'bs-session-id': this.credentials!.sessionToken,
          'Accept': 'application/json'
        },
        agent: this.createHttpsAgent()
      } as any);

      if (!response.ok) {
        throw new Error(`Open door failed: ${response.statusText}`);
      }

      const result = await response.json() as BioStarResponse<any>;
      return result.success || false;
    } catch (error) {
      if (this.config.debug) {
        console.error('Open door error:', error);
      }
      throw error;
    }
  }

  disconnect(): void {
    this.credentials = null;
  }
}

// Singleton instance for the app
export const bioStarClient = new BioStarClient();