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
  dateOfBirth: text("date_of_birth"), // Date of birth in YYYY-MM-DD format
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

// POS Sales table - for point of sale transactions
export const posSales = pgTable("pos_sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  saleNumber: text("sale_number").notNull().unique(), // Unique sale number (e.g., SALE-2025-001)
  customerId: varchar("customer_id").references(() => customers.id), // Optional - can be null for guest sales
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0").notNull(),
  finalAmount: decimal("final_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(), // 'cash', 'card', 'transfer', 'mixed'
  cashAmount: decimal("cash_amount", { precision: 10, scale: 2 }).default("0"),
  cardAmount: decimal("card_amount", { precision: 10, scale: 2 }).default("0"),
  transferAmount: decimal("transfer_amount", { precision: 10, scale: 2 }).default("0"),
  status: text("status").default("completed").notNull(), // 'completed', 'refunded', 'cancelled'
  notes: text("notes"),
  items: jsonb("items").notNull(), // Array of sale items
  createdBy: varchar("created_by"), // User/staff ID who created the sale
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// POS Sale Items - individual items in a sale
export const posSaleItems = pgTable("pos_sale_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  saleId: varchar("sale_id").notNull().references(() => posSales.id, { onDelete: 'cascade' }),
  productId: varchar("product_id").references(() => products.id),
  productName: text("product_name").notNull(), // Store name for historical records
  productNameHe: text("product_name_he").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Stock Movements - track all stock changes
export const stockMovements = pgTable("stock_movements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  movementType: text("movement_type").notNull(), // 'sale', 'purchase', 'adjustment', 'return', 'damage', 'transfer'
  quantity: integer("quantity").notNull(), // Positive for additions, negative for subtractions
  previousStock: integer("previous_stock").notNull(),
  newStock: integer("new_stock").notNull(),
  referenceId: varchar("reference_id"), // Reference to sale, purchase, etc.
  referenceType: text("reference_type"), // 'sale', 'purchase', 'manual', etc.
  notes: text("notes"),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Daily Summaries - daily POS summaries
export const dailySummaries = pgTable("daily_summaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull().unique(), // Date of the summary (start of day)
  totalSales: integer("total_sales").default(0).notNull(), // Number of sales
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0").notNull(),
  cashRevenue: decimal("cash_revenue", { precision: 10, scale: 2 }).default("0").notNull(),
  cardRevenue: decimal("card_revenue", { precision: 10, scale: 2 }).default("0").notNull(),
  transferRevenue: decimal("transfer_revenue", { precision: 10, scale: 2 }).default("0").notNull(),
  totalDiscounts: decimal("total_discounts", { precision: 10, scale: 2 }).default("0").notNull(),
  totalRefunds: decimal("total_refunds", { precision: 10, scale: 2 }).default("0").notNull(),
  itemsSold: integer("items_sold").default(0).notNull(),
  customerSales: integer("customer_sales").default(0).notNull(), // Sales with customer
  guestSales: integer("guest_sales").default(0).notNull(), // Guest sales
  metadata: jsonb("metadata"), // Additional data (top products, categories, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Create Zod schemas for validation
export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  phone: z.string()
    .min(10, "מספר טלפון חייב להכיל לפחות 10 ספרות")
    .regex(/^(972|05)\d{8,9}$|^\+?972\d{8,9}$|^05\d{1}-?\d{7}$/, "מספר הטלפון חייב להיות תקין עבור WhatsApp (פורמט: 972XXXXXXXXX או 05X-XXXXXXX)"),
  fullName: z.string().min(2, "שם מלא חייב להכיל לפחות 2 תווים"),
  email: z.string().email("כתובת אימייל לא תקינה").optional().nullable(),
  dateOfBirth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "תאריך לידה חייב להיות בפורמט YYYY-MM-DD")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred this year yet
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age >= 16 && age <= 120;
    }, "גיל חייב להיות בין 16 ל-120")
    .optional().nullable(),
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

// Face Upload Tokens - For WhatsApp-based face registration
export const faceUploadTokens = pgTable("face_upload_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  token: text("token").notNull().unique(), // Unique token for URL
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  imageUrl: text("image_url"), // URL of uploaded image
  status: text("status").default("pending").notNull(), // 'pending', 'uploaded', 'expired', 'used'
  expiresAt: timestamp("expires_at").notNull(), // Token expiration time (30 minutes)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFaceUploadTokenSchema = createInsertSchema(faceUploadTokens).omit({
  id: true,
  createdAt: true,
});

export type InsertFaceUploadToken = z.infer<typeof insertFaceUploadTokenSchema>;
export type FaceUploadToken = typeof faceUploadTokens.$inferSelect;

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

// ============================================================
// HEALTH FORMS & SESSION USAGE TABLES
// ============================================================

// Health Forms - Digital health questionnaire responses
export const healthForms = pgTable("health_forms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  
  // Medical Questions
  hasAllergies: boolean("has_allergies").default(false).notNull(),
  allergiesDetails: text("allergies_details"),
  hasSkinConditions: boolean("has_skin_conditions").default(false).notNull(),
  skinConditionsDetails: text("skin_conditions_details"),
  takesMedications: boolean("takes_medications").default(false).notNull(),
  medicationsDetails: text("medications_details"),
  hasPregnancy: boolean("has_pregnancy").default(false).notNull(),
  
  // Tanning-specific questions
  skinType: text("skin_type").notNull(), // '1-very-fair', '2-fair', '3-medium', '4-olive', '5-dark', '6-very-dark'
  previousTanningExperience: boolean("previous_tanning_experience").default(false).notNull(),
  
  // Signature & Consent
  hasConsent: boolean("has_consent").default(true).notNull(),
  signatureData: text("signature_data"), // Base64 signature image
  ipAddress: text("ip_address"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Session Usage - Track customer service usage
export const sessionUsage = pgTable("session_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  membershipId: varchar("membership_id").notNull().references(() => memberships.id),
  
  serviceType: text("service_type").notNull(), // 'sun-beds', 'spray-tan', 'hair-salon', etc.
  sessionsUsed: integer("sessions_used").default(1).notNull(), // Number of sessions deducted
  
  // Access details
  entryMethod: text("entry_method").notNull(), // 'face_recognition', 'manual', 'staff'
  doorId: text("door_id"), // Which door was used
  faceMatchConfidence: decimal("face_match_confidence", { precision: 5, scale: 2 }), // Face recognition confidence %
  
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create Zod schemas
export const insertHealthFormSchema = createInsertSchema(healthForms).omit({
  id: true,
  createdAt: true,
}).extend({
  customerId: z.string().uuid(),
  skinType: z.enum(['1-very-fair', '2-fair', '3-medium', '4-olive', '5-dark', '6-very-dark']),
});

export const insertSessionUsageSchema = createInsertSchema(sessionUsage).omit({
  id: true,
  createdAt: true,
}).extend({
  customerId: z.string().uuid(),
  membershipId: z.string().uuid(),
  serviceType: z.string().min(1),
  entryMethod: z.enum(['face_recognition', 'manual', 'staff', 'card_marking']),
});

// Export types
export type InsertHealthForm = z.infer<typeof insertHealthFormSchema>;
export type HealthForm = typeof healthForms.$inferSelect;

export type InsertSessionUsage = z.infer<typeof insertSessionUsageSchema>;
export type SessionUsage = typeof sessionUsage.$inferSelect;

// POS Schemas
export const insertPosSaleSchema = createInsertSchema(posSales).omit({
  id: true,
  saleNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPosSaleItemSchema = createInsertSchema(posSaleItems).omit({
  id: true,
  createdAt: true,
});

export const insertStockMovementSchema = createInsertSchema(stockMovements).omit({
  id: true,
  createdAt: true,
});

export type InsertPosSale = z.infer<typeof insertPosSaleSchema>;
export type PosSale = typeof posSales.$inferSelect;
export type InsertPosSaleItem = z.infer<typeof insertPosSaleItemSchema>;
export type PosSaleItem = typeof posSaleItems.$inferSelect;
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;
export type StockMovement = typeof stockMovements.$inferSelect;
export type DailySummary = typeof dailySummaries.$inferSelect;
