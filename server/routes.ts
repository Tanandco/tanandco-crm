import express from 'express';
import crypto from 'crypto';
import { bioStarClient } from './services/biostar-client';
import { bioStarStartup } from './services/biostar-startup';
import { storage } from './storage';
import { insertCustomerSchema, insertMembershipSchema } from '@shared/schema';
import { z } from 'zod';
import { whatsappService } from './services/whatsapp-service';
import { cardcomService } from './services/cardcom-service';
import { WorkflowService } from './services/workflow-service';

// Validation schemas
const identifyFaceSchema = z.object({
  image: z.string().min(1, 'Image data required'),
  antiSpoofing: z.boolean().optional().default(true),
  liveDetection: z.boolean().optional().default(true)
});

const registerFaceSchema = z.object({
  userId: z.string().min(1, 'User ID required'),
  image: z.string().min(1, 'Image data required')
});

const createUserSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  accessLevel: z.number().min(0).max(255).default(1)
});

export function registerRoutes(app: express.Application) {
  // System status endpoint
  app.get('/api/biostar/status', async (req, res) => {
    try {
      const status = await bioStarStartup.getStatus();
      
      res.json({
        success: true,
        data: status
      });
    } catch (error: any) {
      console.error('BioStar status check failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get BioStar status',
        details: error.message
      });
    }
  });

  // Authenticate with BioStar (RESTRICTED - Admin only)
  app.post('/api/biostar/auth', async (req, res) => {
    // Security: Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: 'Authentication endpoint disabled in production'
      });
    }
    
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username and password are required'
        });
      }
      
      const authenticated = await bioStarClient.authenticate(username, password);
      
      if (authenticated) {
        res.json({
          success: true,
          data: {
            authenticated: true,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        res.status(401).json({
          success: false,
          error: 'Authentication failed'
        });
      }
    } catch (error: any) {
      console.error('BioStar authentication failed:', error);
      res.status(500).json({
        success: false,
        error: 'Authentication error',
        details: error.message
      });
    }
  });

  // Face identification endpoint
  app.post('/api/biostar/identify', async (req, res) => {
    try {
      const validatedData = identifyFaceSchema.parse(req.body);
      
      // Ensure BioStar is ready
      const isReady = await bioStarStartup.ensureReady();
      if (!isReady) {
        return res.status(503).json({
          success: false,
          error: 'BioStar system not available. Please use manual entry or contact staff.'
        });
      }
      
      const result = await bioStarClient.identifyFace(validatedData.image);
      
      if (result) {
        res.json({
          success: true,
          data: result
        });
      } else {
        res.json({
          success: false,
          error: 'Face not recognized or confidence too low'
        });
      }
    } catch (error: any) {
      console.error('Face identification failed:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Face identification error',
        details: error.message
      });
    }
  });

  // Face registration endpoint
  app.post('/api/biostar/register', async (req, res) => {
    try {
      const validatedData = registerFaceSchema.parse(req.body);
      
      // Check if authenticated
      const isAuth = await bioStarClient.isAuthenticated();
      if (!isAuth) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated with BioStar'
        });
      }
      
      const result = await bioStarClient.registerFace(validatedData.userId, validatedData.image);
      
      if (result) {
        res.json({
          success: true,
          data: result
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Face registration failed'
        });
      }
    } catch (error: any) {
      console.error('Face registration failed:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Face registration error',
        details: error.message
      });
    }
  });

  // User management endpoints
  app.get('/api/biostar/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const isAuth = await bioStarClient.isAuthenticated();
      if (!isAuth) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated with BioStar'
        });
      }
      
      const user = await bioStarClient.getUser(id);
      
      if (user) {
        res.json({
          success: true,
          data: user
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
    } catch (error: any) {
      console.error('Get user failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user',
        details: error.message
      });
    }
  });

  app.post('/api/biostar/users', async (req, res) => {
    try {
      const validatedData = createUserSchema.parse(req.body);
      
      const isAuth = await bioStarClient.isAuthenticated();
      if (!isAuth) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated with BioStar'
        });
      }
      
      const user = await bioStarClient.createUser(validatedData);
      
      if (user) {
        res.status(201).json({
          success: true,
          data: user
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Failed to create user'
        });
      }
    } catch (error: any) {
      console.error('Create user failed:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to create user',
        details: error.message
      });
    }
  });

  // Access logs endpoint
  app.get('/api/biostar/logs', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      
      const isAuth = await bioStarClient.isAuthenticated();
      if (!isAuth) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated with BioStar'
        });
      }
      
      const logs = await bioStarClient.getAccessLogs(limit);
      
      res.json({
        success: true,
        data: logs
      });
    } catch (error: any) {
      console.error('Get access logs failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get access logs',
        details: error.message
      });
    }
  });

  // CRM Customer Management Endpoints

  // Get all customers
  app.get('/api/customers', async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json({
        success: true,
        data: customers
      });
    } catch (error: any) {
      console.error('Get customers failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get customers',
        details: error.message
      });
    }
  });

  // Get customer by ID
  app.get('/api/customers/:id', async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }
      res.json({
        success: true,
        data: customer
      });
    } catch (error: any) {
      console.error('Get customer failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get customer',
        details: error.message
      });
    }
  });

  // Search customers
  app.get('/api/customers/search/:query', async (req, res) => {
    try {
      const customers = await storage.searchCustomers(req.params.query);
      res.json({
        success: true,
        data: customers
      });
    } catch (error: any) {
      console.error('Search customers failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search customers',
        details: error.message
      });
    }
  });

  // Create new customer
  app.post('/api/customers', async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      
      // Check if customer with this phone already exists
      const existingCustomer = await storage.getCustomerByPhone(validatedData.phone);
      if (existingCustomer) {
        return res.status(409).json({
          success: false,
          error: 'לקוח עם מספר טלפון זה כבר קיים במערכת'
        });
      }
      
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json({
        success: true,
        data: customer
      });
    } catch (error: any) {
      console.error('Create customer failed:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid customer data',
          details: error.errors
        });
      }
      res.status(500).json({
        success: false,
        error: 'Failed to create customer',
        details: error.message
      });
    }
  });

  // Update customer
  app.put('/api/customers/:id', async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(req.params.id, validatedData);
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }
      
      res.json({
        success: true,
        data: customer
      });
    } catch (error: any) {
      console.error('Update customer failed:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid customer data',
          details: error.errors
        });
      }
      res.status(500).json({
        success: false,
        error: 'Failed to update customer',
        details: error.message
      });
    }
  });

  // Delete customer
  app.delete('/api/customers/:id', async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }
      
      await storage.deleteCustomer(req.params.id);
      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete customer failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete customer',
        details: error.message
      });
    }
  });

  // Get customer memberships
  app.get('/api/customers/:id/memberships', async (req, res) => {
    try {
      const memberships = await storage.getMembershipsByCustomer(req.params.id);
      res.json({
        success: true,
        data: memberships
      });
    } catch (error: any) {
      console.error('Get customer memberships failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get customer memberships',
        details: error.message
      });
    }
  });

  // Create membership for customer
  app.post('/api/customers/:id/memberships', async (req, res) => {
    try {
      const membershipData = { ...req.body, customerId: req.params.id };
      const validatedData = insertMembershipSchema.parse(membershipData);
      
      const membership = await storage.createMembership(validatedData);
      res.status(201).json({
        success: true,
        data: membership
      });
    } catch (error: any) {
      console.error('Create membership failed:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid membership data',
          details: error.errors
        });
      }
      res.status(500).json({
        success: false,
        error: 'Failed to create membership',
        details: error.message
      });
    }
  });

  // Integrate with BioStar face recognition for customer identification
  app.post('/api/customers/identify-by-face', async (req, res) => {
    try {
      const { image } = identifyFaceSchema.parse(req.body);
      
      // Check if BioStar is ready
      if (!bioStarStartup.ensureReady()) {
        return res.status(503).json({
          success: false,
          error: 'BioStar system not available',
          message: 'Please try again later or use manual entry'
        });
      }
      
      // Identify face using BioStar
      const faceResult = await bioStarClient.identifyFace(image);
      
      if (faceResult && faceResult.userId) {
        // Find customer by face recognition ID
        const customer = await storage.getCustomerByFaceId(faceResult.userId);
        
        if (customer) {
          // Get customer memberships as well
          const memberships = await storage.getMembershipsByCustomer(customer.id);
          
          res.json({
            success: true,
            data: {
              customer,
              memberships,
              confidence: faceResult.confidence || 0
            }
          });
        } else {
          res.status(404).json({
            success: false,
            error: 'Customer not found in CRM system',
            biostarUserId: faceResult.userId
          });
        }
      } else {
        res.status(404).json({
          success: false,
          error: 'Face not recognized',
          message: 'Please try again or use manual entry'
        });
      }
    } catch (error: any) {
      console.error('Face identification failed:', error);
      res.status(500).json({
        success: false,
        error: 'Face identification failed',
        details: error.message
      });
    }
  });

  // Identify customer by face and return customer data
  app.post('/api/customers/identify-by-face', async (req, res) => {
    try {
      // For testing purposes, simulate successful identification
      // In production, this would call biostarClient.identify()
      const mockFaceId = 'test-face-id-123';
      
      // Find customer by face recognition ID
      const customer = await storage.getCustomerByFaceId(mockFaceId);
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found for this face ID',
          faceId: mockFaceId
        });
      }

      res.json({
        success: true,
        data: customer,
        faceId: mockFaceId
      });
    } catch (error: any) {
      console.error('Face identification failed:', error);
      res.status(500).json({
        success: false,
        error: 'Face identification failed',
        details: error.message
      });
    }
  });

  // Associate face ID with existing customer
  app.post('/api/customers/:id/associate-face', async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      // For testing purposes, simulate successful face registration
      const mockFaceId = `face-${req.params.id}-${Date.now()}`;

      // Update customer with face recognition ID
      const updatedCustomer = await storage.updateCustomer(req.params.id, {
        faceRecognitionId: mockFaceId
      });

      res.json({
        success: true,
        data: updatedCustomer,
        faceId: mockFaceId
      });
    } catch (error: any) {
      console.error('Face association failed:', error);
      res.status(500).json({
        success: false,
        error: 'Face association failed',
        details: error.message
      });
    }
  });

  // Explicit DELETE endpoint for customers
  app.delete('/api/customers/:id', async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }
      
      await storage.deleteCustomer(req.params.id);
      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete customer failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete customer',
        details: error.message
      });
    }
  });

  // ============================================================
  // WhatsApp Business Integration Endpoints
  // ============================================================

  // Initialize workflow service
  const workflowService = new WorkflowService(storage);

  // WhatsApp webhook verification (GET)
  app.get('/api/webhooks/whatsapp', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    const verifyToken = process.env.WEBHOOK_VERIFICATION_TOKEN;
    
    if (!verifyToken) {
      console.error('[WhatsApp Webhook] WEBHOOK_VERIFICATION_TOKEN not configured');
      return res.sendStatus(403);
    }
    
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('[WhatsApp Webhook] Verified');
      res.status(200).send(challenge);
    } else {
      console.warn('[WhatsApp Webhook] Verification failed');
      res.sendStatus(403);
    }
  });

  // WhatsApp webhook for incoming messages (POST)
  app.post('/api/webhooks/whatsapp', async (req, res) => {
    try {
      // Verify webhook signature
      const signature = req.headers['x-hub-signature-256'] as string;
      const appSecret = process.env.WA_APP_SECRET;
      
      if (!appSecret) {
        console.error('[WhatsApp Webhook] WA_APP_SECRET not configured');
        return res.sendStatus(500);
      }
      
      if (signature) {
        const crypto = await import('crypto');
        const expectedSignature = 'sha256=' + crypto
          .createHmac('sha256', appSecret)
          .update(JSON.stringify(req.body))
          .digest('hex');
        
        if (signature !== expectedSignature) {
          console.error('[WhatsApp Webhook] Invalid signature');
          return res.sendStatus(403);
        }
      } else {
        console.warn('[WhatsApp Webhook] No signature provided');
        return res.sendStatus(403);
      }
      
      const body = req.body;
      
      // Acknowledge receipt immediately
      res.sendStatus(200);
      
      // Process webhook asynchronously
      if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
        const message = body.entry[0].changes[0].value.messages[0];
        const from = message.from;
        const text = message.text?.body || '';
        
        console.log(`[WhatsApp] Message from ${from}: ${text}`);
        
        // Handle inbound message
        await workflowService.handleInboundWhatsAppMessage(from, text);
      }
    } catch (error: any) {
      console.error('[WhatsApp Webhook] Error:', error);
    }
  });

  // Send WhatsApp text message
  app.post('/api/whatsapp/send-text', async (req, res) => {
    try {
      const { to, message } = req.body;
      
      if (!to || !message) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: to, message'
        });
      }
      
      const sent = await whatsappService.sendTextMessage(to, message);
      
      res.json({
        success: sent,
        message: sent ? 'Message sent successfully' : 'Failed to send message'
      });
    } catch (error: any) {
      console.error('[WhatsApp] Send text failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send message',
        details: error.message
      });
    }
  });

  // ============================================================
  // Cardcom Payment Integration Endpoints
  // ============================================================

  // Create payment session
  app.post('/api/payments/cardcom/session', async (req, res) => {
    try {
      const { customerId, packageId } = req.body;
      
      if (!customerId || !packageId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: customerId, packageId'
        });
      }
      
      const customer = await storage.getCustomer(customerId);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }
      
      const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
      const protocol = baseUrl.includes('localhost') ? 'http' : 'https';
      
      const session = await cardcomService.createPaymentSession({
        customerId,
        customerName: customer.fullName,
        customerPhone: customer.phone,
        customerEmail: customer.email || undefined,
        packageId,
        successUrl: `${protocol}://${baseUrl}/payment/success?customerId=${customerId}&packageId=${packageId}`,
        errorUrl: `${protocol}://${baseUrl}/payment/error?customerId=${customerId}`,
        indicatorUrl: `${protocol}://${baseUrl}/api/webhooks/cardcom/payment`,
      });
      
      if (!session) {
        return res.status(500).json({
          success: false,
          error: 'Failed to create payment session'
        });
      }
      
      res.json({
        success: true,
        data: session
      });
    } catch (error: any) {
      console.error('[Cardcom] Create session failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create payment session',
        details: error.message
      });
    }
  });

  // Cardcom payment webhook
  app.post('/api/webhooks/cardcom/payment', async (req, res) => {
    try {
      // Acknowledge receipt immediately
      res.sendStatus(200);
      
      // Parse webhook data
      const webhookData = cardcomService.parseWebhookData(req.body);
      
      if (!webhookData) {
        console.error('[Cardcom] Invalid webhook data');
        return;
      }
      
      console.log('[Cardcom] Webhook received:', webhookData);
      
      // Check for idempotency - prevent duplicate processing
      const existingTransactions = await storage.getTransactionsByCustomer(webhookData.customerId);
      const alreadyProcessed = existingTransactions.some(
        (t) => t.cardcomTransactionId === webhookData.cardcomTransactionId
      );
      
      if (alreadyProcessed) {
        console.warn('[Cardcom] Transaction already processed:', webhookData.cardcomTransactionId);
        return;
      }
      
      if (webhookData.status === 'success') {
        // Handle successful payment
        await workflowService.handlePaymentSuccess(
          webhookData.customerId,
          webhookData.packageId,
          webhookData.cardcomTransactionId,
          webhookData.amount
        );
      }
    } catch (error: any) {
      console.error('[Cardcom Webhook] Error:', error);
    }
  });

  // ============================================================
  // Onboarding Endpoints
  // ============================================================

  // Health form completion webhook
  app.post('/api/webhooks/jotform/health-form', async (req, res) => {
    try {
      // Acknowledge receipt
      res.sendStatus(200);
      
      const { customerId } = req.body;
      
      if (customerId) {
        await workflowService.handleHealthFormComplete(customerId);
      }
    } catch (error: any) {
      console.error('[Health Form Webhook] Error:', error);
    }
  });

  // Get face registration link
  app.get('/api/onboarding/face-link', async (req, res) => {
    try {
      const { customerId } = req.query;
      
      if (!customerId) {
        return res.status(400).json({
          success: false,
          error: 'Missing customerId parameter'
        });
      }
      
      const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
      const protocol = baseUrl.includes('localhost') ? 'http' : 'https';
      const url = `${protocol}://${baseUrl}/face-registration/${customerId}`;
      
      res.json({
        success: true,
        url
      });
    } catch (error: any) {
      console.error('[Face Link] Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate face registration link',
        details: error.message
      });
    }
  });

  // Register face for customer
  app.post('/api/onboarding/face-register', async (req, res) => {
    try {
      const { customerId, image } = req.body;
      
      if (!customerId || !image) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: customerId, image'
        });
      }
      
      const customer = await storage.getCustomer(customerId);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }
      
      // Register face with BioStar
      const faceResult = await bioStarClient.registerFace(customerId, image);
      
      if (!faceResult) {
        return res.status(500).json({
          success: false,
          error: 'Failed to register face'
        });
      }
      
      // Update workflow
      await workflowService.handleFaceRegistrationComplete(
        customerId,
        faceResult.id || customerId
      );
      
      res.json({
        success: true,
        data: faceResult
      });
    } catch (error: any) {
      console.error('[Face Register] Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to register face',
        details: error.message
      });
    }
  });

  // Get packages catalog
  app.get('/api/packages', async (req, res) => {
    try {
      const { getAllPackages } = await import('./config/packages');
      const packages = getAllPackages();
      
      res.json({
        success: true,
        data: packages
      });
    } catch (error: any) {
      console.error('[Packages] Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get packages',
        details: error.message
      });
    }
  });

  // ==================== AUTOMATION ROUTES ====================

  // Campaigns
  app.get('/api/automation/campaigns', async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json({ success: true, data: campaigns });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/automation/campaigns/:id', async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ success: false, error: 'Campaign not found' });
      }
      res.json({ success: true, data: campaign });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/automation/campaigns', async (req, res) => {
    try {
      const campaign = await storage.createCampaign(req.body);
      res.json({ success: true, data: campaign });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.put('/api/automation/campaigns/:id', async (req, res) => {
    try {
      const campaign = await storage.updateCampaign(req.params.id, req.body);
      if (!campaign) {
        return res.status(404).json({ success: false, error: 'Campaign not found' });
      }
      res.json({ success: true, data: campaign });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.delete('/api/automation/campaigns/:id', async (req, res) => {
    try {
      await storage.deleteCampaign(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // AdSets
  app.get('/api/automation/adsets', async (req, res) => {
    try {
      const { campaignId } = req.query;
      const adSets = campaignId 
        ? await storage.getAdSetsByCampaign(campaignId as string)
        : await storage.getAdSets();
      res.json({ success: true, data: adSets });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/automation/adsets', async (req, res) => {
    try {
      const adSet = await storage.createAdSet(req.body);
      res.json({ success: true, data: adSet });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.put('/api/automation/adsets/:id', async (req, res) => {
    try {
      const adSet = await storage.updateAdSet(req.params.id, req.body);
      if (!adSet) {
        return res.status(404).json({ success: false, error: 'AdSet not found' });
      }
      res.json({ success: true, data: adSet });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Ads
  app.get('/api/automation/ads', async (req, res) => {
    try {
      const { adSetId } = req.query;
      const ads = adSetId 
        ? await storage.getAdsByAdSet(adSetId as string)
        : await storage.getAds();
      res.json({ success: true, data: ads });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/automation/ads', async (req, res) => {
    try {
      const ad = await storage.createAd(req.body);
      res.json({ success: true, data: ad });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.put('/api/automation/ads/:id', async (req, res) => {
    try {
      const ad = await storage.updateAd(req.params.id, req.body);
      if (!ad) {
        return res.status(404).json({ success: false, error: 'Ad not found' });
      }
      res.json({ success: true, data: ad });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Settings
  app.get('/api/automation/settings', async (req, res) => {
    try {
      const settings = await storage.getAutomationSettings();
      res.json({ success: true, data: settings });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/automation/settings/:key', async (req, res) => {
    try {
      const setting = await storage.getAutomationSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ success: false, error: 'Setting not found' });
      }
      res.json({ success: true, data: setting });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/automation/settings', async (req, res) => {
    try {
      const setting = await storage.createAutomationSetting(req.body);
      res.json({ success: true, data: setting });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.put('/api/automation/settings/:key', async (req, res) => {
    try {
      const setting = await storage.updateAutomationSetting(req.params.key, req.body);
      if (!setting) {
        return res.status(404).json({ success: false, error: 'Setting not found' });
      }
      res.json({ success: true, data: setting });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Logs
  app.get('/api/automation/logs', async (req, res) => {
    try {
      const { platform, limit } = req.query;
      const logs = platform 
        ? await storage.getAutomationLogsByPlatform(platform as string, limit ? parseInt(limit as string) : undefined)
        : await storage.getAutomationLogs(limit ? parseInt(limit as string) : undefined);
      res.json({ success: true, data: logs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Content Queue
  app.get('/api/automation/content-queue', async (req, res) => {
    try {
      const { status, platform } = req.query;
      let queue;
      if (status) {
        queue = await storage.getContentQueueByStatus(status as string);
      } else if (platform) {
        queue = await storage.getContentQueueByPlatform(platform as string);
      } else {
        queue = await storage.getContentQueue();
      }
      res.json({ success: true, data: queue });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/automation/content-queue', async (req, res) => {
    try {
      const item = await storage.createContentQueueItem(req.body);
      res.json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.put('/api/automation/content-queue/:id', async (req, res) => {
    try {
      const item = await storage.updateContentQueueItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ success: false, error: 'Content item not found' });
      }
      res.json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============================================================
  // PRODUCT MANAGEMENT API ROUTES
  // ============================================================

  // Get all products (with optional filtering)
  app.get('/api/products', async (req, res) => {
    try {
      const { category, brand, featured, isFeatured, tanningType } = req.query;
      let products;
      
      if (category || brand || featured || isFeatured || tanningType) {
        // Get all products and filter
        const allProducts = await storage.getProducts();
        products = allProducts.filter((p: any) => {
          if (category && p.category !== category) return false;
          if (brand && p.brand !== brand) return false;
          if (tanningType && p.tanningType !== tanningType && p.tanning_type !== tanningType) return false;
          if (featured === 'true' && !p.is_featured && !p.isFeatured) return false;
          if (isFeatured === 'true' && !p.is_featured && !p.isFeatured) return false;
          if (isFeatured === 'false' && (p.is_featured || p.isFeatured)) return false;
          return true;
        });
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get single product by ID
  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create new product
  app.post('/api/products', async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // Update product
  app.patch('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // Delete product
  app.delete('/api/products/:id', async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}