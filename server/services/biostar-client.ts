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
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        timeout: this.config.timeout,
        agent: this.createHttpsAgent()
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const result: BioStarResponse = await response.json();
      
      if (result.success && result.data?.sessionToken) {
        this.credentials = {
          username,
          password,
          sessionToken: result.data.sessionToken,
          expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24 hours
        };
        return true;
      }

      throw new Error(result.error || 'Authentication failed');
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
          'Authorization': `Bearer ${this.credentials!.sessionToken}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          image: base64Image,
          antiSpoofing: true,
          liveDetection: true
        }),
        timeout: this.config.timeout,
        agent: this.createHttpsAgent()
      });

      if (!response.ok) {
        throw new Error(`Face identification failed: ${response.statusText}`);
      }

      const result: BioStarResponse<FaceIdentificationResult> = await response.json();
      
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
          'Authorization': `Bearer ${this.credentials!.sessionToken}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId,
          image: base64Image,
          extractTemplate: true
        }),
        timeout: this.config.timeout
      });

      if (!response.ok) {
        throw new Error(`Face registration failed: ${response.statusText}`);
      }

      const result: BioStarResponse<FaceTemplate> = await response.json();
      
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
          'Authorization': `Bearer ${this.credentials!.sessionToken}`,
          'Accept': 'application/json'
        },
        timeout: this.config.timeout
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Get user failed: ${response.statusText}`);
      }

      const result: BioStarResponse<UserData> = await response.json();
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
          'Authorization': `Bearer ${this.credentials!.sessionToken}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData),
        timeout: this.config.timeout
      });

      if (!response.ok) {
        throw new Error(`Create user failed: ${response.statusText}`);
      }

      const result: BioStarResponse<UserData> = await response.json();
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
          'Authorization': `Bearer ${this.credentials!.sessionToken}`,
          'Accept': 'application/json'
        },
        timeout: this.config.timeout
      });

      if (!response.ok) {
        throw new Error(`Get access logs failed: ${response.statusText}`);
      }

      const result: BioStarResponse<AccessEvent[]> = await response.json();
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
      const url = `${this.config.serverUrl}/api/system/status`;
      
      const response = await fetch(url, {
        method: 'GET',
        timeout: 5000,
        agent: this.createHttpsAgent()
      });

      return response.ok;
    } catch (error) {
      if (this.config.debug) {
        console.error('Connection test failed:', error);
      }
      return false;
    }
  }

  disconnect(): void {
    this.credentials = null;
  }
}

// Singleton instance for the app
export const bioStarClient = new BioStarClient();