import { 
  type User, 
  type InsertUser, 
  type Customer, 
  type InsertCustomer,
  type Membership,
  type InsertMembership,
  type Product,
  type InsertProduct,
  type Transaction,
  type InsertTransaction,
  type DoorAccessLog,
  type InsertDoorAccessLog,
  type AutomationSetting,
  type InsertAutomationSetting,
  type Campaign,
  type InsertCampaign,
  type AdSet,
  type InsertAdSet,
  type Ad,
  type InsertAd,
  type ContentQueue,
  type InsertContentQueue,
  type AutomationLog,
  type InsertAutomationLog,
  type HealthForm,
  type InsertHealthForm,
  type SessionUsage,
  type InsertSessionUsage,
  type FaceUploadToken,
  type InsertFaceUploadToken,
  type PosSale,
  type InsertPosSale,
  type StockMovement,
  type InsertStockMovement,
  type DailySummary,
  users,
  customers,
  memberships,
  products,
  transactions,
  doorAccessLogs,
  automationSettings,
  campaigns,
  adSets,
  ads,
  contentQueue,
  automationLogs,
  healthForms,
  sessionUsage,
  faceUploadTokens,
  posSales,
  posSaleItems,
  stockMovements,
  dailySummaries
} from "@shared/schema";
import { db } from './db';
import { eq, desc, sql, like, or } from 'drizzle-orm';

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByPhone(phone: string): Promise<Customer | undefined>;
  getCustomerByFaceId(faceId: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<void>;
  searchCustomers(query: string): Promise<Customer[]>;

  // Membership operations
  getMembershipsByCustomer(customerId: string): Promise<Membership[]>;
  getMembership(id: string): Promise<Membership | undefined>;
  createMembership(membership: InsertMembership): Promise<Membership>;
  updateMembership(id: string, membership: Partial<InsertMembership>): Promise<Membership | undefined>;
  deleteMembership(id: string): Promise<void>;
  deductSession(membershipId: string): Promise<{ success: boolean; newBalance: number; membership?: Membership }>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;
  getProductsByCategory(category: string): Promise<Product[]>;

  // Transaction operations
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionsByCustomer(customerId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;

  // Door Access Log operations
  getDoorAccessLogs(limit?: number): Promise<DoorAccessLog[]>;
  getDoorAccessLogsByDoor(doorId: string, limit?: number): Promise<DoorAccessLog[]>;
  createDoorAccessLog(log: InsertDoorAccessLog): Promise<DoorAccessLog>;

  // Automation Settings operations
  getAutomationSettings(): Promise<AutomationSetting[]>;
  getAutomationSetting(settingKey: string): Promise<AutomationSetting | undefined>;
  createAutomationSetting(setting: InsertAutomationSetting): Promise<AutomationSetting>;
  updateAutomationSetting(settingKey: string, setting: Partial<InsertAutomationSetting>): Promise<AutomationSetting | undefined>;

  // Campaign operations
  getCampaigns(): Promise<Campaign[]>;
  getCampaignsByPlatform(platform: string): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: string): Promise<void>;

  // AdSet operations
  getAdSets(): Promise<AdSet[]>;
  getAdSetsByCampaign(campaignId: string): Promise<AdSet[]>;
  getAdSet(id: string): Promise<AdSet | undefined>;
  createAdSet(adSet: InsertAdSet): Promise<AdSet>;
  updateAdSet(id: string, adSet: Partial<InsertAdSet>): Promise<AdSet | undefined>;
  deleteAdSet(id: string): Promise<void>;

  // Ad operations
  getAds(): Promise<Ad[]>;
  getAdsByAdSet(adSetId: string): Promise<Ad[]>;
  getAd(id: string): Promise<Ad | undefined>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAd(id: string, ad: Partial<InsertAd>): Promise<Ad | undefined>;
  deleteAd(id: string): Promise<void>;

  // Content Queue operations
  getContentQueue(): Promise<ContentQueue[]>;
  getContentQueueByStatus(status: string): Promise<ContentQueue[]>;
  getContentQueueByPlatform(platform: string): Promise<ContentQueue[]>;
  getContentQueueItem(id: string): Promise<ContentQueue | undefined>;
  createContentQueueItem(item: InsertContentQueue): Promise<ContentQueue>;
  updateContentQueueItem(id: string, item: Partial<InsertContentQueue>): Promise<ContentQueue | undefined>;
  deleteContentQueueItem(id: string): Promise<void>;

  // Automation Log operations
  getAutomationLogs(limit?: number): Promise<AutomationLog[]>;
  getAutomationLogsByPlatform(platform: string, limit?: number): Promise<AutomationLog[]>;
  getAutomationLogsByEntity(entity: string, entityId: string): Promise<AutomationLog[]>;
  createAutomationLog(log: InsertAutomationLog): Promise<AutomationLog>;

  // Health Form operations
  getHealthFormByCustomer(customerId: string): Promise<HealthForm | undefined>;
  createHealthForm(form: InsertHealthForm): Promise<HealthForm>;

  // Session Usage operations
  getSessionUsageByCustomer(customerId: string): Promise<SessionUsage[]>;
  getSessionUsageByMembership(membershipId: string): Promise<SessionUsage[]>;
  createSessionUsage(usage: InsertSessionUsage): Promise<SessionUsage>;

  // Face Upload Token operations
  createFaceUploadToken(token: InsertFaceUploadToken): Promise<FaceUploadToken>;
  getFaceUploadToken(token: string): Promise<FaceUploadToken | undefined>;
  updateFaceUploadTokenWithImage(token: string, imageUrl: string): Promise<FaceUploadToken | undefined>;

  // POS Sales operations
  createPosSale(sale: InsertPosSale & { saleNumber: string }): Promise<PosSale>;
  getPosSale(id: string): Promise<PosSale | undefined>;
  getPosSales(startDate?: Date, endDate?: Date): Promise<PosSale[]>;
  getPosSalesByCustomer(customerId: string): Promise<PosSale[]>;
  updatePosSaleStatus(id: string, status: string): Promise<PosSale | undefined>;
  
  // Stock Movement operations
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;
  getStockMovements(productId?: string, limit?: number): Promise<StockMovement[]>;
  getStockMovementsByProduct(productId: string): Promise<StockMovement[]>;
  
  // Daily Summary operations
  getDailySummary(date: Date): Promise<DailySummary | undefined>;
  createOrUpdateDailySummary(date: Date, summary: Partial<DailySummary>): Promise<DailySummary>;
  getDailySummaries(startDate: Date, endDate: Date): Promise<DailySummary[]>;
}

