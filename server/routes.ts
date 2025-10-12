import express from 'express';
import crypto from 'crypto';
import { nanoid } from 'nanoid';
import { bioStarClient } from './services/biostar-client';
import { bioStarStartup } from './services/biostar-startup';
import { requireLocalAccess, rateLimit } from './middleware/auth';
import { storage } from './storage';
import { db } from './db';
import { customers, insertCustomerSchema, insertMembershipSchema, faceUploadTokens, memberships } from '@shared/schema';
import { z } from 'zod';
import { whatsappService } from './services/whatsapp-service';
import { cardcomService } from './services/cardcom-service';
import { WorkflowService } from './services/workflow-service';
import { eq, sql } from 'drizzle-orm';
import multer from 'multer';
import XLSX from 'xlsx';

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

  // Face identification endpoint with customer data
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
      
      if (result && result.userId) {
        // Get customer data
        const customer = await storage.getCustomer(result.userId);
        
        if (customer) {
          // Get customer memberships
          const memberships = await storage.getMembershipsByCustomer(customer.id);
          const activeMemberships = memberships.filter(m => m.isActive && m.balance > 0);
          
          // Check if customer has active membership with balance
          if (activeMemberships.length === 0) {
            return res.status(403).json({
              success: false,
              error: 'אין חבילה פעילה או שהיתרה אפסה',
              data: {
                customer: {
                  id: customer.id,
                  fullName: customer.fullName,
                  phone: customer.phone,
                },
                memberships: memberships.map(m => ({
                  id: m.id,
                  type: m.type,
                  balance: m.balance,
                  isActive: m.isActive,
                })),
              }
            });
          }
          
          // AUTOMATIC DOOR OPENING AFTER SUCCESSFUL RECOGNITION
          let doorOpened = false;
          let doorError: string | undefined;
          let sessionDeducted = false;
          let deductionInfo: { membershipId?: string; previousBalance?: number; newBalance?: number } = {};
          
          try {
            console.log(`[Face Recognition] Customer ${customer.fullName} identified, opening door...`);
            const doorResult = await bioStarClient.openDoor('1'); // Main entrance
            doorOpened = doorResult;
            
            if (doorResult) {
              console.log(`[Face Recognition] Door opened successfully for ${customer.fullName}`);
              
              // DEDUCT SESSION FROM ACTIVE MEMBERSHIP
              // Use the first active membership (priority: sun-beds type)
              const primaryMembership = activeMemberships.find(m => m.type === 'sun-beds') || activeMemberships[0];
              
              if (primaryMembership) {
                const deductionResult = await storage.deductSession(primaryMembership.id);
                
                if (deductionResult.success) {
                  sessionDeducted = true;
                  deductionInfo = {
                    membershipId: primaryMembership.id,
                    previousBalance: primaryMembership.balance,
                    newBalance: deductionResult.newBalance,
                  };
                  console.log(`[Session Deduction] Deducted 1 session from ${customer.fullName}. New balance: ${deductionResult.newBalance}`);
                  
                  // SEND WHATSAPP MESSAGE WITH SESSION BALANCE
                  if (customer.phone) {
                    try {
                      await whatsappService.sendSessionBalanceUpdate(
                        customer.phone,
                        customer.fullName,
                        deductionResult.newBalance,
                        primaryMembership.type
                      );
                      console.log(`[WhatsApp] Session balance update sent to ${customer.fullName}`);
                    } catch (waError) {
                      console.error(`[WhatsApp] Failed to send balance update:`, waError);
                      // Don't fail the whole request if WhatsApp fails
                    }
                  }
                } else {
                  console.error(`[Session Deduction] Failed to deduct session for ${customer.fullName}`);
                }
              }
            } else {
              console.error(`[Face Recognition] Failed to open door for ${customer.fullName}`);
              doorError = 'Door control returned false';
            }
            
            // Log the door access
            await storage.createDoorAccessLog({
              doorId: '1',
              doorName: 'Main Entrance',
              customerId: customer.id,
              actionType: 'face_recognition',
              success: doorResult,
              errorMessage: doorError,
              ipAddress: req.ip,
              userAgent: req.get('user-agent'),
              metadata: {
                recognitionConfidence: result.confidence,
                userId: result.userId
              }
            });
          } catch (doorOpenError: any) {
            console.error('[Face Recognition] Door opening error:', doorOpenError);
            doorError = doorOpenError.message;
            
            // Log failed door attempt
            await storage.createDoorAccessLog({
              doorId: '1',
              doorName: 'Main Entrance',
              customerId: customer.id,
              actionType: 'face_recognition',
              success: false,
              errorMessage: doorError,
              ipAddress: req.ip,
              userAgent: req.get('user-agent'),
              metadata: {
                recognitionConfidence: result.confidence,
                userId: result.userId,
                error: doorOpenError.stack
              }
            });
          }
          
          // Refresh memberships after potential deduction
          const updatedMemberships = await storage.getMembershipsByCustomer(customer.id);
          const updatedActiveMemberships = updatedMemberships.filter(m => m.isActive && m.balance > 0);
          
          res.json({
            success: true,
            data: {
              ...result,
              customer: {
                id: customer.id,
                fullName: customer.fullName,
                phone: customer.phone,
                email: customer.email,
                isNewClient: customer.isNewClient,
              },
              memberships: updatedActiveMemberships.map(m => ({
                id: m.id,
                type: m.type,
                balance: m.balance,
                expiryDate: m.expiryDate,
              })),
              doorOpened,
              doorError,
              sessionDeducted,
              deductionInfo: sessionDeducted ? deductionInfo : undefined,
            }
          });
        } else {
          // Face recognized but customer not found in DB
          res.json({
            success: true,
            data: {
              ...result,
              warning: 'Face recognized but customer record not found'
            }
          });
        }
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

  // Door control endpoint (Protected: local access + rate limited)
  // SECURITY: Server MUST run on localhost (127.0.0.1) only, NOT on 0.0.0.0
  app.post('/api/biostar/open-door', requireLocalAccess, rateLimit, async (req, res) => {
    const startTime = Date.now();
    let success = false;
    let errorMessage: string | undefined;
    
    try {
      const { doorId = '1' } = req.body;
      
      // Check if BioStar is ready
      const isReady = await bioStarStartup.ensureReady();
      if (!isReady) {
        errorMessage = 'BioStar system not available';
        
        // Log failed attempt
        await storage.createDoorAccessLog({
          doorId,
          doorName: doorId === '1' ? 'Main Entrance' : `Door ${doorId}`,
          actionType: 'remote_open',
          success: false,
          errorMessage,
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        });
        
        return res.status(503).json({
          success: false,
          error: 'BioStar system not available. Cannot open door remotely.'
        });
      }
      
      const result = await bioStarClient.openDoor(doorId);
      success = result;
      
      // Log the door access
      await storage.createDoorAccessLog({
        doorId,
        doorName: doorId === '1' ? 'Main Entrance' : `Door ${doorId}`,
        actionType: 'remote_open',
        success: result,
        errorMessage: result ? undefined : 'BioStar returned false',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        metadata: {
          responseTime: Date.now() - startTime
        }
      });
      
      if (result) {
        res.json({
          success: true,
          message: 'Door opened successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Failed to open door'
        });
      }
    } catch (error: any) {
      console.error('Open door failed:', error);
      errorMessage = error.message;
      
      // Log failed attempt
      const { doorId = '1' } = req.body;
      await storage.createDoorAccessLog({
        doorId,
        doorName: doorId === '1' ? 'Main Entrance' : `Door ${doorId}`,
        actionType: 'remote_open',
        success: false,
        errorMessage,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        metadata: {
          responseTime: Date.now() - startTime,
          error: error.stack
        }
      });
      
      res.status(500).json({
        success: false,
        error: 'Door control error',
        details: error.message
      });
    }
  });

  // Door access logs endpoint (Protected: local access)
  // SECURITY: Server MUST run on localhost (127.0.0.1) only, NOT on 0.0.0.0
  app.get('/api/biostar/door-logs', requireLocalAccess, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const doorId = req.query.doorId as string | undefined;
      
      let logs;
      if (doorId) {
        logs = await storage.getDoorAccessLogsByDoor(doorId, limit);
      } else {
        logs = await storage.getDoorAccessLogs(limit);
      }
      
      res.json({
        success: true,
        data: logs
      });
    } catch (error: any) {
      console.error('Get door logs failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get door logs',
        details: error.message
      });
    }
  });

  // ============================================================
  // FACE UPLOAD VIA WHATSAPP ENDPOINTS
  // ============================================================

  // Send WhatsApp link for face upload
  app.post('/api/face-upload/send-link', async (req, res) => {
    try {
      const { customerId } = req.body;
      
      if (!customerId) {
        return res.status(400).json({
          success: false,
          error: 'Customer ID is required'
        });
      }

      // Get customer details
      const customer = await storage.getCustomer(customerId);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      // Generate unique token (10 characters)
      const token = nanoid(10);
      
      // Token expires in 30 minutes
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      // Create token in database
      await storage.createFaceUploadToken({
        token,
        customerId,
        status: 'pending',
        expiresAt
      });

      // Generate upload link
      const uploadUrl = `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/upload-face/${token}`;

      // Send WhatsApp message
      const message = `שלום ${customer.fullName}! 👋\n\nלהשלמת הרישום במכון, אנא העלה תמונה ברורה שלך דרך הקישור:\n\n${uploadUrl}\n\nהקישור תקף ל-30 דקות.`;
      
      await whatsappService.sendTextMessage(customer.phone, message);

      res.json({
        success: true,
        data: {
          token,
          uploadUrl,
          expiresAt
        }
      });
    } catch (error: any) {
      console.error('Send face upload link failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send upload link',
        details: error.message
      });
    }
  });

  // Check token status (for polling)
  app.get('/api/face-upload/check/:token', async (req, res) => {
    try {
      const { token } = req.params;
      
      const tokenData = await storage.getFaceUploadToken(token);
      
      if (!tokenData) {
        return res.status(404).json({
          success: false,
          error: 'Token not found'
        });
      }

      // Check if expired
      if (new Date() > new Date(tokenData.expiresAt)) {
        return res.json({
          success: true,
          data: {
            status: 'expired',
            imageUrl: null
          }
        });
      }

      res.json({
        success: true,
        data: {
          status: tokenData.status,
          imageUrl: tokenData.imageUrl
        }
      });
    } catch (error: any) {
      console.error('Check token status failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check token status',
        details: error.message
      });
    }
  });

  // Receive image upload from customer's phone
  app.post('/api/face-upload/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const { image } = req.body;
      
      if (!image) {
        return res.status(400).json({
          success: false,
          error: 'Image data is required'
        });
      }

      const tokenData = await storage.getFaceUploadToken(token);
      
      if (!tokenData) {
        return res.status(404).json({
          success: false,
          error: 'Invalid token'
        });
      }

      // Check if expired
      if (new Date() > new Date(tokenData.expiresAt)) {
        return res.status(400).json({
          success: false,
          error: 'Token has expired'
        });
      }

      // Check if already used
      if (tokenData.status === 'uploaded' || tokenData.status === 'used') {
        return res.status(400).json({
          success: false,
          error: 'Token has already been used'
        });
      }

      // Update token with image data (store base64 temporarily)
      await storage.updateFaceUploadTokenWithImage(token, image);

      res.json({
        success: true,
        message: 'Image uploaded successfully'
      });
    } catch (error: any) {
      console.error('Upload image failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload image',
        details: error.message
      });
    }
  });

  // Mark token as used after successful face registration
  app.put('/api/face-upload/:token/mark-used', async (req, res) => {
    try {
      const { token } = req.params;
      
      const tokenData = await storage.getFaceUploadToken(token);
      
      if (!tokenData) {
        return res.status(404).json({
          success: false,
          error: 'Invalid token'
        });
      }

      // Update status to 'used'
      await db.update(faceUploadTokens)
        .set({ status: 'used' })
        .where(eq(faceUploadTokens.token, token));

      res.json({
        success: true,
        message: 'Token marked as used'
      });
    } catch (error: any) {
      console.error('Mark token as used failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark token as used',
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
      const allCustomers = await db.select().from(customers);
      res.json({
        success: true,
        data: allCustomers
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
      const [customer] = await db.select().from(customers).where(eq(customers.id, req.params.id)).limit(1);
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

  // Search customers by name or phone only
  app.get('/api/customers/search/:query', async (req, res) => {
    try {
      const query = req.params.query.toLowerCase();
      // Search in full_name or phone only (not email)
      const allCustomers = await db.select().from(customers);
      const filtered = allCustomers.filter(c => 
        c.fullName.toLowerCase().includes(query) ||
        c.phone.includes(query)
      );
      res.json({
        success: true,
        data: filtered
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
      const [existingCustomer] = await db.select().from(customers).where(eq(customers.phone, validatedData.phone)).limit(1);
      if (existingCustomer) {
        return res.status(409).json({
          success: false,
          error: 'לקוח עם מספר טלפון זה כבר קיים במערכת'
        });
      }
      
      // Insert customer directly into database
      const [customer] = await db.insert(customers).values(validatedData).returning();
      
      console.log('Customer created:', customer.id);
      
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

  // Mark membership usage (deduct session)
  app.post('/api/memberships/:id/use', async (req, res) => {
    try {
      const { db } = await import('./db');
      const { sessionUsage, memberships, customers, insertSessionUsageSchema } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      const membershipId = req.params.id;
      
      // Get membership details
      const [membership] = await db
        .select()
        .from(memberships)
        .where(eq(memberships.id, membershipId))
        .limit(1);

      if (!membership) {
        return res.status(404).json({
          success: false,
          error: 'חבילה לא נמצאה'
        });
      }

      if (membership.balance < 1) {
        return res.status(400).json({
          success: false,
          error: 'אין מספיק שימושים בחבילה'
        });
      }

      // Update membership balance
      const newBalance = membership.balance - 1;
      await db
        .update(memberships)
        .set({ 
          balance: newBalance,
          updatedAt: new Date()
        })
        .where(eq(memberships.id, membershipId));

      // Get customer for WhatsApp notification
      const [customer] = await db.select().from(customers).where(eq(customers.id, membership.customerId)).limit(1);

      // Create usage record
      const usageData = {
        customerId: membership.customerId,
        membershipId: membershipId,
        serviceType: membership.type,
        sessionsUsed: 1,
        entryMethod: 'manual' as const, // Manual check-in via quick search
        notes: `Check-in via Quick Search by staff`
      };
      const [usage] = await db.insert(sessionUsage).values(usageData).returning();

      // Send WhatsApp notification
      if (customer?.phone) {
        try {
          await whatsappService.sendSessionBalanceUpdate(
            customer.phone,
            customer.fullName,
            newBalance,
            membership.type
          );
          console.log(`[WhatsApp] Session balance update sent to ${customer.fullName}`);
        } catch (waError) {
          console.error(`[WhatsApp] Failed to send balance update:`, waError);
        }
      }

      res.json({
        success: true,
        data: {
          usage,
          newBalance,
          message: 'שימוש נרשם בהצלחה'
        }
      });
    } catch (error: any) {
      console.error('Mark membership usage error:', error);
      res.status(500).json({
        success: false,
        error: 'שגיאה בסימון השימוש',
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
      const { customerId, packageId, customerName, customerPhone, customerEmail, successUrl, errorUrl, indicatorUrl, customTanSessions } = req.body;
      
      if (!packageId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: packageId'
        });
      }
      
      // Determine customer details
      let finalCustomerId = customerId;
      let finalCustomerName = customerName;
      let finalCustomerPhone = customerPhone;
      let finalCustomerEmail = customerEmail;
      
      // If customerId is provided and not 'guest', fetch from database
      if (customerId && customerId !== 'guest') {
        const customer = await storage.getCustomer(customerId);
        if (!customer) {
          return res.status(404).json({
            success: false,
            error: 'Customer not found'
          });
        }
        finalCustomerName = customer.fullName;
        finalCustomerPhone = customer.phone;
        finalCustomerEmail = customer.email || undefined;
      } else {
        // For guest or missing customerId, require name and phone in request
        if (!customerName || !customerPhone) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields for guest: customerName, customerPhone'
          });
        }
        finalCustomerId = 'guest';
      }
      
      const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
      const protocol = baseUrl.includes('localhost') ? 'http' : 'https';
      
      const session = await cardcomService.createPaymentSession({
        customerId: finalCustomerId,
        customerName: finalCustomerName,
        customerPhone: finalCustomerPhone,
        customerEmail: finalCustomerEmail,
        packageId,
        customTanSessions: customTanSessions,
        successUrl: successUrl || `${protocol}://${baseUrl}/payment-success?customerId=${finalCustomerId}&packageId=${packageId}`,
        errorUrl: errorUrl || `${protocol}://${baseUrl}/payment-error?customerId=${finalCustomerId}`,
        indicatorUrl: indicatorUrl || `${protocol}://${baseUrl}/api/webhooks/cardcom/payment`,
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
      
      // Return user-friendly Hebrew error message
      const errorMessage = error.message || 'Failed to create payment session';
      
      res.status(500).json({
        success: false,
        error: errorMessage,
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
      const { category, brand, featured, isFeatured, is_featured, tanningType, tanning_type } = req.query;
      let products;
      
      if (category || brand || featured || isFeatured || is_featured || tanningType || tanning_type) {
        // Get all products and filter
        const allProducts = await storage.getProducts();
        products = allProducts.filter((p: any) => {
          if (category && p.category !== category) return false;
          if (brand && p.brand !== brand) return false;
          if (tanningType && p.tanningType !== tanningType && p.tanning_type !== tanningType) return false;
          if (tanning_type && p.tanningType !== tanning_type && p.tanning_type !== tanning_type) return false;
          if (featured === 'true' && !p.is_featured && !p.isFeatured) return false;
          if (isFeatured === 'true' && !p.is_featured && !p.isFeatured) return false;
          if (is_featured === 'true' && !p.is_featured && !p.isFeatured) return false;
          if (isFeatured === 'false' && (p.is_featured || p.isFeatured)) return false;
          if (is_featured === 'false' && (p.is_featured || p.isFeatured)) return false;
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

  // Adjust product stock (atomic delta update)
  app.post('/api/products/:id/adjust-stock', async (req, res) => {
    try {
      const { delta } = req.body;
      if (typeof delta !== 'number') {
        return res.status(400).json({ success: false, error: 'Delta must be a number' });
      }

      // Atomic update using raw SQL to prevent race conditions
      const result = await db.execute(
        sql`UPDATE products 
            SET stock = GREATEST(0, COALESCE(stock, 0) + ${delta}),
                updated_at = NOW()
            WHERE id = ${req.params.id}
            RETURNING *`
      );

      if (!result.rows || result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      res.json(result.rows[0]);
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

  // ==================== CHAT & WHATSAPP LIVE MESSAGING ====================
  
  // Store connected SSE clients
  const chatClients: express.Response[] = [];

  // SSE endpoint for live chat updates
  app.get('/api/chat/live-updates', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    // Add client to list
    chatClients.push(res);
    console.log(`[Chat SSE] New client connected. Total clients: ${chatClients.length}`);

    // Send heartbeat every 20 seconds to keep connection alive
    const heartbeatInterval = setInterval(() => {
      try {
        res.write(':heartbeat\n\n');
      } catch (error) {
        clearInterval(heartbeatInterval);
      }
    }, 20000);

    // Remove client on disconnect
    req.on('close', () => {
      clearInterval(heartbeatInterval);
      const index = chatClients.indexOf(res);
      if (index !== -1) {
        chatClients.splice(index, 1);
      }
      console.log(`[Chat SSE] Client disconnected. Total clients: ${chatClients.length}`);
    });
  });

  // Helper function to broadcast messages to all connected clients
  function broadcastChatMessage(message: any) {
    const data = JSON.stringify(message);
    chatClients.forEach(client => {
      try {
        client.write(`data: ${data}\n\n`);
      } catch (error) {
        console.error('[Chat SSE] Error broadcasting message:', error);
      }
    });
    console.log(`[Chat SSE] Broadcasted message to ${chatClients.length} clients`);
  }

  // Send WhatsApp message (local access only for security)
  app.post('/api/chat/send-message', requireLocalAccess, rateLimit, async (req, res) => {
    try {
      const { recipient, message } = req.body;
      
      if (!recipient || !message) {
        return res.status(400).json({
          success: false,
          error: 'Recipient and message are required'
        });
      }

      // Send via WhatsApp service
      const success = await whatsappService.sendTextMessage(recipient, message);
      
      if (success) {
        res.json({
          success: true,
          message: 'Message sent successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to send message'
        });
      }
    } catch (error: any) {
      console.error('[Chat] Error sending message:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to send message'
      });
    }
  });

  // WhatsApp webhook for receiving messages
  app.post('/api/webhooks/whatsapp', async (req, res) => {
    try {
      // req.body is raw Buffer due to express.raw() middleware
      const rawBody = req.body;
      
      // Verify signature (required if app secret is configured)
      const signature = req.get('X-Hub-Signature-256');
      if (process.env.WHATSAPP_APP_SECRET) {
        if (!signature) {
          console.error('[WhatsApp Webhook] Missing signature header');
          return res.sendStatus(403);
        }
        
        const expectedSignature = crypto
          .createHmac('sha256', process.env.WHATSAPP_APP_SECRET)
          .update(rawBody)
          .digest('hex');
        
        // Remove 'sha256=' prefix from signature
        const receivedSignature = signature.replace('sha256=', '');
        
        // Use timing-safe comparison to prevent timing attacks
        if (!crypto.timingSafeEqual(
          Buffer.from(expectedSignature, 'hex'),
          Buffer.from(receivedSignature, 'hex')
        )) {
          console.error('[WhatsApp Webhook] Invalid signature');
          return res.sendStatus(403);
        }
      }

      // Parse the body after verification
      const body = JSON.parse(rawBody.toString());

      // Process incoming message
      if (body.object === 'whatsapp_business_account') {
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
          const message = body.entry[0].changes[0].value.messages[0];
          const from = message.from; // Phone number
          const text = message.text?.body || '[Media/Unsupported message]';
          const timestamp = message.timestamp;

          console.log(`[WhatsApp Webhook] Received message from ${from}: ${text}`);

          // Broadcast to all connected chat clients
          broadcastChatMessage({
            from,
            text,
            timestamp: new Date(parseInt(timestamp) * 1000).toISOString(),
            type: 'incoming'
          });
        }
      }

      res.sendStatus(200);
    } catch (error: any) {
      console.error('[WhatsApp Webhook] Error processing webhook:', error);
      res.sendStatus(500);
    }
  });

  // WhatsApp webhook verification (GET)
  app.get('/api/webhooks/whatsapp', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const verifyToken = process.env.WA_VERIFY_TOKEN || 'tan_and_co_verify_token';

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('[WhatsApp Webhook] Webhook verified!');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  });

  // ============================================================
  // HEALTH FORMS & SESSION USAGE ROUTES
  // ============================================================

  // Create health form
  app.post('/api/health-forms', async (req, res) => {
    try {
      const { db } = await import('./db');
      const { healthForms, insertHealthFormSchema } = await import('@shared/schema');
      
      const validatedData = insertHealthFormSchema.parse(req.body);
      
      const [healthForm] = await db.insert(healthForms).values({
        ...validatedData,
        ipAddress: req.ip || req.socket.remoteAddress
      }).returning();

      res.json({
        success: true,
        data: healthForm
      });
    } catch (error: any) {
      console.error('Create health form error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get health form by customer
  app.get('/api/health-forms/:customerId', async (req, res) => {
    try {
      const { db } = await import('./db');
      const { healthForms } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      const [healthForm] = await db
        .select()
        .from(healthForms)
        .where(eq(healthForms.customerId, req.params.customerId))
        .limit(1);

      res.json({
        success: true,
        data: healthForm || null
      });
    } catch (error: any) {
      console.error('Get health form error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Create session usage
  app.post('/api/session-usage', async (req, res) => {
    try {
      const { db } = await import('./db');
      const { sessionUsage, memberships, insertSessionUsageSchema } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      const validatedData = insertSessionUsageSchema.parse(req.body);
      const sessionsUsed = validatedData.sessionsUsed || 1;
      
      // Deduct session from membership
      const [membership] = await db
        .select()
        .from(memberships)
        .where(eq(memberships.id, validatedData.membershipId))
        .limit(1);

      if (!membership) {
        return res.status(404).json({
          success: false,
          error: 'Membership not found'
        });
      }

      if (membership.balance < sessionsUsed) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient session balance'
        });
      }

      // Update membership balance
      const newBalance = membership.balance - sessionsUsed;
      await db
        .update(memberships)
        .set({ 
          balance: newBalance,
          updatedAt: new Date()
        })
        .where(eq(memberships.id, validatedData.membershipId));

      // Create usage record
      const [usage] = await db.insert(sessionUsage).values(validatedData).returning();

      res.json({
        success: true,
        data: {
          usage,
          newBalance
        }
      });
    } catch (error: any) {
      console.error('Create session usage error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get session usage by customer
  app.get('/api/session-usage/customer/:customerId', async (req, res) => {
    try {
      const { db } = await import('./db');
      const { sessionUsage } = await import('@shared/schema');
      const { eq, desc } = await import('drizzle-orm');
      
      const usage = await db
        .select()
        .from(sessionUsage)
        .where(eq(sessionUsage.customerId, req.params.customerId))
        .orderBy(desc(sessionUsage.createdAt))
        .limit(50);

      res.json({
        success: true,
        data: usage
      });
    } catch (error: any) {
      console.error('Get session usage error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get session usage by membership
  app.get('/api/session-usage/membership/:membershipId', async (req, res) => {
    try {
      const { db } = await import('./db');
      const { sessionUsage } = await import('@shared/schema');
      const { eq, desc } = await import('drizzle-orm');
      
      const usage = await db
        .select()
        .from(sessionUsage)
        .where(eq(sessionUsage.membershipId, req.params.membershipId))
        .orderBy(desc(sessionUsage.createdAt));

      res.json({
        success: true,
        data: usage
      });
    } catch (error: any) {
      console.error('Get session usage error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // ============================================================
  // Excel Import Endpoint
  // ============================================================

  const upload = multer({ storage: multer.memoryStorage() });

  app.post('/api/import/subscribers', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      // Read Excel file
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const results = {
        success: 0,
        failed: 0,
        total: data.length,
        errors: [] as string[],
        created: [] as { name: string; phone: string; balance: number }[]
      };

      // Process each row
      for (const row of data as any[]) {
        try {
          const fullName = row.FL || '';
          const phone = row.Pelephone || row.Phone || '';
          const packageName = row.Name || '';
          const totalPurchased = parseInt(row.Amount) || 0;
          const balance = parseInt(row.AmountNotuseed) || 0;
          const openDate = row.OpenDate;

          if (!fullName || !phone) {
            results.failed++;
            results.errors.push(`שורה חסרה שם או טלפון: ${fullName || 'לא ידוע'}`);
            continue;
          }

          // Normalize phone number
          let normalizedPhone = phone.toString().replace(/\D/g, '');
          if (normalizedPhone.startsWith('972')) {
            normalizedPhone = '0' + normalizedPhone.substring(3);
          } else if (!normalizedPhone.startsWith('0')) {
            normalizedPhone = '0' + normalizedPhone;
          }

          // Check if customer exists
          let customer = await db
            .select()
            .from(customers)
            .where(eq(customers.phone, normalizedPhone))
            .limit(1);

          let customerId: string;

          if (customer.length === 0) {
            // Create new customer
            const [newCustomer] = await db
              .insert(customers)
              .values({
                fullName,
                phone: normalizedPhone,
                isNewClient: false,
                healthFormSigned: false,
              })
              .returning();
            customerId = newCustomer.id;
          } else {
            customerId = customer[0].id;
          }

          // Determine membership type from package name
          let membershipType = 'sun-beds';
          if (packageName.includes('עיסוי') || packageName.includes('massage')) {
            membershipType = 'massage';
          } else if (packageName.includes('התזה')) {
            membershipType = 'spray-tan';
          }

          // Convert Excel date to timestamp if exists
          let expiryDate = null;
          if (openDate && typeof openDate === 'number') {
            // Excel date serial number to JS date
            const excelEpoch = new Date(1899, 11, 30);
            const jsDate = new Date(excelEpoch.getTime() + openDate * 86400000);
            // Add 12 months
            expiryDate = new Date(jsDate);
            expiryDate.setMonth(expiryDate.getMonth() + 12);
          }

          // Create membership
          await db
            .insert(memberships)
            .values({
              customerId,
              type: membershipType,
              balance,
              totalPurchased,
              expiryDate,
              isActive: balance > 0,
            });

          results.success++;
          results.created.push({
            name: fullName,
            phone: normalizedPhone,
            balance
          });

        } catch (error: any) {
          results.failed++;
          results.errors.push(`שגיאה בייבוא ${row.FL}: ${error.message}`);
        }
      }

      res.json(results);
    } catch (error: any) {
      console.error('Import subscribers error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to import subscribers',
        details: error.message
      });
    }
  });

  // ============================================================
  // Seed Tanning Product Images
  // ============================================================

  app.post('/api/seed/tanning-products', async (req, res) => {
    try {
      const { products: productsTable } = await import('@shared/schema');

      const tanningProducts = [
        {
          name: 'Thatso Spray Tan',
          nameHe: 'תרסיס שיזוף Thatso',
          description: 'Professional spray tan solution for instant bronzing',
          descriptionHe: 'תרסיס שיזוף מקצועי להשמרה מיידית',
          price: '180',
          productType: 'product',
          category: 'tanning',
          brand: 'Thatso',
          tanningType: 'self-tanning',
          stock: 15,
          isActive: true,
          isFeatured: true,
          images: ['https://i.ibb.co/7KXqH9y/Thatso-Spray.jpg'],
          features: [
            'תרסיס שיזוף מקצועי',
            'תוצאה מיידית',
            'נוסחה איכותית של Thatso',
            'מתאים לכל סוגי העור'
          ]
        },
        {
          name: 'Jet Set Sun Tanning Lotion',
          nameHe: 'Jet Set Sun - תחליב שיזוף',
          description: 'Premium tanning lotion with sun-activated formula',
          descriptionHe: 'תחליב שיזוף פרימיום עם נוסחה מופעלת שמש',
          price: '150',
          productType: 'product',
          category: 'tanning',
          brand: 'OTHER',
          tanningType: 'bed-bronzer',
          bronzerStrength: 8,
          stock: 20,
          isActive: true,
          isFeatured: true,
          images: ['https://i.ibb.co/9yHQcXy/Jet-Set-Sun.jpg'],
          features: [
            'נוסחה מופעלת שמש',
            'מתאים למיטות שיזוף',
            'חוזק ברונזר: 8',
            'לחות עמוקה'
          ]
        },
        {
          name: 'Glam Body Extra Dark Bronzer',
          nameHe: 'Glam Body - ברונזר כהה במיוחד',
          description: 'Extra dark bronzing lotion for deep, long-lasting color',
          descriptionHe: 'ברונזר כהה במיוחד לצבע עמוק ועמיד',
          price: '200',
          salePrice: '170',
          productType: 'product',
          category: 'tanning',
          brand: 'OTHER',
          tanningType: 'bed-bronzer',
          bronzerStrength: 12,
          stock: 10,
          isActive: true,
          isFeatured: true,
          badge: 'bestseller',
          images: ['https://i.ibb.co/7y4gZVL/Glam-Body-Extra-Dark.jpg'],
          features: [
            'ברונזר כהה במיוחד',
            'חוזק ברונזר: 12',
            'צבע עמוק ועמיד',
            'מומלץ למשתמשים מנוסים'
          ]
        }
      ];

      const results = {
        created: 0,
        skipped: 0,
        errors: [] as string[]
      };

      for (const product of tanningProducts) {
        try {
          // Check if product already exists
          const existing = await db
            .select()
            .from(productsTable)
            .where(eq(productsTable.nameHe, product.nameHe))
            .limit(1);

          if (existing.length > 0) {
            results.skipped++;
            continue;
          }

          // Insert product
          await db.insert(productsTable).values(product);
          results.created++;
        } catch (error: any) {
          results.errors.push(`Failed to create ${product.nameHe}: ${error.message}`);
        }
      }

      res.json({
        success: true,
        data: results
      });
    } catch (error: any) {
      console.error('Seed tanning products error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to seed tanning products',
        details: error.message
      });
    }
  });

  // ============================================================
  // BioStar Sync Endpoint
  // ============================================================

  app.post('/api/sync/biostar', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      // Read CSV file using XLSX (it supports CSV too)
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const results = {
        matched: 0,
        unmatched: 0,
        total: data.length,
        unmatchedNames: [] as string[],
        syncedUsers: [] as { name: string; phone: string; biostarId: string }[]
      };

      // Process each BioStar user
      for (const row of data as any[]) {
        try {
          const biostarUserId = row.user_id?.toString() || '';
          const name = row.name || '';
          const phone = row.phone || '';
          
          // Skip rows without essential data
          if (!biostarUserId || !name) {
            continue;
          }

          // Skip special users (like "אופטימוס-פתיחת דלת")
          if (biostarUserId === '2' || name.includes('אופטימוס') || name.includes('כניסות בודדות')) {
            continue;
          }

          // If no phone, can't match - add to unmatched
          if (!phone) {
            results.unmatched++;
            results.unmatchedNames.push(name);
            continue;
          }

          // Normalize phone number (same logic as import)
          let normalizedPhone = phone.toString().replace(/\D/g, '');
          if (normalizedPhone.startsWith('972')) {
            normalizedPhone = '0' + normalizedPhone.substring(3);
          } else if (!normalizedPhone.startsWith('0')) {
            normalizedPhone = '0' + normalizedPhone;
          }

          // Find customer by phone
          const customer = await db
            .select()
            .from(customers)
            .where(eq(customers.phone, normalizedPhone))
            .limit(1);

          if (customer.length > 0) {
            // Update customer with BioStar user_id
            await db
              .update(customers)
              .set({ faceRecognitionId: biostarUserId })
              .where(eq(customers.id, customer[0].id));

            results.matched++;
            results.syncedUsers.push({
              name,
              phone: normalizedPhone,
              biostarId: biostarUserId
            });
          } else {
            // Customer not found in CRM
            results.unmatched++;
            results.unmatchedNames.push(`${name} (${normalizedPhone})`);
          }

        } catch (error: any) {
          console.error('Sync row error:', error);
          // Continue with next row
        }
      }

      res.json(results);
    } catch (error: any) {
      console.error('BioStar sync error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync BioStar users',
        details: error.message
      });
    }
  });

  // ============================================================
  // Product Import Endpoint (PAS TOUCHER & ProShop)
  // ============================================================

  app.post('/api/import/pas-toucher', async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({
          success: false,
          error: 'URL is required'
        });
      }

      // Security: Validate URL belongs to allowed domains and uses HTTPS
      const urlObj = new URL(url);
      const isValidPasToucher = urlObj.hostname === 'pas-toucher.com' || urlObj.hostname.endsWith('.pas-toucher.com');
      const isValidProShop = urlObj.hostname === 'proshop.co.il' || urlObj.hostname.endsWith('.proshop.co.il');
      const isValidHost = isValidPasToucher || isValidProShop;
      
      if (urlObj.protocol !== 'https:' || !isValidHost) {
        return res.status(400).json({
          success: false,
          error: 'URL must be from https://pas-toucher.com, https://www.pas-toucher.com, or https://proshop.co.il'
        });
      }
      
      const brand = isValidPasToucher ? 'PAS TOUCHER' : 'BALIBODY';

      const { load } = await import('cheerio');
      const { products: productsTable } = await import('@shared/schema');

      const results = {
        imported: 0,
        skipped: 0,
        total: 0,
        products: [] as { name: string; color: string; price: number; salePrice?: number }[]
      };

      // Fetch the HTML content
      const response = await fetch(url);
      
      if (!response.ok) {
        return res.status(502).json({
          success: false,
          error: `Failed to fetch from PAS TOUCHER: ${response.status} ${response.statusText}`
        });
      }
      
      const html = await response.text();

      // Load HTML with Cheerio
      const $ = load(html);

      console.log(`[${brand}] Total products found:`, $('.product, li.product').length);

      // Extract products - support both PAS TOUCHER and WooCommerce structures
      let debugCount = 0;
      $('li.product, .product').each((_, element) => {
        const $product = $(element);
        
        let name, color, price, salePrice, originalPrice, imageUrl;
        
        if (isValidPasToucher) {
          // PAS TOUCHER structure
          name = $product.find('.product__name').first().text().trim();
          color = $product.find('.product__color').first().text().trim();
          
          const originalPriceText = $product.find('.product__original-price').first().text().trim();
          const salePriceText = $product.find('.product__sale-price').first().text().trim();
          const regularPriceText = $product.find('.product__price').first().text().trim();
          
          const originalPriceMatch = originalPriceText.match(/(\d+)/);
          const salePriceMatch = salePriceText.match(/(\d+)/);
          const regularPriceMatch = regularPriceText.match(/(\d+)/);
          
          originalPrice = originalPriceMatch ? parseInt(originalPriceMatch[1]) : 0;
          salePrice = salePriceMatch ? parseInt(salePriceMatch[1]) : null;
          price = salePrice || (regularPriceMatch ? parseInt(regularPriceMatch[1]) : 0);
          
          imageUrl = $product.find('.product__thumbnail').first().attr('src') || 
                    $product.find('.product__thumbnail').first().attr('data-src') || '';
        } else {
          // WooCommerce/ProShop structure
          name = $product.find('.woocommerce-loop-product__title').first().text().trim();
          color = '';
          
          const priceContainer = $product.find('.price').first();
          const delPrice = priceContainer.find('del .woocommerce-Price-amount bdi').text().trim();
          const insPrice = priceContainer.find('ins .woocommerce-Price-amount bdi').text().trim();
          const regularPrice = priceContainer.find('.woocommerce-Price-amount bdi').first().text().trim();
          
          const delMatch = delPrice.match(/(\d+)/);
          const insMatch = insPrice.match(/(\d+)/);
          const regularMatch = regularPrice.match(/(\d+)/);
          
          originalPrice = delMatch ? parseInt(delMatch[1]) : 0;
          salePrice = insMatch ? parseInt(insMatch[1]) : null;
          price = salePrice || (regularMatch ? parseInt(regularMatch[1]) : 0);
          
          imageUrl = $product.find('img').first().attr('data-lazy-src') || 
                    $product.find('img').first().attr('src') || '';
        }

        if (debugCount < 3) {
          console.log(`[${brand}] Product ${debugCount + 1}:`, {
            name,
            color,
            price,
            salePrice,
            originalPrice
          });
          debugCount++;
        }

        if (name && price > 0) {
          results.total++;
        }
      });

      // Now actually import (re-iterate to insert into DB)
      for (const productElement of $('li.product, .product').toArray()) {
        const $product = $(productElement);
        
        let name, color, price, salePrice, imageUrl, isOutOfStock;
        
        if (isValidPasToucher) {
          // PAS TOUCHER structure
          name = $product.find('.product__name').first().text().trim();
          color = $product.find('.product__color').first().text().trim();
          
          const originalPriceText = $product.find('.product__original-price').first().text().trim();
          const salePriceText = $product.find('.product__sale-price').first().text().trim();
          const regularPriceText = $product.find('.product__price').first().text().trim();
          
          const originalPriceMatch = originalPriceText.match(/(\d+)/);
          const salePriceMatch = salePriceText.match(/(\d+)/);
          const regularPriceMatch = regularPriceText.match(/(\d+)/);
          
          salePrice = salePriceMatch ? parseInt(salePriceMatch[1]) : null;
          price = salePrice || (regularPriceMatch ? parseInt(regularPriceMatch[1]) : 0);
          
          imageUrl = $product.find('.product__thumbnail').first().attr('src') || 
                    $product.find('.product__thumbnail').first().attr('data-src') || '';
          
          isOutOfStock = $product.find('.product__label--out-of-stock').length > 0;
        } else {
          // WooCommerce/ProShop structure
          name = $product.find('.woocommerce-loop-product__title').first().text().trim();
          color = '';
          
          const priceContainer = $product.find('.price').first();
          const delPrice = priceContainer.find('del .woocommerce-Price-amount bdi').text().trim();
          const insPrice = priceContainer.find('ins .woocommerce-Price-amount bdi').text().trim();
          const regularPrice = priceContainer.find('.woocommerce-Price-amount bdi').first().text().trim();
          
          const insMatch = insPrice.match(/(\d+)/);
          const regularMatch = regularPrice.match(/(\d+)/);
          
          salePrice = insMatch ? parseInt(insMatch[1]) : null;
          price = salePrice || (regularMatch ? parseInt(regularMatch[1]) : 0);
          
          imageUrl = $product.find('img').first().attr('data-lazy-src') || 
                    $product.find('img').first().attr('src') || '';
          
          isOutOfStock = $product.hasClass('outofstock') || $product.find('.out-of-stock').length > 0;
        }

        if (!name || price <= 0) {
          continue;
        }

        // Create unique product key (name + color)
        const productKey = `${name}${color}`.trim();

        // Check if product already exists
        const existing = await db
          .select()
          .from(productsTable)
          .where(eq(productsTable.name, productKey))
          .limit(1);

        if (existing.length > 0) {
          results.skipped++;
          continue;
        }

        // Determine category and features based on brand
        const category = isValidPasToucher ? 'sunglasses' : 'tanning';
        const features = isValidPasToucher ? [
          'הגנה מלאה מקרינת UV',
          'עיצוב אלכסנדר ברקמן',
          'איכות פרימיום'
        ] : [
          'מוצר איכותי של BALIBODY',
          'לשיזוף מושלם',
          'מומלץ למשתמשי מיטות שיזוף'
        ];

        // Create product
        await db.insert(productsTable).values({
          name: productKey,
          nameHe: `${name}${color}`,
          description: `${name}${color ? ' ' + color : ''}`,
          descriptionHe: `${name}${color ? ' ' + color : ''}`,
          price: price.toString(),
          salePrice: salePrice ? salePrice.toString() : null,
          productType: 'product',
          category: category,
          brand: brand,
          stock: isOutOfStock ? 0 : 10,
          isActive: !isOutOfStock,
          isFeatured: false,
          images: imageUrl ? [imageUrl] : null,
          features: features
        });

        results.imported++;
        results.products.push({
          name,
          color,
          price,
          salePrice: salePrice || undefined
        });
      }

      res.json(results);
    } catch (error: any) {
      console.error('PAS TOUCHER import error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to import PAS TOUCHER products',
        details: error.message
      });
    }
  });
}