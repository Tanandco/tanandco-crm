import { whatsappService } from "./whatsapp-service";
import { cardcomService } from "./cardcom-service";
import { getPackageById } from "../config/packages";
import type { IStorage } from "../storage";
import type { Customer } from "../../shared/schema";

// Customer workflow stages
export type CustomerStage =
  | "lead_inbound" // Initial contact
  | "whatsapp_engaged" // Responded to WhatsApp
  | "checkout_link_sent" // Sent payment link
  | "payment_pending" // Waiting for payment
  | "payment_success" // Payment completed
  | "health_form_sent" // Sent health form
  | "health_form_completed" // Health form filled
  | "face_link_sent" // Sent face registration link
  | "face_enrolled" // Face registered
  | "active"; // Fully onboarded

class WorkflowService {
  constructor(private storage: IStorage) {}

  /**
   * Handle incoming WhatsApp message from new/existing customer
   */
  async handleInboundWhatsAppMessage(
    phoneNumber: string,
    messageText: string
  ): Promise<void> {
    try {
      // Normalize phone number
      const normalizedPhone = this.normalizePhone(phoneNumber);

      // Find or create customer
      let customer = await this.storage.getCustomerByPhone(normalizedPhone);

      if (!customer) {
        // New lead - create customer
        customer = await this.storage.createCustomer({
          fullName: `לקוח ${normalizedPhone.slice(-4)}`, // Temporary name
          phone: normalizedPhone,
          stage: "lead_inbound",
          waOptIn: true,
          lastWhatsAppMsgAt: new Date(),
        });
        
        console.log(`[Workflow] New lead created: ${customer.id}`);
      } else {
        // Update last message timestamp
        await this.storage.updateCustomer(customer.id, {
          lastWhatsAppMsgAt: new Date(),
        });
      }

      // Advance workflow based on current stage
      await this.advanceWorkflow(customer, messageText);
    } catch (error) {
      console.error("[Workflow] Error handling inbound message:", error);
    }
  }

  /**
   * Advance customer through workflow stages
   */
  private async advanceWorkflow(
    customer: Customer,
    context?: string
  ): Promise<void> {
    const stage = customer.stage as CustomerStage;

    switch (stage) {
      case "lead_inbound":
        // Send welcome and purchase options
        await this.sendPurchaseOptions(customer);
        break;

      case "whatsapp_engaged":
        // Re-send purchase options if needed
        await this.sendPurchaseOptions(customer);
        break;

      case "checkout_link_sent":
      case "payment_pending":
        // Waiting for payment - send reminder if needed
        console.log(`[Workflow] Customer ${customer.id} waiting for payment`);
        break;

      case "payment_success":
        // Send health form and face registration
        await this.sendOnboardingLinks(customer);
        break;

      case "health_form_sent":
      case "health_form_completed":
      case "face_link_sent":
        // Waiting for onboarding completion
        console.log(`[Workflow] Customer ${customer.id} in onboarding: ${stage}`);
        break;

      case "face_enrolled":
        // Mark as active
        await this.completeOnboarding(customer);
        break;

      case "active":
        // Customer is fully onboarded
        console.log(`[Workflow] Customer ${customer.id} is active`);
        break;
    }
  }

  /**
   * Send purchase options to customer
   */
  private async sendPurchaseOptions(customer: Customer): Promise<void> {
    try {
      const baseUrl = process.env.APP_BASE_URL || "http://localhost:5000";
      const checkoutUrl = `${baseUrl}/checkout/${customer.id}`;

      // Send WhatsApp message with purchase options
      const sent = await whatsappService.sendPurchaseOptions(
        customer.phone,
        customer.fullName,
        checkoutUrl
      );

      if (sent) {
        // Update customer stage
        await this.storage.updateCustomer(customer.id, {
          stage: "checkout_link_sent",
        });

        console.log(`[Workflow] Purchase options sent to ${customer.id}`);
      }
    } catch (error) {
      console.error("[Workflow] Error sending purchase options:", error);
    }
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSuccess(
    customerId: string,
    packageId: string,
    transactionId: string,
    amount: number
  ): Promise<void> {
    try {
      const customer = await this.storage.getCustomer(customerId);
      if (!customer) {
        console.error(`[Workflow] Customer not found: ${customerId}`);
        return;
      }

      const pkg = getPackageById(packageId);
      if (!pkg) {
        console.error(`[Workflow] Package not found: ${packageId}`);
        return;
      }

      // Create transaction record
      await this.storage.createTransaction({
        customerId,
        type: "membership",
        amount: amount.toString(),
        currency: "ILS",
        status: "completed",
        paymentMethod: "card",
        cardcomTransactionId: transactionId,
        metadata: { packageId, packageName: pkg.nameHe },
      });

      // Create or update membership
      const existingMemberships = await this.storage.getMembershipsByCustomer(customerId);
      const existingMembership = existingMemberships.find(
        (m) => m.type === pkg.type && m.isActive
      );

      if (existingMembership) {
        // Add sessions to existing membership
        await this.storage.updateMembership(existingMembership.id, {
          balance: existingMembership.balance + pkg.sessions,
          totalPurchased: existingMembership.totalPurchased + pkg.sessions,
        });
      } else {
        // Create new membership
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 90); // 90 days validity

        await this.storage.createMembership({
          customerId,
          type: pkg.type,
          balance: pkg.sessions,
          totalPurchased: pkg.sessions,
          expiryDate,
          isActive: true,
        });
      }

      // Send payment confirmation
      await whatsappService.sendPaymentConfirmation(
        customer.phone,
        customer.fullName,
        pkg.nameHe
      );

      // Update customer stage
      await this.storage.updateCustomer(customerId, {
        stage: "payment_success",
      });

      // Automatically send onboarding links
      await this.sendOnboardingLinks(customer);

      console.log(`[Workflow] Payment processed for customer ${customerId}`);
    } catch (error) {
      console.error("[Workflow] Error handling payment success:", error);
    }
  }