export class PostgresStorage implements IStorage {
  // ============================================================
  // USER OPERATIONS
  // ============================================================
  
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // ============================================================
  // CUSTOMER OPERATIONS
  // ============================================================
  
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.id, id));
    return result[0];
  }

  async getCustomerByPhone(phone: string): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.phone, phone));
    return result[0];
  }

  async getCustomerByFaceId(faceId: string): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.faceRecognitionId, faceId));
    return result[0];
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const result = await db.insert(customers).values(customer).returning();
    return result[0];
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const result = await db
      .update(customers)
      .set({ ...customer, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return result[0];
  }

  async deleteCustomer(id: string): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    const searchPattern = `%${query}%`;
    return await db
      .select()
      .from(customers)
      .where(
        or(
          like(customers.fullName, searchPattern),
          like(customers.phone, searchPattern),
          like(customers.email, searchPattern)
        )
      )
      .orderBy(desc(customers.createdAt));
  }

  // ============================================================
  // MEMBERSHIP OPERATIONS
  // ============================================================
  
  async getMembershipsByCustomer(customerId: string): Promise<Membership[]> {
    return await db
      .select()
      .from(memberships)
      .where(eq(memberships.customerId, customerId))
      .orderBy(desc(memberships.createdAt));
  }

  async getMembership(id: string): Promise<Membership | undefined> {
    const result = await db.select().from(memberships).where(eq(memberships.id, id));
    return result[0];
  }

  async createMembership(membership: InsertMembership): Promise<Membership> {
    const result = await db.insert(memberships).values(membership).returning();
    return result[0];
  }

  async updateMembership(id: string, membership: Partial<InsertMembership>): Promise<Membership | undefined> {
    const result = await db
      .update(memberships)
      .set({ ...membership, updatedAt: new Date() })
      .where(eq(memberships.id, id))
      .returning();
    return result[0];
  }

  async deleteMembership(id: string): Promise<void> {
    await db.delete(memberships).where(eq(memberships.id, id));
  }

  async deductSession(membershipId: string): Promise<{ success: boolean; newBalance: number; membership?: Membership }> {
    const membership = await this.getMembership(membershipId);
    
    if (!membership) {
      return { success: false, newBalance: 0 };
    }

    if (membership.balance <= 0) {
      return { success: false, newBalance: 0 };
    }

    const newBalance = membership.balance - 1;
    const updatedMembership = await this.updateMembership(membershipId, { balance: newBalance });

    return {
      success: true,
      newBalance,
      membership: updatedMembership,
    };
  }

  // ============================================================
  // PRODUCT OPERATIONS
  // ============================================================
  
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const productData = {
      ...product,
      price: typeof product.price === 'number' ? product.price.toString() : product.price,
      salePrice: product.salePrice 
        ? (typeof product.salePrice === 'number' ? product.salePrice.toString() : product.salePrice)
        : null,
    };
    const result = await db.insert(products).values(productData as any).returning();
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const productData = {
      ...product,
      price: product.price !== undefined 
        ? (typeof product.price === 'number' ? product.price.toString() : product.price)
        : undefined,
      salePrice: product.salePrice !== undefined
        ? (product.salePrice === null ? null : (typeof product.salePrice === 'number' ? product.salePrice.toString() : product.salePrice))
        : undefined,
      updatedAt: new Date(),
    };
    const result = await db
      .update(products)
      .set(productData as any)
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.category, category))
      .orderBy(desc(products.createdAt));
  }

  // ============================================================
  // TRANSACTION OPERATIONS
  // ============================================================
  
  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.id, id));
    return result[0];
  }

  async getTransactionsByCustomer(customerId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.customerId, customerId))
      .orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  async updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const result = await db
      .update(transactions)
      .set(transaction)
      .where(eq(transactions.id, id))
      .returning();
    return result[0];
  }

  // ============================================================
  // DOOR ACCESS LOG OPERATIONS
  // ============================================================
  
  async getDoorAccessLogs(limit: number = 100): Promise<DoorAccessLog[]> {
    return await db
      .select()
      .from(doorAccessLogs)
      .orderBy(desc(doorAccessLogs.createdAt))
      .limit(limit);
  }

  async getDoorAccessLogsByDoor(doorId: string, limit: number = 100): Promise<DoorAccessLog[]> {
    return await db
      .select()
      .from(doorAccessLogs)
      .where(eq(doorAccessLogs.doorId, doorId))
      .orderBy(desc(doorAccessLogs.createdAt))
      .limit(limit);
  }

  async createDoorAccessLog(log: InsertDoorAccessLog): Promise<DoorAccessLog> {
    const result = await db.insert(doorAccessLogs).values(log).returning();
    return result[0];
  }

  // ============================================================
  // AUTOMATION SETTINGS OPERATIONS
  // ============================================================
  
  async getAutomationSettings(): Promise<AutomationSetting[]> {
    return await db.select().from(automationSettings);
  }

  async getAutomationSetting(settingKey: string): Promise<AutomationSetting | undefined> {
    const result = await db
      .select()
      .from(automationSettings)
      .where(eq(automationSettings.settingKey, settingKey));
    return result[0];
  }

  async createAutomationSetting(setting: InsertAutomationSetting): Promise<AutomationSetting> {
    const result = await db.insert(automationSettings).values(setting).returning();
    return result[0];
  }

  async updateAutomationSetting(
    settingKey: string,
    setting: Partial<InsertAutomationSetting>
  ): Promise<AutomationSetting | undefined> {
    const result = await db
      .update(automationSettings)
      .set({ ...setting, updatedAt: new Date() })
      .where(eq(automationSettings.settingKey, settingKey))
      .returning();
    return result[0];
  }

  // ============================================================
  // CAMPAIGN OPERATIONS
  // ============================================================
  
  async getCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
  }

  async getCampaignsByPlatform(platform: string): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.platform, platform))
      .orderBy(desc(campaigns.createdAt));
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const result = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return result[0];
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const result = await db.insert(campaigns).values(campaign).returning();
    return result[0];
  }

  async updateCampaign(id: string, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const result = await db
      .update(campaigns)
      .set({ ...campaign, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();
    return result[0];
  }

  async deleteCampaign(id: string): Promise<void> {
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }

  // ============================================================
  // AD SET OPERATIONS
  // ============================================================
  
  async getAdSets(): Promise<AdSet[]> {
    return await db.select().from(adSets).orderBy(desc(adSets.createdAt));
  }

  async getAdSetsByCampaign(campaignId: string): Promise<AdSet[]> {
    return await db
      .select()
      .from(adSets)
      .where(eq(adSets.campaignId, campaignId))
      .orderBy(desc(adSets.createdAt));
  }

  async getAdSet(id: string): Promise<AdSet | undefined> {
    const result = await db.select().from(adSets).where(eq(adSets.id, id));
    return result[0];
  }

  async createAdSet(adSet: InsertAdSet): Promise<AdSet> {
    const result = await db.insert(adSets).values(adSet).returning();
    return result[0];
  }

  async updateAdSet(id: string, adSet: Partial<InsertAdSet>): Promise<AdSet | undefined> {
    const result = await db
      .update(adSets)
      .set({ ...adSet, updatedAt: new Date() })
      .where(eq(adSets.id, id))
      .returning();
    return result[0];
  }

  async deleteAdSet(id: string): Promise<void> {
    await db.delete(adSets).where(eq(adSets.id, id));
  }

  // ============================================================
  // AD OPERATIONS
  // ============================================================
  
  async getAds(): Promise<Ad[]> {
    return await db.select().from(ads).orderBy(desc(ads.createdAt));
  }

  async getAdsByAdSet(adSetId: string): Promise<Ad[]> {
    return await db
      .select()
      .from(ads)
      .where(eq(ads.adSetId, adSetId))
      .orderBy(desc(ads.createdAt));
  }

  async getAd(id: string): Promise<Ad | undefined> {
    const result = await db.select().from(ads).where(eq(ads.id, id));
    return result[0];
  }

  async createAd(ad: InsertAd): Promise<Ad> {
    const result = await db.insert(ads).values(ad).returning();
    return result[0];
  }

  async updateAd(id: string, ad: Partial<InsertAd>): Promise<Ad | undefined> {
    const result = await db
      .update(ads)
      .set({ ...ad, updatedAt: new Date() })
      .where(eq(ads.id, id))
      .returning();
    return result[0];
  }

  async deleteAd(id: string): Promise<void> {
    await db.delete(ads).where(eq(ads.id, id));
  }

  // ============================================================
  // CONTENT QUEUE OPERATIONS
  // ============================================================
  
  async getContentQueue(): Promise<ContentQueue[]> {
    return await db.select().from(contentQueue).orderBy(desc(contentQueue.createdAt));
  }

  async getContentQueueByStatus(status: string): Promise<ContentQueue[]> {
    return await db
      .select()
      .from(contentQueue)
      .where(eq(contentQueue.status, status))
      .orderBy(desc(contentQueue.createdAt));
  }

  async getContentQueueByPlatform(platform: string): Promise<ContentQueue[]> {
    return await db
      .select()
      .from(contentQueue)
      .where(eq(contentQueue.platform, platform))
      .orderBy(desc(contentQueue.createdAt));
  }

  async getContentQueueItem(id: string): Promise<ContentQueue | undefined> {
    const result = await db.select().from(contentQueue).where(eq(contentQueue.id, id));
    return result[0];
  }

  async createContentQueueItem(item: InsertContentQueue): Promise<ContentQueue> {
    const result = await db.insert(contentQueue).values(item).returning();
    return result[0];
  }

  async updateContentQueueItem(id: string, item: Partial<InsertContentQueue>): Promise<ContentQueue | undefined> {
    const result = await db
      .update(contentQueue)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(contentQueue.id, id))
      .returning();
    return result[0];
  }

  async deleteContentQueueItem(id: string): Promise<void> {
    await db.delete(contentQueue).where(eq(contentQueue.id, id));
  }

  // ============================================================
  // AUTOMATION LOG OPERATIONS
  // ============================================================
  
  async getAutomationLogs(limit: number = 100): Promise<AutomationLog[]> {
    return await db
      .select()
      .from(automationLogs)
      .orderBy(desc(automationLogs.timestamp))
      .limit(limit);
  }

  async getAutomationLogsByPlatform(platform: string, limit: number = 100): Promise<AutomationLog[]> {
    return await db
      .select()
      .from(automationLogs)
      .where(eq(automationLogs.platform, platform))
      .orderBy(desc(automationLogs.timestamp))
      .limit(limit);
  }

  async getAutomationLogsByEntity(entity: string, entityId: string): Promise<AutomationLog[]> {
    return await db
      .select()
      .from(automationLogs)
      .where(sql`${automationLogs.entity} = ${entity} AND ${automationLogs.entityId} = ${entityId}`)
      .orderBy(desc(automationLogs.timestamp));
  }

  async createAutomationLog(log: InsertAutomationLog): Promise<AutomationLog> {
    const result = await db.insert(automationLogs).values(log).returning();
    return result[0];
  }

  // ============================================================
  // HEALTH FORM OPERATIONS
  // ============================================================
  
  async getHealthFormByCustomer(customerId: string): Promise<HealthForm | undefined> {
    const result = await db
      .select()
      .from(healthForms)
      .where(eq(healthForms.customerId, customerId))
      .orderBy(desc(healthForms.createdAt))
      .limit(1);
    return result[0];
  }

  async createHealthForm(form: InsertHealthForm): Promise<HealthForm> {
    const result = await db.insert(healthForms).values(form).returning();
    return result[0];
  }

  // ============================================================
  // SESSION USAGE OPERATIONS
  // ============================================================
  
  async getSessionUsageByCustomer(customerId: string): Promise<SessionUsage[]> {
    return await db
      .select()
      .from(sessionUsage)
      .where(eq(sessionUsage.customerId, customerId))
      .orderBy(desc(sessionUsage.createdAt));
  }

  async getSessionUsageByMembership(membershipId: string): Promise<SessionUsage[]> {
    return await db
      .select()
      .from(sessionUsage)
      .where(eq(sessionUsage.membershipId, membershipId))
      .orderBy(desc(sessionUsage.createdAt));
  }

  async createSessionUsage(usage: InsertSessionUsage): Promise<SessionUsage> {
    const result = await db.insert(sessionUsage).values(usage).returning();
    return result[0];
  }

  // ============================================================
  // FACE UPLOAD TOKEN OPERATIONS
  // ============================================================
  
  async createFaceUploadToken(token: InsertFaceUploadToken): Promise<FaceUploadToken> {
    const result = await db.insert(faceUploadTokens).values(token).returning();
    return result[0];
  }

  async getFaceUploadToken(token: string): Promise<FaceUploadToken | undefined> {
    const result = await db
      .select()
      .from(faceUploadTokens)
      .where(eq(faceUploadTokens.token, token))
      .limit(1);
    return result[0];
  }

  async updateFaceUploadTokenWithImage(token: string, imageUrl: string): Promise<FaceUploadToken | undefined> {
    const result = await db
      .update(faceUploadTokens)
      .set({ imageUrl, status: 'uploaded' })
      .where(eq(faceUploadTokens.token, token))
      .returning();
    return result[0];
  }

  // ============================================================
  // POS SALES OPERATIONS
  // ============================================================

  async createPosSale(sale: InsertPosSale & { saleNumber: string }): Promise<PosSale> {
    const result = await db.insert(posSales).values(sale).returning();
    return result[0];
  }

  async getPosSale(id: string): Promise<PosSale | undefined> {
    const result = await db.select().from(posSales).where(eq(posSales.id, id));
    return result[0];
  }

  async getPosSales(startDate?: Date, endDate?: Date): Promise<PosSale[]> {
    let query = db.select().from(posSales);
    
    if (startDate || endDate) {
      if (startDate && endDate) {
        query = query.where(
          sql`${posSales.createdAt} >= ${startDate} AND ${posSales.createdAt} <= ${endDate}`
        ) as any;
      } else if (startDate) {
        query = query.where(sql`${posSales.createdAt} >= ${startDate}`) as any;
      } else if (endDate) {
        query = query.where(sql`${posSales.createdAt} <= ${endDate}`) as any;
      }
    }
    
    return await query.orderBy(desc(posSales.createdAt));
  }

  async getPosSalesByCustomer(customerId: string): Promise<PosSale[]> {
    return await db
      .select()
      .from(posSales)
      .where(eq(posSales.customerId, customerId))
      .orderBy(desc(posSales.createdAt));
  }

  async updatePosSaleStatus(id: string, status: string): Promise<PosSale | undefined> {
    const result = await db
      .update(posSales)
      .set({ status, updatedAt: new Date() })
      .where(eq(posSales.id, id))
      .returning();
    return result[0];
  }

  // ============================================================
  // STOCK MOVEMENT OPERATIONS
  // ============================================================

  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    const result = await db.insert(stockMovements).values(movement).returning();
    return result[0];
  }

  async getStockMovements(productId?: string, limit: number = 100): Promise<StockMovement[]> {
    let query = db.select().from(stockMovements);
    
    if (productId) {
      query = query.where(eq(stockMovements.productId, productId)) as any;
    }
    
    return await query
      .orderBy(desc(stockMovements.createdAt))
      .limit(limit);
  }

  async getStockMovementsByProduct(productId: string): Promise<StockMovement[]> {
    return await db
      .select()
      .from(stockMovements)
      .where(eq(stockMovements.productId, productId))
      .orderBy(desc(stockMovements.createdAt));
  }

  // ============================================================
  // DAILY SUMMARY OPERATIONS
  // ============================================================

  async getDailySummary(date: Date): Promise<DailySummary | undefined> {
    // Normalize date to start of day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const result = await db
      .select()
      .from(dailySummaries)
      .where(sql`DATE(${dailySummaries.date}) = DATE(${startOfDay})`);
    return result[0];
  }

  async createOrUpdateDailySummary(date: Date, summary: Partial<DailySummary>): Promise<DailySummary> {
    // Normalize date to start of day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const existing = await this.getDailySummary(startOfDay);
    
    if (existing) {
      const result = await db
        .update(dailySummaries)
        .set({ ...summary, updatedAt: new Date() })
        .where(eq(dailySummaries.id, existing.id))
        .returning();
      return result[0];
    } else {
      const result = await db
        .insert(dailySummaries)
        .values({ date: startOfDay, ...summary })
        .returning();
      return result[0];
    }
  }

  async getDailySummaries(startDate: Date, endDate: Date): Promise<DailySummary[]> {
    return await db
      .select()
      .from(dailySummaries)
      .where(
        sql`${dailySummaries.date} >= ${startDate} AND ${dailySummaries.date} <= ${endDate}`
      )
      .orderBy(desc(dailySummaries.date));
  }
}

// Export PostgresStorage as the default storage implementation
export const storage = new PostgresStorage();
