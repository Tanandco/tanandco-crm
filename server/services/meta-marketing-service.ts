import fetch from 'node-fetch';
import type { Campaign, AdSet, Ad, AutomationLog } from '@shared/schema';
import type { IStorage } from '../storage';

export interface MetaAdAccount {
  id: string;
  name: string;
  currency: string;
  timezone_name: string;
}

export interface MetaCampaignInsights {
  impressions: number;
  reach: number;
  clicks: number;
  spend: number;
  cpm: number;
  cpc: number;
  ctr: number;
  conversions?: number;
  cost_per_conversion?: number;
}

export interface MetaAdSetPerformance {
  adSetId: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
}

export class MetaMarketingService {
  private accessToken: string;
  private apiVersion: string = 'v21.0';
  private baseUrl: string = 'https://graph.facebook.com';
  private storage: IStorage;

  constructor(accessToken: string, storage: IStorage) {
    this.accessToken = accessToken;
    this.storage = storage;
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any) {
    const url = `${this.baseUrl}/${this.apiVersion}${endpoint}`;
    const options: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (method === 'POST' || method === 'PUT') {
      options.body = JSON.stringify(body);
    }

    const separator = endpoint.includes('?') ? '&' : '?';
    const fullUrl = `${url}${separator}access_token=${this.accessToken}`;

    const response = await fetch(fullUrl, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Meta API Error: ${JSON.stringify(data)}`);
    }

    return data;
  }

  async getAdAccount(accountId: string): Promise<MetaAdAccount> {
    const data = await this.makeRequest(`/${accountId}?fields=id,name,currency,timezone_name`);
    return data;
  }

  async createCampaign(
    accountId: string,
    campaignData: {
      name: string;
      objective: string;
      status: string;
      dailyBudget?: number;
      lifetimeBudget?: number;
      specialAdCategories?: string[];
    }
  ): Promise<{ id: string }> {
    const body: any = {
      name: campaignData.name,
      objective: campaignData.objective,
      status: campaignData.status,
      special_ad_categories: campaignData.specialAdCategories || [],
    };

    if (campaignData.dailyBudget) {
      body.daily_budget = Math.round(campaignData.dailyBudget * 100);
    }

    if (campaignData.lifetimeBudget) {
      body.lifetime_budget = Math.round(campaignData.lifetimeBudget * 100);
    }

    const data = await this.makeRequest(`/${accountId}/campaigns`, 'POST', body);
    
    await this.logAction('meta', 'campaign', data.id, 'created', { 
      name: campaignData.name,
      objective: campaignData.objective 
    });

    return { id: data.id };
  }

  async createAdSet(
    accountId: string,
    adSetData: {
      name: string;
      campaignId: string;
      dailyBudget?: number;
      lifetimeBudget?: number;
      billingEvent: string;
      optimizationGoal: string;
      bidAmount?: number;
      targeting: any;
      status: string;
      startTime?: Date;
      endTime?: Date;
    }
  ): Promise<{ id: string }> {
    const body: any = {
      name: adSetData.name,
      campaign_id: adSetData.campaignId,
      billing_event: adSetData.billingEvent,
      optimization_goal: adSetData.optimizationGoal,
      targeting: adSetData.targeting,
      status: adSetData.status,
    };

    if (adSetData.dailyBudget) {
      body.daily_budget = Math.round(adSetData.dailyBudget * 100);
    }

    if (adSetData.lifetimeBudget) {
      body.lifetime_budget = Math.round(adSetData.lifetimeBudget * 100);
    }

    if (adSetData.bidAmount) {
      body.bid_amount = Math.round(adSetData.bidAmount * 100);
    }

    if (adSetData.startTime) {
      body.start_time = adSetData.startTime.toISOString();
    }

    if (adSetData.endTime) {
      body.end_time = adSetData.endTime.toISOString();
    }

    const data = await this.makeRequest(`/${accountId}/adsets`, 'POST', body);
    
    await this.logAction('meta', 'adset', data.id, 'created', { 
      name: adSetData.name,
      campaignId: adSetData.campaignId 
    });

    return { id: data.id };
  }

  async createAd(
    accountId: string,
    adData: {
      name: string;
      adSetId: string;
      creative: {
        title: string;
        body: string;
        imageHash?: string;
        videoId?: string;
        callToAction: string;
        link: string;
      };
      status: string;
    }
  ): Promise<{ id: string }> {
    const creativeBody: any = {
      name: `${adData.name} - Creative`,
      object_story_spec: {
        page_id: accountId.replace('act_', ''),
        link_data: {
          link: adData.creative.link,
          message: adData.creative.body,
          name: adData.creative.title,
          call_to_action: {
            type: adData.creative.callToAction,
          },
        },
      },
    };

    if (adData.creative.imageHash) {
      creativeBody.object_story_spec.link_data.image_hash = adData.creative.imageHash;
    }

    if (adData.creative.videoId) {
      creativeBody.object_story_spec.link_data.video_id = adData.creative.videoId;
    }

    const creativeData = await this.makeRequest(`/${accountId}/adcreatives`, 'POST', creativeBody);

    const adBody = {
      name: adData.name,
      adset_id: adData.adSetId,
      creative: { creative_id: creativeData.id },
      status: adData.status,
    };

    const data = await this.makeRequest(`/${accountId}/ads`, 'POST', adBody);
    
    await this.logAction('meta', 'ad', data.id, 'created', { 
      name: adData.name,
      adSetId: adData.adSetId 
    });

    return { id: data.id };
  }

  async updateCampaignStatus(campaignId: string, status: 'ACTIVE' | 'PAUSED'): Promise<void> {
    await this.makeRequest(`/${campaignId}`, 'POST', { status });
    await this.logAction('meta', 'campaign', campaignId, 'status_updated', { status });
  }

  async updateAdSetBudget(adSetId: string, dailyBudget: number): Promise<void> {
    await this.makeRequest(`/${adSetId}`, 'POST', { 
      daily_budget: Math.round(dailyBudget * 100) 
    });
    await this.logAction('meta', 'adset', adSetId, 'budget_updated', { dailyBudget });
  }

  async getCampaignInsights(
    campaignId: string,
    datePreset: string = 'today'
  ): Promise<MetaCampaignInsights> {
    const fields = [
      'impressions',
      'reach',
      'clicks',
      'spend',
      'cpm',
      'cpc',
      'ctr',
      'conversions',
      'cost_per_conversion',
    ].join(',');

    const data = await this.makeRequest(
      `/${campaignId}/insights?fields=${fields}&date_preset=${datePreset}`
    );

    if (!data.data || data.data.length === 0) {
      return {
        impressions: 0,
        reach: 0,
        clicks: 0,
        spend: 0,
        cpm: 0,
        cpc: 0,
        ctr: 0,
        conversions: 0,
        cost_per_conversion: 0,
      };
    }

    const insights = data.data[0];
    return {
      impressions: parseInt(insights.impressions || '0'),
      reach: parseInt(insights.reach || '0'),
      clicks: parseInt(insights.clicks || '0'),
      spend: parseFloat(insights.spend || '0'),
      cpm: parseFloat(insights.cpm || '0'),
      cpc: parseFloat(insights.cpc || '0'),
      ctr: parseFloat(insights.ctr || '0'),
      conversions: parseInt(insights.conversions || '0'),
      cost_per_conversion: parseFloat(insights.cost_per_conversion || '0'),
    };
  }

  async getAdSetPerformance(adSetId: string): Promise<MetaAdSetPerformance> {
    const fields = 'impressions,clicks,spend,conversions,ctr,cpc';
    const data = await this.makeRequest(
      `/${adSetId}/insights?fields=${fields}&date_preset=today`
    );

    if (!data.data || data.data.length === 0) {
      return {
        adSetId,
        impressions: 0,
        clicks: 0,
        spend: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
      };
    }

    const insights = data.data[0];
    return {
      adSetId,
      impressions: parseInt(insights.impressions || '0'),
      clicks: parseInt(insights.clicks || '0'),
      spend: parseFloat(insights.spend || '0'),
      conversions: parseInt(insights.conversions || '0'),
      ctr: parseFloat(insights.ctr || '0'),
      cpc: parseFloat(insights.cpc || '0'),
    };
  }

  async uploadImage(accountId: string, imageUrl: string): Promise<string> {
    const body = {
      url: imageUrl,
    };

    const data = await this.makeRequest(`/${accountId}/adimages`, 'POST', body);
    return data.images[Object.keys(data.images)[0]].hash;
  }

  async createCustomAudience(
    accountId: string,
    audienceName: string,
    description: string,
    customerFileSource?: boolean
  ): Promise<{ id: string }> {
    const body: any = {
      name: audienceName,
      description,
      subtype: customerFileSource ? 'CUSTOM' : 'WEBSITE',
    };

    if (customerFileSource) {
      body.customer_file_source = 'USER_PROVIDED_ONLY';
    }

    const data = await this.makeRequest(`/${accountId}/customaudiences`, 'POST', body);
    
    await this.logAction('meta', 'audience', data.id, 'created', { 
      name: audienceName 
    });

    return { id: data.id };
  }

  async addUsersToCustomAudience(
    audienceId: string,
    users: Array<{ email?: string; phone?: string; firstName?: string; lastName?: string }>
  ): Promise<void> {
    const crypto = await import('crypto');
    
    const hashedUsers = users.map(user => {
      const data: any = {};
      if (user.email) {
        data.em = crypto.createHash('sha256').update(user.email.toLowerCase()).digest('hex');
      }
      if (user.phone) {
        const cleanPhone = user.phone.replace(/\D/g, '');
        data.ph = crypto.createHash('sha256').update(cleanPhone).digest('hex');
      }
      if (user.firstName) {
        data.fn = crypto.createHash('sha256').update(user.firstName.toLowerCase()).digest('hex');
      }
      if (user.lastName) {
        data.ln = crypto.createHash('sha256').update(user.lastName.toLowerCase()).digest('hex');
      }
      return data;
    });

    const body = {
      payload: {
        schema: ['EMAIL', 'PHONE', 'FN', 'LN'],
        data: hashedUsers.map(u => [u.em, u.ph, u.fn, u.ln]),
      },
    };

    await this.makeRequest(`/${audienceId}/users`, 'POST', body);
    
    await this.logAction('meta', 'audience', audienceId, 'users_added', { 
      count: users.length 
    });
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