  /**
   * Send onboarding links (health form + face registration)
   */
  private async sendOnboardingLinks(customer: Customer): Promise<void> {
    try {
      const baseUrl = process.env.APP_BASE_URL || "http://localhost:5000";
      
      // Generate unique token for face registration (30 minutes expiry)
      // Use crypto for token generation
      const crypto = await import('crypto');
      const faceToken = crypto.randomBytes(8).toString('base64url').slice(0, 10);
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      
      // Create face upload token in database
      await this.storage.createFaceUploadToken({
        token: faceToken,
        customerId: customer.id,
        status: 'pending',
        expiresAt
      });
      
      // Use token-based URLs for better security
      const healthFormUrl = `${baseUrl}/health-form?customerId=${customer.id}`;
      const faceRegUrl = `${baseUrl}/upload-face/${faceToken}`;

      // Send health form link first
      await whatsappService.sendHealthFormLink(
        customer.phone,
        customer.fullName,
        healthFormUrl
      );

      // Wait a bit before sending face registration link
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Send face registration link
      await whatsappService.sendFaceRegistrationLink(
        customer.phone,
        customer.fullName,
        faceRegUrl
      );

      // Update stage
      await this.storage.updateCustomer(customer.id, {
        stage: "health_form_sent",
      });

      console.log(`[Workflow] Onboarding links sent to ${customer.id}`);
    } catch (error) {
      console.error("[Workflow] Error sending onboarding links:", error);
    }
  }

  /**
   * Handle health form completion
   */
  async handleHealthFormComplete(customerId: string): Promise<void> {
    try {
      await this.storage.updateCustomer(customerId, {
        healthFormSigned: true,
        stage: "health_form_completed",
      });

      console.log(`[Workflow] Health form completed for ${customerId}`);
    } catch (error) {
      console.error("[Workflow] Error handling health form completion:", error);
    }
  }

  /**
   * Handle face registration completion
   */
  async handleFaceRegistrationComplete(
    customerId: string,
    faceRecognitionId: string
  ): Promise<void> {
    try {
      const customer = await this.storage.getCustomer(customerId);
      if (!customer) return;

      await this.storage.updateCustomer(customerId, {
        faceRecognitionId,
        stage: "face_enrolled",
      });

      // Complete onboarding
      await this.completeOnboarding(customer);

      console.log(`[Workflow] Face registration completed for ${customerId}`);
    } catch (error) {
      console.error("[Workflow] Error handling face registration:", error);
    }
  }

  /**
   * Complete customer onboarding
   */
  private async completeOnboarding(customer: Customer): Promise<void> {
    try {
      await this.storage.updateCustomer(customer.id, {
        stage: "active",
        isNewClient: false,
      });

      // Send completion message
      await whatsappService.sendOnboardingComplete(
        customer.phone,
        customer.fullName
      );

      console.log(`[Workflow] Onboarding completed for ${customer.id}`);
    } catch (error) {
      console.error("[Workflow] Error completing onboarding:", error);
    }
  }

  /**
   * Normalize phone number
   */
  private normalizePhone(phone: string): string {
    let normalized = phone.replace(/\D/g, "");
    
    if (!normalized.startsWith("972")) {
      if (normalized.startsWith("0")) {
        normalized = normalized.substring(1);
      }
      normalized = "972" + normalized;
    }
    
    return normalized;
  }
}

export { WorkflowService };
