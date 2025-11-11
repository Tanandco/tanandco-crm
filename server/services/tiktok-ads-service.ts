import fetch from 'node-fetch';
import type { IStorage } from '../storage';

export interface TikTokCampaign {
  campaign_id: string;
  campaign_name: string;
  objective_type: string;
  budget: number;
  status: string;
}

export interface TikTokAdGroupPerformance {
  adgroup_id: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  cpc: number;
  conversion_rate: number;
}

export class TikTokAdsService {
  private accessToken: string;
  private advertiserId: string;
  private baseUrl: string = 'https://business-api.tiktok.com/open_api/v1.3';
  private storage: IStorage;

  constructor(accessToken: string, advertiserId: string, storage: IStorage) {
    this.accessToken = accessToken;
    this.advertiserId = advertiserId;
    this.storage = storage;
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const options: any = {
      method,
      headers: {
        'Access-Token': this.accessToken,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data: any = await response.json();

    if (!response.ok || data.code !== 0) {
      throw new Error(`TikTok API Error: ${JSON.stringify(data)}`);
    }

    return data.data;
  }

  async createCampaign(campaignData: {
    name: string;
    objective: 'CONVERSIONS' | 'TRAFFIC' | 'APP_PROMOTION' | 'REACH' | 'VIDEO_VIEWS';
    budget: number;
    budgetMode: 'BUDGET_MODE_DAY' | 'BUDGET_MODE_TOTAL';
  }): Promise<{ campaign_id: string }> {
    const body = {
      advertiser_id: this.advertiserId,
      campaign_name: campaignData.name,
      objective_type: campaignData.objective,
      budget: campaignData.budget,
      budget_mode: campaignData.budgetMode,
    };

    const data = await this.makeRequest('/campaign/create/', 'POST', body);
    
    await this.logAction('tiktok', 'campaign', data.campaign_id, 'created', { 
      name: campaignData.name,
      objective: campaignData.objective 
    });

    return { campaign_id: data.campaign_id };
  }

  async createAdGroup(adGroupData: {
    campaignId: string;
    name: string;
    placementType: 'PLACEMENT_TYPE_AUTOMATIC' | 'PLACEMENT_TYPE_NORMAL';
    budget: number;
    budgetMode: 'BUDGET_MODE_DAY' | 'BUDGET_MODE_TOTAL';
    bidType: 'BID_TYPE_NO_BID' | 'BID_TYPE_CUSTOM';
    bidPrice?: number;
    optimizationGoal: 'CLICK' | 'CONVERSION' | 'REACH' | 'VIDEO_VIEW';
    targeting: {
      genders?: ('MALE' | 'FEMALE' | 'UNLIMITED')[];
      ageGroups?: string[];
      languages?: string[];
      locations?: number[];
      interests?: string[];
    };
    scheduleStartTime?: string;
    scheduleEndTime?: string;
  }): Promise<{ adgroup_id: string }> {
    const body: any = {
      advertiser_id: this.advertiserId,
      campaign_id: adGroupData.campaignId,
      adgroup_name: adGroupData.name,
      placement_type: adGroupData.placementType,
      placements: ['PLACEMENT_TIKTOK'],
      budget: adGroupData.budget,
      budget_mode: adGroupData.budgetMode,
      bid_type: adGroupData.bidType,
      optimization_goal: adGroupData.optimizationGoal,
    };

    if (adGroupData.bidPrice && adGroupData.bidType === 'BID_TYPE_CUSTOM') {
      body.bid_price = adGroupData.bidPrice;
    }

    if (adGroupData.targeting.genders && adGroupData.targeting.genders.length > 0) {
      body.gender = adGroupData.targeting.genders;
    }

    if (adGroupData.targeting.ageGroups && adGroupData.targeting.ageGroups.length > 0) {
      body.age_groups = adGroupData.targeting.ageGroups;
    }

    if (adGroupData.targeting.languages && adGroupData.targeting.languages.length > 0) {
      body.languages = adGroupData.targeting.languages;
    }

    if (adGroupData.targeting.locations && adGroupData.targeting.locations.length > 0) {
      body.location_ids = adGroupData.targeting.locations;
    }

    if (adGroupData.targeting.interests && adGroupData.targeting.interests.length > 0) {
      body.interest_category_ids = adGroupData.targeting.interests;
    }

    if (adGroupData.scheduleStartTime) {
      body.schedule_start_time = adGroupData.scheduleStartTime;
    }

    if (adGroupData.scheduleEndTime) {
      body.schedule_end_time = adGroupData.scheduleEndTime;
    }

    const data = await this.makeRequest('/adgroup/create/', 'POST', body);
    
    await this.logAction('tiktok', 'adgroup', data.adgroup_id, 'created', { 
      name: adGroupData.name,
      campaignId: adGroupData.campaignId 
    });

    return { adgroup_id: data.adgroup_id };
  }

  async createAd(adData: {
    adGroupId: string;
    name: string;
    videoId: string;
    adText: string;
    callToAction: string;
    landingPageUrl: string;
    displayName?: string;
  }): Promise<{ ad_id: string }> {
    const body = {
      advertiser_id: this.advertiserId,
      adgroup_id: adData.adGroupId,
      creatives: [{
        ad_name: adData.name,
        ad_text: adData.adText,
        video_id: adData.videoId,
        call_to_action: adData.callToAction,
        landing_page_url: adData.landingPageUrl,
        display_name: adData.displayName || 'Tan & Co',
      }],
    };

    const data = await this.makeRequest('/ad/create/', 'POST', body);
    
    await this.logAction('tiktok', 'ad', data.ad_ids[0], 'created', { 
      name: adData.name,
      adGroupId: adData.adGroupId 
    });

    return { ad_id: data.ad_ids[0] };
  }

  async uploadVideo(videoUrl: string): Promise<{ video_id: string }> {
    const body = {
      advertiser_id: this.advertiserId,
      upload_type: 'UPLOAD_BY_URL',
      video_url: videoUrl,
    };

    const data = await this.makeRequest('/file/video/ad/upload/', 'POST', body);
    
    await this.logAction('tiktok', 'video', data.video_id, 'uploaded', {});

    return { video_id: data.video_id };
  }

  async uploadImage(imageUrl: string): Promise<{ image_id: string }> {
    const body = {
      advertiser_id: this.advertiserId,
      upload_type: 'UPLOAD_BY_URL',
      image_url: imageUrl,
    };

    const data = await this.makeRequest('/file/image/ad/upload/', 'POST', body);
    
    await this.logAction('tiktok', 'image', data.image_id, 'uploaded', {});

    return { image_id: data.image_id };
  }

  async getCampaignPerformance(
    campaignId: string,
    startDate: string,
    endDate: string
  ): Promise<any> {
    const body = {
      advertiser_id: this.advertiserId,
      report_type: 'BASIC',
      data_level: 'AUCTION_CAMPAIGN',
      dimensions: ['campaign_id'],
      metrics: [
        'impressions',
        'clicks',
        'spend',
        'conversions',
        'ctr',
        'cpc',
        'conversion_rate',
      ],
      filters: [{
        field_name: 'campaign_ids',
        filter_type: 'IN',
        filter_value: [campaignId],
      }],
      start_date: startDate,
      end_date: endDate,
      page: 1,
      page_size: 1000,
    };

    const data = await this.makeRequest('/reports/integrated/get/', 'POST', body);
    
    if (!data.list || data.list.length === 0) {
      return {
        campaignId,
        impressions: 0,
        clicks: 0,
        spend: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        conversion_rate: 0,
      };
    }

    const metrics = data.list[0].metrics;
    return {
      campaignId,
      impressions: parseInt(metrics.impressions || '0'),
      clicks: parseInt(metrics.clicks || '0'),
      spend: parseFloat(metrics.spend || '0'),
      conversions: parseInt(metrics.conversions || '0'),
      ctr: parseFloat(metrics.ctr || '0'),
      cpc: parseFloat(metrics.cpc || '0'),
      conversion_rate: parseFloat(metrics.conversion_rate || '0'),
    };
  }

  async getAdGroupPerformance(
    adGroupId: string,
    startDate: string,
    endDate: string
  ): Promise<TikTokAdGroupPerformance> {
    const body = {
      advertiser_id: this.advertiserId,
      report_type: 'BASIC',
      data_level: 'AUCTION_ADGROUP',
      dimensions: ['adgroup_id'],
      metrics: [
        'impressions',
        'clicks',
        'spend',
        'conversions',
        'ctr',
        'cpc',
        'conversion_rate',
      ],
      filters: [{
        field_name: 'adgroup_ids',
        filter_type: 'IN',
        filter_value: [adGroupId],
      }],
      start_date: startDate,
      end_date: endDate,
      page: 1,
      page_size: 1000,
    };

    const data = await this.makeRequest('/reports/integrated/get/', 'POST', body);
    
    if (!data.list || data.list.length === 0) {
      return {
        adgroup_id: adGroupId,
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        conversion_rate: 0,
      };
    }

    const metrics = data.list[0].metrics;
    return {
      adgroup_id: adGroupId,
      impressions: parseInt(metrics.impressions || '0'),
      clicks: parseInt(metrics.clicks || '0'),
      cost: parseFloat(metrics.spend || '0'),
      conversions: parseInt(metrics.conversions || '0'),
      ctr: parseFloat(metrics.ctr || '0'),
      cpc: parseFloat(metrics.cpc || '0'),
      conversion_rate: parseFloat(metrics.conversion_rate || '0'),
    };
  }

  async updateCampaignStatus(
    campaignId: string,
    status: 'ENABLE' | 'DISABLE'
  ): Promise<void> {
    const body = {
      advertiser_id: this.advertiserId,
      campaign_ids: [campaignId],
      opt_status: status,
    };

    await this.makeRequest('/campaign/update/status/', 'POST', body);
    
    await this.logAction('tiktok', 'campaign', campaignId, 'status_updated', { status });
  }

  async updateAdGroupBudget(
    adGroupId: string,
    budget: number
  ): Promise<void> {
    const body = {
      advertiser_id: this.advertiserId,
      adgroup_id: adGroupId,
      budget,
    };

    await this.makeRequest('/adgroup/update/', 'POST', body);
    
    await this.logAction('tiktok', 'adgroup', adGroupId, 'budget_updated', { budget });
  }

  async createCustomAudience(audienceData: {
    name: string;
    audienceType: 'CUSTOMER_FILE' | 'ENGAGEMENT' | 'WEBSITE';
    description?: string;
  }): Promise<{ custom_audience_id: string }> {
    const body = {
      advertiser_id: this.advertiserId,
      custom_audience_name: audienceData.name,
      audience_sub_type: audienceData.audienceType,
      description: audienceData.description || '',
    };

    const data = await this.makeRequest('/dmp/custom_audience/create/', 'POST', body);
    
    await this.logAction('tiktok', 'audience', data.custom_audience_id, 'created', { 
      name: audienceData.name 
    });

    return { custom_audience_id: data.custom_audience_id };
  }

  async addUsersToCustomAudience(
    audienceId: string,
    users: Array<{ email?: string; phone?: string }>
  ): Promise<void> {
    const crypto = await import('crypto');
    
    const hashedData = users.map(user => {
      const item: any = {};
      if (user.email) {
        item.email = crypto.createHash('sha256').update(user.email.toLowerCase().trim()).digest('hex');
      }
      if (user.phone) {
        const cleanPhone = user.phone.replace(/\D/g, '');
        item.phone = crypto.createHash('sha256').update(cleanPhone).digest('hex');
      }
      return item;
    });

    const body = {
      advertiser_id: this.advertiserId,
      custom_audience_id: audienceId,
      action: 'ADD',
      id_type: 'EMAIL',
      audience_ids: hashedData.map(d => d.email || d.phone),
    };

    await this.makeRequest('/dmp/custom_audience/update/', 'POST', body);
    
    await this.logAction('tiktok', 'audience', audienceId, 'users_added', { 
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
