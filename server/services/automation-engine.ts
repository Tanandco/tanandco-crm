import type { IStorage } from '../storage';
import type { Campaign, AdSet, Ad } from '@shared/schema';
import { MetaMarketingService } from './meta-marketing-service';
import { GoogleAdsService } from './google-ads-service';
import { TikTokAdsService } from './tiktok-ads-service';
import { WhatsAppService } from './whatsapp-service';

interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
  costPerConversion?: number;
  conversionRate?: number;
}

interface BudgetAdjustment {
  entityId: string;
  entityType: 'campaign' | 'adset';
  currentBudget: number;
  newBudget: number;
  reason: string;
}

export class AutomationEngine {
  private storage: IStorage;
  private metaService?: MetaMarketingService;
  private googleService?: GoogleAdsService;
  private tiktokService?: TikTokAdsService;
  private whatsappService: WhatsAppService;
  private monitoringInterval?: NodeJS.Timeout;

  private readonly MAX_BUDGET_INCREASE = 0.30;
  private readonly MAX_BUDGET_DECREASE = 0.50;
  private readonly MIN_DAILY_BUDGET = 50;
  private readonly TARGET_CTR = 0.02;
  private readonly TARGET_CONVERSION_RATE = 0.05;
  private readonly PERFORMANCE_CHECK_INTERVAL = 15 * 60 * 1000;

  constructor(storage: IStorage, whatsappService: WhatsAppService) {
    this.storage = storage;
    this.whatsappService = whatsappService;
  }

  initializeMetaService(accessToken: string): void {
    this.metaService = new MetaMarketingService(accessToken, this.storage);
  }

  initializeGoogleService(
    clientId: string,
    clientSecret: string,
    refreshToken: string,
    developerToken: string,
    customerId: string
  ): void {
    this.googleService = new GoogleAdsService(
      clientId,
      clientSecret,
      refreshToken,
      developerToken,
      customerId,
      this.storage
    );
  }

  initializeTikTokService(accessToken: string, advertiserId: string): void {
    this.tiktokService = new TikTokAdsService(accessToken, advertiserId, this.storage);
  }

  startAutomation(): void {
    console.log('🤖 Automation Engine Started - Monitoring every 15 minutes');
    
    this.runAutomationCycle();
    
    this.monitoringInterval = setInterval(() => {
      this.runAutomationCycle();
    }, this.PERFORMANCE_CHECK_INTERVAL);
  }

