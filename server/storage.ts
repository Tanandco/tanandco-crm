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
  type InsertAutomationLog
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private customers: Map<string, Customer>;
  private memberships: Map<string, Membership>;
  private products: Map<string, Product>;
  private transactions: Map<string, Transaction>;
  private automationSettings: Map<string, AutomationSetting>;
  private campaigns: Map<string, Campaign>;
  private adSets: Map<string, AdSet>;
  private ads: Map<string, Ad>;
  private contentQueue: Map<string, ContentQueue>;
  private automationLogs: AutomationLog[];

  constructor() {
    this.users = new Map();
    this.customers = new Map();
    this.memberships = new Map();
    this.products = new Map();
    this.transactions = new Map();
    this.automationSettings = new Map();
    this.campaigns = new Map();
    this.adSets = new Map();
    this.ads = new Map();
    this.contentQueue = new Map();
    this.automationLogs = [];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomerByPhone(phone: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(
      (customer) => customer.phone === phone,
    );
  }

  async getCustomerByFaceId(faceId: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(
      (customer) => customer.faceRecognitionId === faceId,
    );
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = { 
      fullName: insertCustomer.fullName,
      phone: insertCustomer.phone,
      email: insertCustomer.email || null,
      isNewClient: insertCustomer.isNewClient ?? true,
      healthFormSigned: insertCustomer.healthFormSigned ?? false,
      faceRecognitionId: insertCustomer.faceRecognitionId || null,
      notes: insertCustomer.notes || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    
    const updated = { 
      ...customer, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.customers.set(id, updated);
    return updated;
  }

  async deleteCustomer(id: string): Promise<void> {
    this.customers.delete(id);
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.customers.values()).filter(
      (customer) =>
        customer.fullName.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm))
    );
  }

  // Membership operations
  async getMembershipsByCustomer(customerId: string): Promise<Membership[]> {
    return Array.from(this.memberships.values()).filter(
      (membership) => membership.customerId === customerId
    );
  }

  async getMembership(id: string): Promise<Membership | undefined> {
    return this.memberships.get(id);
  }

  async createMembership(insertMembership: InsertMembership): Promise<Membership> {
    const id = randomUUID();
    const membership: Membership = { 
      customerId: insertMembership.customerId,
      type: insertMembership.type,
      balance: insertMembership.balance ?? 0,
      totalPurchased: insertMembership.totalPurchased ?? 0,
      expiryDate: insertMembership.expiryDate || null,
      isActive: insertMembership.isActive ?? true,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.memberships.set(id, membership);
    return membership;
  }

  async updateMembership(id: string, updates: Partial<InsertMembership>): Promise<Membership | undefined> {
    const membership = this.memberships.get(id);
    if (!membership) return undefined;
    
    const updated = { 
      ...membership, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.memberships.set(id, updated);
    return updated;
  }

  async deleteMembership(id: string): Promise<void> {
    this.memberships.delete(id);
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      name: insertProduct.name,
      nameHe: insertProduct.nameHe,
      description: insertProduct.description || null,
      descriptionHe: insertProduct.descriptionHe || null,
      price: insertProduct.price,
      category: insertProduct.category,
      stock: insertProduct.stock ?? 0,
      isActive: insertProduct.isActive ?? true,
      imageUrl: insertProduct.imageUrl || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updated = { 
      ...product, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    this.products.delete(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  // Transaction operations
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByCustomer(customerId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.customerId === customerId
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { 
      customerId: insertTransaction.customerId,
      type: insertTransaction.type,
      amount: insertTransaction.amount,
      currency: insertTransaction.currency ?? "ILS",
      status: insertTransaction.status,
      paymentMethod: insertTransaction.paymentMethod || null,
      cardcomTransactionId: insertTransaction.cardcomTransactionId || null,
      metadata: insertTransaction.metadata || null,
      id,
      createdAt: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updated = { ...transaction, ...updates };
    this.transactions.set(id, updated);
    return updated;
  }

  // Automation Settings operations
  async getAutomationSettings(): Promise<AutomationSetting[]> {
    return Array.from(this.automationSettings.values());
  }

  async getAutomationSetting(settingKey: string): Promise<AutomationSetting | undefined> {
    return this.automationSettings.get(settingKey);
  }

  async createAutomationSetting(insertSetting: InsertAutomationSetting): Promise<AutomationSetting> {
    const id = randomUUID();
    const setting: AutomationSetting = {
      ...insertSetting,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.automationSettings.set(insertSetting.settingKey, setting);
    return setting;
  }

  async updateAutomationSetting(settingKey: string, updates: Partial<InsertAutomationSetting>): Promise<AutomationSetting | undefined> {
    const setting = this.automationSettings.get(settingKey);
    if (!setting) return undefined;
    
    const updated = {
      ...setting,
      ...updates,
      updatedAt: new Date()
    };
    this.automationSettings.set(settingKey, updated);
    return updated;
  }

  // Campaign operations
  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaignsByPlatform(platform: string): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(c => c.platform === platform);
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: string, updates: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updated = {
      ...campaign,
      ...updates,
      updatedAt: new Date()
    };
    this.campaigns.set(id, updated);
    return updated;
  }

  async deleteCampaign(id: string): Promise<void> {
    this.campaigns.delete(id);
  }

  // AdSet operations
  async getAdSets(): Promise<AdSet[]> {
    return Array.from(this.adSets.values());
  }

  async getAdSetsByCampaign(campaignId: string): Promise<AdSet[]> {
    return Array.from(this.adSets.values()).filter(a => a.campaignId === campaignId);
  }

  async getAdSet(id: string): Promise<AdSet | undefined> {
    return this.adSets.get(id);
  }

  async createAdSet(insertAdSet: InsertAdSet): Promise<AdSet> {
    const id = randomUUID();
    const adSet: AdSet = {
      ...insertAdSet,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.adSets.set(id, adSet);
    return adSet;
  }

  async updateAdSet(id: string, updates: Partial<InsertAdSet>): Promise<AdSet | undefined> {
    const adSet = this.adSets.get(id);
    if (!adSet) return undefined;
    
    const updated = {
      ...adSet,
      ...updates,
      updatedAt: new Date()
    };
    this.adSets.set(id, updated);
    return updated;
  }

  async deleteAdSet(id: string): Promise<void> {
    this.adSets.delete(id);
  }

  // Ad operations
  async getAds(): Promise<Ad[]> {
    return Array.from(this.ads.values());
  }

  async getAdsByAdSet(adSetId: string): Promise<Ad[]> {
    return Array.from(this.ads.values()).filter(a => a.adSetId === adSetId);
  }

  async getAd(id: string): Promise<Ad | undefined> {
    return this.ads.get(id);
  }

  async createAd(insertAd: InsertAd): Promise<Ad> {
    const id = randomUUID();
    const ad: Ad = {
      ...insertAd,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.ads.set(id, ad);
    return ad;
  }

  async updateAd(id: string, updates: Partial<InsertAd>): Promise<Ad | undefined> {
    const ad = this.ads.get(id);
    if (!ad) return undefined;
    
    const updated = {
      ...ad,
      ...updates,
      updatedAt: new Date()
    };
    this.ads.set(id, updated);
    return updated;
  }

  async deleteAd(id: string): Promise<void> {
    this.ads.delete(id);
  }

  // Content Queue operations
  async getContentQueue(): Promise<ContentQueue[]> {
    return Array.from(this.contentQueue.values());
  }

  async getContentQueueByStatus(status: string): Promise<ContentQueue[]> {
    return Array.from(this.contentQueue.values()).filter(c => c.status === status);
  }

  async getContentQueueByPlatform(platform: string): Promise<ContentQueue[]> {
    return Array.from(this.contentQueue.values()).filter(c => c.platform === platform);
  }

  async getContentQueueItem(id: string): Promise<ContentQueue | undefined> {
    return this.contentQueue.get(id);
  }

  async createContentQueueItem(insertItem: InsertContentQueue): Promise<ContentQueue> {
    const id = randomUUID();
    const item: ContentQueue = {
      ...insertItem,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.contentQueue.set(id, item);
    return item;
  }

  async updateContentQueueItem(id: string, updates: Partial<InsertContentQueue>): Promise<ContentQueue | undefined> {
    const item = this.contentQueue.get(id);
    if (!item) return undefined;
    
    const updated = {
      ...item,
      ...updates,
      updatedAt: new Date()
    };
    this.contentQueue.set(id, updated);
    return updated;
  }

  async deleteContentQueueItem(id: string): Promise<void> {
    this.contentQueue.delete(id);
  }

  // Automation Log operations
  async getAutomationLogs(limit?: number): Promise<AutomationLog[]> {
    const logs = [...this.automationLogs].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
    return limit ? logs.slice(0, limit) : logs;
  }

  async getAutomationLogsByPlatform(platform: string, limit?: number): Promise<AutomationLog[]> {
    const logs = this.automationLogs
      .filter(l => l.platform === platform)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return limit ? logs.slice(0, limit) : logs;
  }

  async getAutomationLogsByEntity(entity: string, entityId: string): Promise<AutomationLog[]> {
    return this.automationLogs
      .filter(l => l.entity === entity && l.entityId === entityId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createAutomationLog(insertLog: InsertAutomationLog): Promise<AutomationLog> {
    const id = randomUUID();
    const log: AutomationLog = {
      ...insertLog,
      id,
      timestamp: insertLog.timestamp || new Date()
    };
    this.automationLogs.push(log);
    
    // Keep only last 10000 logs in memory
    if (this.automationLogs.length > 10000) {
      this.automationLogs = this.automationLogs.slice(-10000);
    }
    
    return log;
  }
}

export const storage = new MemStorage();
