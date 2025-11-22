import { whatsappTemplates } from "./whatsapp-templates";

interface WhatsAppMessage {
  messaging_product: "whatsapp";
  recipient_type?: "individual";
  to: string;
  type: "text" | "template";
  text?: { body: string };
  template?: any;
}

class WhatsAppService {
  private phoneNumberId: string | null = null;
  private accessToken: string | null = null;
  private apiVersion: string = "v18.0";
  private isConfigured: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.phoneNumberId = process.env.WA_PHONE_NUMBER_ID || null;
    this.accessToken = process.env.CLOUD_API_ACCESS_TOKEN || null;
    this.apiVersion = process.env.CLOUD_API_VERSION || "v18.0";

    if (!this.phoneNumberId || !this.accessToken) {
      console.warn(
        "[WhatsApp] Service not configured - missing WA_PHONE_NUMBER_ID or CLOUD_API_ACCESS_TOKEN"
      );
      this.isConfigured = false;
      return;
    }

    this.isConfigured = true;
    console.log("[WhatsApp] Service initialized successfully");
  }

  /**
   * Send a message to WhatsApp Cloud API
   */
  private async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    if (!this.isConfigured || !this.phoneNumberId || !this.accessToken) {
      console.warn("[WhatsApp] Cannot send message - service not configured");
      return false;
    }

    try {
      const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("[WhatsApp] API error:", error);
        return false;
      }

      const result = await response.json();
      console.log("[WhatsApp] Message sent successfully:", result);
      return true;
    } catch (error) {
      console.error("[WhatsApp] Failed to send message:", error);
      return false;
    }
  }

  /**
   * Send a text message
   */
  async sendTextMessage(to: string, messageText: string): Promise<boolean> {
    const normalizedPhone = this.normalizePhoneNumber(to);
    
    const message: WhatsAppMessage = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: normalizedPhone,
      type: "text",
      text: { body: messageText },
    };

    return this.sendMessage(message);
  }

  /**
   * Send a template message
   */
  async sendTemplateMessage(
    to: string,
    templateKey: keyof typeof whatsappTemplates,
    parameters: Record<string, string> = {}
  ): Promise<boolean> {
    const normalizedPhone = this.normalizePhoneNumber(to);
    const template = whatsappTemplates[templateKey];
    
    // Build components array from parameters
    const components: any[] = [];
    if (Object.keys(parameters).length > 0) {
      components.push({
        type: "body",
        parameters: Object.values(parameters).map(value => ({
          type: "text",
          text: value
        }))
      });
    }
    
    const message: WhatsAppMessage = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: normalizedPhone,
      type: "template",
      template: {
        name: template.name,
        language: { code: template.language },
        components: components.length > 0 ? components : undefined,
      },
    };

    return this.sendMessage(message);
  }

  /**
   * Send welcome message with purchase options
   */
  async sendWelcomeMessage(to: string, customerName: string): Promise<boolean> {
    const params: Record<string, string> = { "1": customerName };
    return this.sendTemplateMessage(to, "welcome", params);
  }

  /**
   * Send purchase options with checkout link
   */
  async sendPurchaseOptions(
    to: string,
    customerName: string,
    checkoutLink: string
  ): Promise<boolean> {
    const params: Record<string, string> = { 
      "1": customerName,
      "2": checkoutLink,
    };
    return this.sendTemplateMessage(to, "purchaseOptions", params);
  }

  /**
   * Send payment success confirmation
   */
  async sendPaymentConfirmation(
    to: string,
    customerName: string,
    packageName: string
  ): Promise<boolean> {
    const params: Record<string, string> = {
      "1": customerName,
      "2": packageName,
    };
    return this.sendTemplateMessage(to, "paymentSuccess", params);
  }

  /**
   * Send health form link
   */
  async sendHealthFormLink(
    to: string,
    customerName: string,
    formLink: string
  ): Promise<boolean> {
    const params: Record<string, string> = {
      "1": customerName,
      "2": formLink,
    };
    return this.sendTemplateMessage(to, "healthForm", params);
  }

  /**
   * Send face registration link
   */
  async sendFaceRegistrationLink(
    to: string,
    customerName: string,
    registrationLink: string
  ): Promise<boolean> {
    const params: Record<string, string> = {
      "1": customerName,
      "2": registrationLink,
    };
    return this.sendTemplateMessage(to, "faceRegistration", params);
  }

  /**
   * Send onboarding complete message
   */
  async sendOnboardingComplete(
    to: string,
    customerName: string
  ): Promise<boolean> {
    const params: Record<string, string> = { "1": customerName };
    return this.sendTemplateMessage(to, "onboardingComplete", params);
  }

  /**
   * Send session balance update after entry
   */
  async sendSessionBalanceUpdate(
    to: string,
    customerName: string,
    remainingSessions: number,
    membershipType: string
  ): Promise<boolean> {
    // Build short, friendly message
    const message = `איזה כיף שחזרת, שיזוף נעים 🌞\n\nיתרתך: ${remainingSessions} כניסות`;
    
    return this.sendTextMessage(to, message);
  }

  /**
   * Send receipt/invoice to customer via WhatsApp
   * שליחת חשבונית לוואטסאפ
   */
  async sendReceipt(
    to: string,
    customerName: string,
    transactionId: string,
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>,
    subtotal: number,
    tax?: number,
    total: number,
    paymentMethod: string,
    change?: number,
    date: Date
  ): Promise<boolean> {
    try {
      const dateStr = date.toLocaleString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      // Build receipt message
      let receipt = `🧾 *חשבונית - Tan & Co*\n\n`;
      receipt += `📋 *מספר עסקה:* ${transactionId.slice(0, 12)}\n`;
      receipt += `📅 *תאריך:* ${dateStr}\n`;
      receipt += `👤 *לקוח:* ${customerName}\n`;
      receipt += `\n${'='.repeat(30)}\n`;
      receipt += `*פרטי רכישה:*\n\n`;

      // Add items
      for (const item of items) {
        receipt += `• ${item.name}\n`;
        receipt += `  ${item.quantity}x ₪${item.price.toFixed(2)} = ₪${item.total.toFixed(2)}\n`;
      }

      receipt += `\n${'='.repeat(30)}\n`;
      receipt += `💰 *סה"כ:* ₪${total.toFixed(2)}\n`;

      if (tax) {
        receipt += `📊 *מע"מ:* ₪${tax.toFixed(2)}\n`;
      }

      receipt += `💳 *אמצעי תשלום:* ${paymentMethod}\n`;

      if (change && change > 0) {
        receipt += `💵 *עודף:* ₪${change.toFixed(2)}\n`;
      }

      receipt += `\n${'='.repeat(30)}\n`;
      receipt += `📍 *כתובת:* רחוב הברזל 11, תל אביב\n`;
      receipt += `📞 *טלפון:* 03-1234567\n`;
      receipt += `\n✨ תודה על רכישתך! שיזוף נעים! 🌞\n`;
      receipt += `\n_חשבונית זו נשלחה אוטומטית מהמערכת_`;

      return await this.sendTextMessage(to, receipt);
    } catch (error) {
      console.error('[WhatsApp] Failed to send receipt:', error);
      return false;
    }
  }

  /**
   * Normalize phone number to international format
   */
  private normalizePhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let normalized = phone.replace(/\D/g, "");
    
    // Add country code if missing (assuming Israel +972)
    if (!normalized.startsWith("972")) {
      // Remove leading 0 if present
      if (normalized.startsWith("0")) {
        normalized = normalized.substring(1);
      }
      normalized = "972" + normalized;
    }
    
    return normalized;
  }

  /**
   * Check if service is configured
   */
  isReady(): boolean {
    return this.isConfigured;
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();