  stopAutomation(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
      console.log('🛑 Automation Engine Stopped');
    }
  }

  private async runAutomationCycle(): Promise<void> {
    try {
      console.log(`🔄 Running automation cycle at ${new Date().toISOString()}`);

      await Promise.all([
        this.monitorAndOptimizeCampaigns(),
        this.performBudgetPacing(),
        this.runABTests(),
        this.syncAudiences(),
      ]);

      await this.storage.createAutomationLog({
        platform: 'automation_engine',
        entity: 'cycle',
        entityId: 'main',
        action: 'completed',
        success: true,
        details: { timestamp: new Date().toISOString() },
      });

      console.log('✅ Automation cycle completed successfully');
    } catch (error: any) {
      console.error('❌ Automation cycle failed:', error);
      
      await this.storage.createAutomationLog({
        platform: 'automation_engine',
        entity: 'cycle',
        entityId: 'main',
        action: 'failed',
        success: false,
        details: { error: error.message },
      });

      await this.sendWhatsAppAlert(
        'אזהרה! מחזור האוטומציה נכשל',
        `שגיאה: ${error.message}`
      );
    }
  }

  private async monitorAndOptimizeCampaigns(): Promise<void> {
    const campaigns = await this.storage.getCampaigns();
    const activeCampaigns = campaigns.filter(c => c.status === 'active');

    for (const campaign of activeCampaigns) {
      try {
        await this.optimizeCampaign(campaign);
      } catch (error: any) {
        console.error(`Failed to optimize campaign ${campaign.id}:`, error);
        
        await this.storage.createAutomationLog({
          platform: campaign.platform,
          entity: 'campaign',
          entityId: campaign.id,
          action: 'optimization_failed',
          success: false,
          details: { error: error.message },
        });
      }
    }
  }

  private async optimizeCampaign(campaign: Campaign): Promise<void> {
    let metrics: PerformanceMetrics | null = null;

    if (campaign.platform === 'meta' && this.metaService && campaign.platformCampaignId) {
      const insights = await this.metaService.getCampaignInsights(campaign.platformCampaignId);
      metrics = {
        impressions: insights.impressions,
        clicks: insights.clicks,
        spend: insights.spend,
        conversions: insights.conversions || 0,
        ctr: insights.ctr,
        cpc: insights.cpc,
        costPerConversion: insights.cost_per_conversion,
      };
    } else if (campaign.platform === 'google_ads' && this.googleService && campaign.platformCampaignId) {
      metrics = await this.googleService.getCampaignPerformance(campaign.platformCampaignId);
    } else if (campaign.platform === 'tiktok' && this.tiktokService && campaign.platformCampaignId) {
      const today = new Date().toISOString().split('T')[0];
      metrics = await this.tiktokService.getCampaignPerformance(campaign.platformCampaignId, today, today);
    }

    if (!metrics) return;

    await this.storage.updateCampaign(campaign.id, {
      metrics: metrics as any,
    });

    const shouldPause = this.shouldPauseCampaign(metrics, campaign);
    const budgetAdjustment = this.calculateBudgetAdjustment(metrics, campaign);

    if (shouldPause) {
      await this.pauseCampaign(campaign);
      
      await this.sendWhatsAppAlert(
        `⏸️ קמפיין ${campaign.name} הושהה אוטומטית`,
        `ביצועים גרועים: CTR ${metrics.ctr.toFixed(2)}%, CPC ₪${metrics.cpc.toFixed(2)}`
      );
    } else if (budgetAdjustment) {
      await this.adjustCampaignBudget(campaign, budgetAdjustment);
    }

    await this.storage.createAutomationLog({
      platform: campaign.platform,
      entity: 'campaign',
      entityId: campaign.id,
      action: 'performance_checked',
      success: true,
      details: { metrics, shouldPause, budgetAdjustment },
    });
  }

  private shouldPauseCampaign(metrics: PerformanceMetrics, campaign: Campaign): boolean {
    if (metrics.spend < 100) return false;

    const poorPerformance = 
      metrics.ctr < this.TARGET_CTR * 0.3 || 
      (metrics.conversions > 0 && metrics.costPerConversion && metrics.costPerConversion > campaign.budget * 0.5);

    return poorPerformance;
  }

  private calculateBudgetAdjustment(
    metrics: PerformanceMetrics,
    campaign: Campaign
  ): BudgetAdjustment | null {
    if (metrics.spend < 50 || metrics.impressions < 1000) {
      return null;
    }

    const currentBudget = campaign.budget;
    let newBudget = currentBudget;
    let reason = '';

    const performanceScore = this.calculatePerformanceScore(metrics);

    if (performanceScore > 0.8) {
      newBudget = Math.min(
        currentBudget * (1 + this.MAX_BUDGET_INCREASE),
        currentBudget + 200
      );
      reason = `ביצועים מצוינים (ציון ${(performanceScore * 100).toFixed(0)})`;
    } else if (performanceScore > 0.6) {
      newBudget = currentBudget * 1.10;
      reason = `ביצועים טובים (ציון ${(performanceScore * 100).toFixed(0)})`;
    } else if (performanceScore < 0.3) {
      newBudget = Math.max(
        currentBudget * (1 - this.MAX_BUDGET_DECREASE),
        this.MIN_DAILY_BUDGET
      );
      reason = `ביצועים חלשים (ציון ${(performanceScore * 100).toFixed(0)})`;
    } else if (performanceScore < 0.5) {
      newBudget = currentBudget * 0.90;
      reason = `ביצועים בינוניים (ציון ${(performanceScore * 100).toFixed(0)})`;
    }

    if (Math.abs(newBudget - currentBudget) < 10) {
      return null;
    }

    return {
      entityId: campaign.id,
      entityType: 'campaign',
      currentBudget,
      newBudget: Math.round(newBudget),
      reason,
    };
  }

  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    let score = 0;

    const ctrScore = Math.min(metrics.ctr / this.TARGET_CTR, 1) * 0.3;
    score += ctrScore;

    if (metrics.conversions > 0) {
      const conversionScore = Math.min(
        (metrics.conversionRate || 0) / this.TARGET_CONVERSION_RATE,
        1
      ) * 0.4;
      score += conversionScore;

      if (metrics.costPerConversion) {
        const efficiencyScore = Math.max(1 - (metrics.costPerConversion / 200), 0) * 0.3;
        score += efficiencyScore;
      }
    } else {
      const cpcScore = Math.max(1 - (metrics.cpc / 5), 0) * 0.4;
      score += cpcScore;

      const clickScore = Math.min(metrics.clicks / 100, 1) * 0.3;
      score += clickScore;
    }

    return score;
  }

  private async adjustCampaignBudget(
    campaign: Campaign,
    adjustment: BudgetAdjustment
  ): Promise<void> {
    try {
      if (campaign.platform === 'meta' && this.metaService && campaign.platformCampaignId) {
        const adSets = await this.storage.getAdSetsByCampaign(campaign.id);
        if (adSets.length > 0 && adSets[0].platformAdSetId) {
          await this.metaService.updateAdSetBudget(adSets[0].platformAdSetId, adjustment.newBudget);
        }
      } else if (campaign.platform === 'google_ads' && this.googleService && campaign.platformCampaignId) {
        await this.googleService.updateCampaignBudget(campaign.platformCampaignId, adjustment.newBudget);
      } else if (campaign.platform === 'tiktok' && this.tiktokService && campaign.platformCampaignId) {
        const adSets = await this.storage.getAdSetsByCampaign(campaign.id);
        if (adSets.length > 0 && adSets[0].platformAdSetId) {
          await this.tiktokService.updateAdGroupBudget(adSets[0].platformAdSetId, adjustment.newBudget);
        }
      }

      await this.storage.updateCampaign(campaign.id, {
        budget: adjustment.newBudget,
      });

      await this.storage.createAutomationLog({
        platform: campaign.platform,
        entity: 'campaign',
        entityId: campaign.id,
        action: 'budget_adjusted',
        success: true,
        details: adjustment,
      });

      const emoji = adjustment.newBudget > adjustment.currentBudget ? '📈' : '📉';
      await this.sendWhatsAppAlert(
        `${emoji} תקציב ${campaign.name} עודכן`,
        `${adjustment.reason}\nתקציב חדש: ₪${adjustment.newBudget} (קודם: ₪${adjustment.currentBudget})`
      );
    } catch (error: any) {
      console.error('Failed to adjust budget:', error);
      throw error;
    }
  }

  private async pauseCampaign(campaign: Campaign): Promise<void> {
    try {
      if (campaign.platform === 'meta' && this.metaService && campaign.platformCampaignId) {
        await this.metaService.updateCampaignStatus(campaign.platformCampaignId, 'PAUSED');
      } else if (campaign.platform === 'google_ads' && this.googleService && campaign.platformCampaignId) {
        await this.googleService.updateCampaignStatus(campaign.platformCampaignId, 'PAUSED');
      } else if (campaign.platform === 'tiktok' && this.tiktokService && campaign.platformCampaignId) {
        await this.tiktokService.updateCampaignStatus(campaign.platformCampaignId, 'DISABLE');
      }

      await this.storage.updateCampaign(campaign.id, { status: 'paused' });

      await this.storage.createAutomationLog({
        platform: campaign.platform,
        entity: 'campaign',
        entityId: campaign.id,
        action: 'paused',
        success: true,
        details: { reason: 'poor_performance' },
      });
    } catch (error: any) {
      console.error('Failed to pause campaign:', error);
      throw error;
    }
  }

  private async performBudgetPacing(): Promise<void> {
    const campaigns = await this.storage.getCampaigns();
    const activeCampaigns = campaigns.filter(c => c.status === 'active');

    for (const campaign of activeCampaigns) {
      const spendPace = await this.calculateSpendPace(campaign);
      
      if (spendPace > 1.5) {
        await this.sendWhatsAppAlert(
          `⚠️ קמפיין ${campaign.name} מבזבז מהר מדי!`,
          `קצב הוצאה: ${(spendPace * 100).toFixed(0)}% מהצפוי`
        );
      }
    }
  }

  private async calculateSpendPace(campaign: Campaign): Promise<number> {
    const dayProgress = (new Date().getHours() * 60 + new Date().getMinutes()) / (24 * 60);
    const expectedSpend = campaign.budget * dayProgress;

    const metrics = campaign.metrics as any;
    if (!metrics || !metrics.spend) return 0;

    return metrics.spend / expectedSpend;
  }

  private async runABTests(): Promise<void> {
    const campaigns = await this.storage.getCampaigns();
    
    for (const campaign of campaigns) {
      const adSets = await this.storage.getAdSetsByCampaign(campaign.id);
      
      if (adSets.length >= 2) {
        const performanceComparison = await this.compareAdSets(adSets);
        
        if (performanceComparison.significantDifference) {
          await this.handleABTestWinner(campaign, performanceComparison);
        }
      }
    }
  }

  private async compareAdSets(adSets: AdSet[]): Promise<any> {
    const performances = await Promise.all(
      adSets.map(async adSet => {
        const metrics = adSet.metrics as any;
        return {
          adSetId: adSet.id,
          score: this.calculatePerformanceScore(metrics || {}),
          metrics: metrics || {},
        };
      })
    );

    performances.sort((a, b) => b.score - a.score);

    const topPerformer = performances[0];
    const secondBest = performances[1] || performances[0];

    return {
      winner: topPerformer,
      significantDifference: topPerformer.score > secondBest.score * 1.25,
      performances,
    };
  }

  private async handleABTestWinner(campaign: Campaign, comparison: any): Promise<void> {
    const winnerAdSet = await this.storage.getAdSet(comparison.winner.adSetId);
    if (!winnerAdSet) return;

    await this.sendWhatsAppAlert(
      `🏆 ניצחון A/B Test בקמפיין ${campaign.name}`,
      `AdSet "${winnerAdSet.name}" מנצח עם ציון ${(comparison.winner.score * 100).toFixed(0)}`
    );

    await this.storage.createAutomationLog({
      platform: campaign.platform,
      entity: 'ab_test',
      entityId: campaign.id,
      action: 'winner_identified',
      success: true,
      details: comparison,
    });
  }

  private async syncAudiences(): Promise<void> {
    const customers = await this.storage.getCustomers();
    const vipCustomers = customers.filter(c => {
      const memberships = [];
      return memberships.some((m: any) => m.type === 'vip' || m.totalPurchased > 1000);
    });

    if (vipCustomers.length > 50) {
      await this.storage.createAutomationLog({
        platform: 'crm',
        entity: 'audience',
        entityId: 'vip_customers',
        action: 'sync_ready',
        success: true,
        details: { count: vipCustomers.length },
      });
    }
  }

  private async sendWhatsAppAlert(title: string, message: string): Promise<void> {
    try {
      const adminPhone = process.env.ADMIN_PHONE || '972501234567';
      
      await this.whatsappService.sendMessage(
        adminPhone,
        `*${title}*\n\n${message}\n\n_הודעה אוטומטית ממערכת CRM_`
      );
    } catch (error) {
      console.error('Failed to send WhatsApp alert:', error);
    }
  }
}
