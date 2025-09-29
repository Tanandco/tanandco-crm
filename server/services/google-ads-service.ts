import fetch from 'node-fetch';
import type { IStorage } from '../storage';

export interface GoogleAdsCampaign {
  id: string;
  name: string;
  status: string;
  budgetAmount: number;
  targetCpa?: number;
  targetRoas?: number;
}

export interface GoogleAdsPerformance {
  campaignId: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  averageCpc: number;
  costPerConversion?: number;
  conversionRate?: number;
}

export class GoogleAdsService {
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;
  private developerToken: string;
  private customerId: string;
  private accessToken?: string;
  private tokenExpiry?: Date;
  private storage: IStorage;

  constructor(
    clientId: string,
    clientSecret: string,
    refreshToken: string,
    developerToken: string,
    customerId: string,
    storage: IStorage
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.developerToken = developerToken;
    this.customerId = customerId;
    this.storage = storage;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const data: any = await response.json();

    if (!response.ok) {
      throw new Error(`OAuth Error: ${JSON.stringify(data)}`);
    }

    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000);
    return this.accessToken;
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any) {
    const accessToken = await this.getAccessToken();
    const url = `https://googleads.googleapis.com/v16/${endpoint}`;

    const options: any = {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': this.developerToken,
        'Content-Type': 'application/json',
        'login-customer-id': this.customerId.replace(/-/g, ''),
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Google Ads API Error: ${JSON.stringify(data)}`);
    }

    return data;
  }

  async createCampaign(campaignData: {
    name: string;
    status: 'ENABLED' | 'PAUSED';
    budgetAmount: number;
    biddingStrategy: 'TARGET_CPA' | 'TARGET_ROAS' | 'MAXIMIZE_CONVERSIONS';
    targetCpa?: number;
    targetRoas?: number;
  }): Promise<{ resourceName: string }> {
    const budgetResourceName = await this.createBudget(campaignData.name, campaignData.budgetAmount);

    const campaign: any = {
      name: campaignData.name,
      status: campaignData.status,
      campaign_budget: budgetResourceName,
      advertising_channel_type: 'SEARCH',
      network_settings: {
        target_google_search: true,
        target_search_network: true,
        target_content_network: false,
      },
    };

    if (campaignData.biddingStrategy === 'TARGET_CPA' && campaignData.targetCpa) {
      campaign.target_cpa = {
        target_cpa_micros: Math.round(campaignData.targetCpa * 1000000),
      };
    } else if (campaignData.biddingStrategy === 'TARGET_ROAS' && campaignData.targetRoas) {
      campaign.target_roas = {
        target_roas: campaignData.targetRoas,
      };
    } else {
      campaign.maximize_conversions = {};
    }

    const body = {
      operations: [{
        create: campaign,
      }],
    };

    const data = await this.makeRequest(
      `customers/${this.customerId.replace(/-/g, '')}/campaigns:mutate`,
      'POST',
      body
    );

    const resourceName = data.results[0].resourceName;
    
    await this.logAction('google_ads', 'campaign', resourceName, 'created', { 
      name: campaignData.name 
    });

    return { resourceName };
  }

  private async createBudget(name: string, amount: number): Promise<string> {
    const body = {
      operations: [{
        create: {
          name: `Budget for ${name}`,
          amount_micros: Math.round(amount * 1000000),
          delivery_method: 'STANDARD',
        },
      }],
    };

    const data = await this.makeRequest(
      `customers/${this.customerId.replace(/-/g, '')}/campaignBudgets:mutate`,
      'POST',
      body
    );

    return data.results[0].resourceName;
  }

  async createAdGroup(
    campaignResourceName: string,
    adGroupData: {
      name: string;
      status: 'ENABLED' | 'PAUSED';
      cpcBidMicros?: number;
    }
  ): Promise<{ resourceName: string }> {
    const adGroup: any = {
      name: adGroupData.name,
      status: adGroupData.status,
      campaign: campaignResourceName,
      type: 'SEARCH_STANDARD',
    };

    if (adGroupData.cpcBidMicros) {
      adGroup.cpc_bid_micros = adGroupData.cpcBidMicros;
    }

    const body = {
      operations: [{
        create: adGroup,
      }],
    };

    const data = await this.makeRequest(
      `customers/${this.customerId.replace(/-/g, '')}/adGroups:mutate`,
      'POST',
      body
    );

    const resourceName = data.results[0].resourceName;
    
    await this.logAction('google_ads', 'adgroup', resourceName, 'created', { 
      name: adGroupData.name,
      campaign: campaignResourceName 
    });

    return { resourceName };
  }

  async createResponsiveSearchAd(
    adGroupResourceName: string,
    adData: {
      headlines: string[];
      descriptions: string[];
      finalUrls: string[];
    }
  ): Promise<{ resourceName: string }> {
    const ad = {
      ad_group: adGroupResourceName,
      status: 'ENABLED',
      ad: {
        final_urls: adData.finalUrls,
        responsive_search_ad: {
          headlines: adData.headlines.map(text => ({ text })),
          descriptions: adData.descriptions.map(text => ({ text })),
        },
      },
    };

    const body = {
      operations: [{
        create: ad,
      }],
    };

    const data = await this.makeRequest(
      `customers/${this.customerId.replace(/-/g, '')}/adGroupAds:mutate`,
      'POST',
      body
    );

    const resourceName = data.results[0].resourceName;
    
    await this.logAction('google_ads', 'ad', resourceName, 'created', { 
      adGroup: adGroupResourceName 
    });

    return { resourceName };
  }

  async addKeywords(
    adGroupResourceName: string,
    keywords: Array<{ text: string; matchType: 'EXACT' | 'PHRASE' | 'BROAD' }>
  ): Promise<void> {
    const operations = keywords.map(keyword => ({
      create: {
        ad_group: adGroupResourceName,
        keyword: {
          text: keyword.text,
          match_type: keyword.matchType,
        },
        status: 'ENABLED',
      },
    }));

    const body = { operations };

    await this.makeRequest(
      `customers/${this.customerId.replace(/-/g, '')}/adGroupCriteria:mutate`,
      'POST',
      body
    );

    await this.logAction('google_ads', 'keywords', adGroupResourceName, 'added', { 
      count: keywords.length 
    });
  }

  async getCampaignPerformance(
    campaignResourceName: string,
    dateRange: 'TODAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' = 'TODAY'
  ): Promise<GoogleAdsPerformance> {
    const query = `
      SELECT
        campaign.id,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc,
        metrics.cost_per_conversion,
        metrics.conversions_rate
      FROM campaign
      WHERE campaign.resource_name = '${campaignResourceName}'
      AND segments.date DURING ${dateRange}
    `;

    const body = { query };

    const data = await this.makeRequest(
      `customers/${this.customerId.replace(/-/g, '')}/googleAds:searchStream`,
      'POST',
      body
    );

    if (!data.results || data.results.length === 0) {
      return {
        campaignId: campaignResourceName,
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0,
        ctr: 0,
        averageCpc: 0,
      };
    }

    const metrics = data.results[0].metrics;
    return {
      campaignId: campaignResourceName,
      impressions: parseInt(metrics.impressions || '0'),
      clicks: parseInt(metrics.clicks || '0'),
      cost: parseInt(metrics.cost_micros || '0') / 1000000,
      conversions: parseFloat(metrics.conversions || '0'),
      ctr: parseFloat(metrics.ctr || '0'),
      averageCpc: parseInt(metrics.average_cpc || '0') / 1000000,
      costPerConversion: parseFloat(metrics.cost_per_conversion || '0') / 1000000,
      conversionRate: parseFloat(metrics.conversions_rate || '0'),
    };
  }

  async updateCampaignStatus(
    campaignResourceName: string,
    status: 'ENABLED' | 'PAUSED'
  ): Promise<void> {
    const body = {
      operations: [{
        update: {
          resource_name: campaignResourceName,
          status,
        },
        update_mask: { paths: ['status'] },
      }],
    };

    await this.makeRequest(
      `customers/${this.customerId.replace(/-/g, '')}/campaigns:mutate`,
      'POST',
      body
    );

    await this.logAction('google_ads', 'campaign', campaignResourceName, 'status_updated', { status });
  }

  async updateCampaignBudget(
    campaignResourceName: string,
    newBudgetAmount: number
  ): Promise<void> {
    const campaign = await this.getCampaignDetails(campaignResourceName);
    const budgetResourceName = campaign.campaign_budget;

    const body = {
      operations: [{
        update: {
          resource_name: budgetResourceName,
          amount_micros: Math.round(newBudgetAmount * 1000000),
        },
        update_mask: { paths: ['amount_micros'] },
      }],
    };

    await this.makeRequest(
      `customers/${this.customerId.replace(/-/g, '')}/campaignBudgets:mutate`,
      'POST',
      body
    );

    await this.logAction('google_ads', 'campaign', campaignResourceName, 'budget_updated', { 
      newBudgetAmount 
    });
  }

  private async getCampaignDetails(campaignResourceName: string): Promise<any> {
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.campaign_budget
      FROM campaign
      WHERE campaign.resource_name = '${campaignResourceName}'
    `;

    const body = { query };

    const data = await this.makeRequest(
      `customers/${this.customerId.replace(/-/g, '')}/googleAds:search`,
      'POST',
      body
    );

    return data.results[0].campaign;
  }

  private async logAction(
    platform: string,
    entity: string,
    entityId: string,
    action: string,
    details?: any
  ): Promise<void> {
    try {
      await this.storage.createAutomationLog({
        platform,
        entity,
        entityId,
        action,
        details,
        success: true,
      });
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  }
}
