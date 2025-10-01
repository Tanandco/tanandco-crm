import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, decimal, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Customers table for CRM system
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  isNewClient: boolean("is_new_client").default(true).notNull(),
  healthFormSigned: boolean("health_form_signed").default(false).notNull(),
  faceRecognitionId: text("face_recognition_id"),
  notes: text("notes"),
  // WhatsApp workflow fields
  stage: text("stage").default("lead_inbound").notNull(), // Customer journey stage
  waOptIn: boolean("wa_opt_in").default(true).notNull(), // WhatsApp marketing consent
  lastWhatsAppMsgAt: timestamp("last_whatsapp_msg_at"), // Last WhatsApp message timestamp
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Memberships table for customer subscriptions
export const memberships = pgTable("memberships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  type: text("type").notNull(), // 'sun-beds', 'spray-tan', 'hair-salon', etc.
  balance: integer("balance").default(0).notNull(), // remaining sessions
  totalPurchased: integer("total_purchased").default(0).notNull(),
  expiryDate: timestamp("expiry_date"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Products table for store management (includes both physical products and services)
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameHe: text("name_he").notNull(), // Hebrew name
  description: text("description"),
  descriptionHe: text("description_he"), // Hebrew description
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }), // Optional sale price
  
  // Product Type: 'product' or 'service'
  productType: text("product_type").default("product").notNull(), // 'product' or 'service'
  
  // Categories for both products and services
  // Products: 'tanning', 'cosmetics', 'accessories', 'hair', 'jewelry', 'sunglasses'
  // Services: 'sun-beds', 'spray-tan', 'hair-salon', 'massage', 'facial'
  category: text("category").notNull(),
  
  brand: text("brand"), // 'Thatso', 'BALIBODY', 'AUSTRALIAN GOLD', 'PAS TOUCHER'
  sku: text("sku"), // Product SKU/code
  
  // Tanning product classification
  tanningType: text("tanning_type"), // 'bed-bronzer' (למיטות שיזוף) or 'self-tanning' (שיזוף עצמי ביתי)
  bronzerStrength: integer("bronzer_strength"), // 1-15: Bronzer strength for tanning beds (דרגת חוזק הברונזר)
  
  stock: integer("stock").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(), // Show in featured carousel
  badge: text("badge"), // 'new', 'bestseller', 'sale', 'limited'
  images: text("images").array(), // Array of image URLs
  features: text("features").array(), // Product features/highlights
  weight: decimal("weight", { precision: 10, scale: 2 }), // Product weight in kg
  
  // Service-specific fields
  duration: integer("duration"), // Service duration in minutes
  sessions: integer("sessions"), // Number of sessions in package (null for single session)
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Transactions table for payments
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  type: text("type").notNull(), // 'membership', 'product', 'service'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("ILS").notNull(),
  status: text("status").notNull(), // 'pending', 'completed', 'failed', 'refunded'
  paymentMethod: text("payment_method"), // 'card', 'cash', 'transfer'
  cardcomTransactionId: text("cardcom_transaction_id"),
  metadata: jsonb("metadata"), // Additional transaction data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create Zod schemas for validation
export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  phone: z.string().min(10, "מספר טלפון חייב להכיל לפחות 10 ספרות"),
  fullName: z.string().min(2, "שם מלא חייב להכיל לפחות 2 תווים"),
  email: z.string().email("כתובת אימייל לא תקינה").optional(),
});

