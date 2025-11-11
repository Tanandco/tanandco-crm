import { bioStarClient } from './biostar-client';

interface StartupConfig {
  username?: string;
  password?: string;
  autoRetry?: boolean;
  retryInterval?: number; // milliseconds
  maxRetries?: number;
}

class BioStarStartupService {
  private isInitialized = false;
  private isInitializing = false;
  private retryCount = 0;
  private config: StartupConfig = {};

  async initialize(config: StartupConfig = {}): Promise<boolean> {
    if (this.isInitialized) return true;
    if (this.isInitializing) return false;

    // Check if BioStar is disabled
    if (process.env.BIOSTAR_DISABLED === 'true') {
      console.log('BioStar integration is disabled via BIOSTAR_DISABLED environment variable');
      this.isInitializing = false;
      return false;
    }

    this.isInitializing = true;
    this.config = {
      autoRetry: false, // Disabled by default to avoid spam
      retryInterval: 5000,
      maxRetries: 0,
      ...config
    };

    try {
      // Get credentials from environment variables
      const username = config.username || process.env.BIOSTAR_USERNAME;
      const password = config.password || process.env.BIOSTAR_PASSWORD;
      const serverUrl = process.env.BIOSTAR_SERVER_URL;

      if (!username || !password || !serverUrl) {
        console.log('BioStar not configured - integration disabled. System will work without face recognition.');
        this.isInitializing = false;
        return false;
      }

      console.log('Initializing BioStar connection...');
      
      // Test connection first
      const isConnected = await bioStarClient.testConnection();
      if (!isConnected) {
        console.warn('BioStar server not reachable. Face recognition will be unavailable.');
        this.isInitializing = false;
        return false;
      }

      // Authenticate
      const authenticated = await bioStarClient.authenticate(username, password);
      if (!authenticated) {
        console.warn('BioStar authentication failed. Face recognition will be unavailable.');
        this.isInitializing = false;
        return false;
      }

      this.isInitialized = true;
      this.retryCount = 0;
      console.log('✅ BioStar connection initialized successfully');
      
      // Setup periodic refresh
      this.setupPeriodicRefresh();
      
      return true;
    } catch (error) {
      console.warn('BioStar initialization error:', error instanceof Error ? error.message : error);
      console.log('System will continue without face recognition.');
      
      if (this.config.autoRetry && this.retryCount < (this.config.maxRetries || 0)) {
        this.retryCount++;
        console.log(`Retrying BioStar initialization in ${this.config.retryInterval}ms (attempt ${this.retryCount})`);
        
        setTimeout(() => {
          this.isInitializing = false;
          this.initialize(this.config);
        }, this.config.retryInterval);
      } else {
        this.isInitializing = false;
      }
      
      return false;
    } finally {
      this.isInitializing = false;
    }
  }

  private setupPeriodicRefresh(): void {
    // Refresh authentication every 20 hours (before 24-hour expiry)
    setInterval(async () => {
      try {
        const isAuth = await bioStarClient.isAuthenticated();
        if (!isAuth) {
          console.log('BioStar session expired, re-authenticating...');
          await this.initialize(this.config);
        }
      } catch (error) {
        console.error('BioStar periodic refresh failed:', error);
      }
    }, 20 * 60 * 60 * 1000); // 20 hours
  }

  async getStatus(): Promise<{
    initialized: boolean;
    connected: boolean;
    authenticated: boolean;
    lastError?: string;
  }> {
    try {
      const connected = await bioStarClient.testConnection();
      const authenticated = this.isInitialized && await bioStarClient.isAuthenticated();
      
      return {
        initialized: this.isInitialized,
        connected,
        authenticated
      };
    } catch (error: any) {
      return {
        initialized: this.isInitialized,
        connected: false,
        authenticated: false,
        lastError: error.message
      };
    }
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  async ensureReady(): Promise<boolean> {
    if (this.isReady()) return true;
    if (this.isInitializing) {
      // Wait for current initialization to complete
      while (this.isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.isReady();
    }
    
    return await this.initialize(this.config);
  }
}

// Singleton instance
export const bioStarStartup = new BioStarStartupService();