export const insertMembershipSchema = createInsertSchema(memberships).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  nameHe: z.string().min(2, "שם המוצר בעברית חייב להכיל לפחות 2 תווים"),
  price: z.string().or(z.number()).transform(val => typeof val === 'string' ? parseFloat(val) : val),
  salePrice: z.string().or(z.number()).transform(val => typeof val === 'string' ? parseFloat(val) : val).optional().nullable(),
  productType: z.enum(['product', 'service']).default('product'),
  category: z.enum([
    // Physical products
    'tanning', 'cosmetics', 'accessories', 'hair', 'jewelry', 'sunglasses',
    // Services
    'sun-beds', 'spray-tan', 'hair-salon', 'massage', 'facial'
  ]),
  brand: z.enum(['Thatso', 'BALIBODY', 'AUSTRALIAN GOLD', 'PAS TOUCHER', 'OTHER']).optional().nullable(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

// Export types
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export type InsertMembership = z.infer<typeof insertMembershipSchema>;
export type Membership = typeof memberships.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Door Access Logs table - Track all door openings
export const doorAccessLogs = pgTable("door_access_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  doorId: text("door_id").notNull(), // '1', '2', 'main', 'back', etc.
  doorName: text("door_name"), // 'Main Entrance', 'Staff Door', etc.
  actionType: text("action_type").default("remote_open").notNull(), // 'remote_open', 'auto_open', 'face_recognition'
  userId: varchar("user_id"), // Optional: who initiated the action
  customerId: varchar("customer_id"), // Optional: if triggered by customer face recognition
  success: boolean("success").default(true).notNull(),
  errorMessage: text("error_message"), // If failed, why?
  ipAddress: text("ip_address"), // IP of who triggered
  userAgent: text("user_agent"), // Browser/device info
  metadata: jsonb("metadata"), // Additional data (BioStar response, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDoorAccessLogSchema = createInsertSchema(doorAccessLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertDoorAccessLog = z.infer<typeof insertDoorAccessLogSchema>;
export type DoorAccessLog = typeof doorAccessLogs.$inferSelect;

// ============================================================
// SOCIAL MEDIA AUTOMATION TABLES
// ============================================================

// Automation Settings - Global rules and thresholds
export const automationSettings = pgTable("automation_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: text("setting_key").notNull().unique(), // 'PAUSE_RULES', 'BUDGET_RULES', etc.
  settingValue: jsonb("setting_value").notNull(), // JSON with all config
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Campaigns - Ad campaigns across platforms
export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(), // 'meta', 'google', 'tiktok'
  platformCampaignId: text("platform_campaign_id").notNull(), // External ID
  name: text("name").notNull(),
  goal: text("goal").notNull(), // 'leads', 'roas', 'awareness'
  dailyBudget: decimal("daily_budget", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(), // 'active', 'paused', 'ended'
  owner: text("owner"), // Team member responsible
  overrides: jsonb("overrides"), // Campaign-specific rules (JSON)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ad Sets - Groups of ads
export const adSets = pgTable("ad_sets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").notNull().references(() => campaigns.id),
  platformAdSetId: text("platform_ad_set_id").notNull(), // External ID
  name: text("name").notNull(),
  targetingData: jsonb("targeting_data"), // Audience targeting (JSON)
  budget: decimal("budget", { precision: 10, scale: 2 }),
  status: text("status").notNull(), // 'active', 'paused'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ads - Individual ad creatives
export const ads = pgTable("ads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adSetId: varchar("ad_set_id").notNull().references(() => adSets.id),
  platformAdId: text("platform_ad_id").notNull(), // External ID
  name: text("name").notNull(),
  creative: jsonb("creative").notNull(), // Text, images, videos (JSON)
  rolling7dKpis: jsonb("rolling_7d_kpis"), // Last 7 days metrics (JSON)
  status: text("status").notNull(), // 'active', 'paused', 'testing'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Content Queue - Organic social media posts
export const contentQueue = pgTable("content_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(), // 'ig_feed', 'ig_reels', 'ig_stories', 'facebook', 'tiktok'
  topic: text("topic").notNull(),
  caption: text("caption").notNull(),
  hashtags: text("hashtags"),
  mediaUrls: text("media_urls").array(), // Array of media URLs
  cta: text("cta"), // Call to action
  publishAt: timestamp("publish_at").notNull(),
  status: text("status").notNull(), // 'draft', 'needs_approval', 'approved', 'scheduled', 'published'
  permalink: text("permalink"), // Published post URL
  metrics: jsonb("metrics"), // Post performance metrics (JSON)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Automation Logs - Track all automated actions
export const automationLogs = pgTable("automation_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  platform: text("platform").notNull(), // 'meta', 'google', 'tiktok', 'system'
  entity: text("entity").notNull(), // 'campaign', 'adset', 'ad', 'content'
  entityId: text("entity_id").notNull(), // ID of affected entity
  action: text("action").notNull(), // 'pause', 'promote', 'budget_change', 'create', etc.
  reason: text("reason").notNull(), // Why this action was taken
  beforeState: jsonb("before_state"), // State before action (JSON)
  afterState: jsonb("after_state"), // State after action (JSON)
  success: boolean("success").notNull(),
  errorMessage: text("error_message"),
});

// Create Zod schemas for automation tables
export const insertAutomationSettingSchema = createInsertSchema(automationSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdSetSchema = createInsertSchema(adSets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdSchema = createInsertSchema(ads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentQueueSchema = createInsertSchema(contentQueue).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAutomationLogSchema = createInsertSchema(automationLogs).omit({
  id: true,
});

// Export automation types
export type InsertAutomationSetting = z.infer<typeof insertAutomationSettingSchema>;
export type AutomationSetting = typeof automationSettings.$inferSelect;

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

export type InsertAdSet = z.infer<typeof insertAdSetSchema>;
export type AdSet = typeof adSets.$inferSelect;

export type InsertAd = z.infer<typeof insertAdSchema>;
export type Ad = typeof ads.$inferSelect;

export type InsertContentQueue = z.infer<typeof insertContentQueueSchema>;
export type ContentQueue = typeof contentQueue.$inferSelect;

export type InsertAutomationLog = z.infer<typeof insertAutomationLogSchema>;
export type AutomationLog = typeof automationLogs.$inferSelect;
