import crypto from "crypto";
import { getPackageById } from "../config/packages";

interface CardcomConfig {
  terminalNumber: string;
  apiUsername: string;
  apiPassword?: string; // Optional for some operations
  language: string;
}

interface CreateSessionParams {
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  packageId: string;
  customTanSessions?: number; // For custom "Build Your Tan" package
  successUrl: string;
  errorUrl: string;
  indicatorUrl?: string; // Webhook URL
}

interface CardcomSession {
  url: string;
  lowProfileCode: string;
}

class CardcomService {
  private config: CardcomConfig | null = null;
  private isConfigured: boolean = false;
  private baseUrl: string = "https://secure.cardcom.solutions";

  constructor() {
    this.initialize();
  }

  private initialize() {
    const terminalNumber = process.env.CARDCOM_TERMINAL_NUMBER;
    const apiUsername = process.env.CARDCOM_API_USERNAME;
    const apiPassword = process.env.CARDCOM_API_PASSWORD;

    if (!terminalNumber || !apiUsername) {
      console.warn(
        "[Cardcom] Service not configured - missing CARDCOM_TERMINAL_NUMBER or CARDCOM_API_USERNAME"
      );
      this.isConfigured = false;
      return;
    }

    this.config = {
      terminalNumber,
      apiUsername,
      apiPassword,
      language: "he",
    };

    this.isConfigured = true;
    console.log("[Cardcom] Service initialized successfully");
  }

  /**
   * Create a payment session (Low Profile API)
   */
  async createPaymentSession(
    params: CreateSessionParams
  ): Promise<CardcomSession | null> {
    if (!this.isConfigured || !this.config) {
      console.warn("[Cardcom] Cannot create session - service not configured");
      return null;
    }

    try {
      // Handle custom "Build Your Tan" package
      let pkg;
      if (params.packageId === 'custom-tan') {
        if (!params.customTanSessions || params.customTanSessions < 4 || params.customTanSessions > 20) {
          throw new Error('Invalid customTanSessions for custom-tan package');
        }
        pkg = {
          id: 'custom-tan',
          nameHe: `בנה את השיזוף שלך - ${params.customTanSessions} כניסות`,
          nameEn: 'Build Your Tan',
          type: 'sun-beds',
          sessions: params.customTanSessions,
          price: params.customTanSessions * 40,
          currency: 'ILS',
        };
      } else {
        pkg = getPackageById(params.packageId);
        if (!pkg) {
          throw new Error(`Package not found: ${params.packageId}`);
        }
      }

      // Build form data for Low Profile API
      const formData = new URLSearchParams({
        TerminalNumber: this.config.terminalNumber,
        UserName: this.config.apiUsername,
        APILevel: "10",
        codepage: "65001", // UTF-8
        Operation: "1", // Charge
        CoinID: "1", // ILS
        Language: this.config.language,
        SumToBill: pkg.price.toString(),
        ProductName: pkg.nameHe,
        // Customer details
        CustName: params.customerName,
        CustMobilePH: params.customerPhone.replace(/\D/g, ""),
        ...(params.customerEmail && { CustEmail: params.customerEmail }),
        // URLs
        SuccessRedirectUrl: params.successUrl,
        ErrorRedirectUrl: params.errorUrl,
        ...(params.indicatorUrl && { IndicatorUrl: params.indicatorUrl }),
        // Additional data
        InternalDealID: `${params.customerId}_${params.packageId}_${Date.now()}`,
        ReturnValue: JSON.stringify({
          customerId: params.customerId,
          packageId: params.packageId,
        }),
      });

      const response = await fetch(
        `${this.baseUrl}/Interface/LowProfile.aspx`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const result = await response.text();
      
      // Parse response (format: ResponseCode=0&url=https://...)
      const responseParams = new URLSearchParams(result);
      const responseCode = responseParams.get("ResponseCode");
      const lowProfileCode = responseParams.get("LowProfileCode");
      const url = responseParams.get("url");

      if (responseCode !== "0" || !url || !lowProfileCode) {
        const description = responseParams.get("Description");
        
        // Check for specific error codes
        if (responseCode === "650") {
          console.error("[Cardcom] Permission error - Low Profile API not enabled:", result);
          throw new Error("חשבון Cardcom לא מאושר להשתמש ב-Low Profile API. יש ליצור קשר עם Cardcom לשדרוג החשבון.");
        }
        
        console.error("[Cardcom] Failed to create session:", result);
        throw new Error(description || "שגיאה ביצירת קישור תשלום");
      }

      console.log(`[Cardcom] Payment session created: ${lowProfileCode}`);
      
      return {
        url,
        lowProfileCode,
      };
    } catch (error) {
      console.error("[Cardcom] Error creating payment session:", error);
      throw error; // Re-throw to propagate the Hebrew error message
    }
  }

  /**
   * Create a payment session for online shop products
   */
  async createPaymentSessionForProducts(params: {
    items: Array<{
      productId: string;
      productName: string;
      productNameHe: string;
      quantity: number;
      unitPrice: string;
    }>;
    totalAmount: number;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    successUrl: string;
    errorUrl: string;
    indicatorUrl?: string;
  }): Promise<CardcomSession | null> {
    if (!this.isConfigured || !this.config) {
      console.warn("[Cardcom] Cannot create session - service not configured");
      return null;
    }

    try {
      // Create product list description
      const productNames = params.items
        .map(item => `${item.productNameHe || item.productName} (x${item.quantity})`)
        .join(', ');

      // Build form data for Low Profile API
      const formData = new URLSearchParams({
        TerminalNumber: this.config.terminalNumber,
        UserName: this.config.apiUsername,
        APILevel: "10",
        codepage: "65001", // UTF-8
        Operation: "1", // Charge
        CoinID: "1", // ILS
        Language: this.config.language,
        SumToBill: params.totalAmount.toString(),
        ProductName: `רכישת מוצרים: ${productNames}`,
        // Customer details
        CustName: params.customerName,
        CustMobilePH: params.customerPhone.replace(/\D/g, ""),
        ...(params.customerEmail && { CustEmail: params.customerEmail }),
        // URLs
        SuccessRedirectUrl: params.successUrl,
        ErrorRedirectUrl: params.errorUrl,
        ...(params.indicatorUrl && { IndicatorUrl: params.indicatorUrl }),
        // Additional data
        InternalDealID: `shop_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        ReturnValue: JSON.stringify({
          source: 'online-shop',
          items: params.items,
          totalAmount: params.totalAmount,
        }),
      });

      const response = await fetch(
        `${this.baseUrl}/Interface/LowProfile.aspx`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const result = await response.text();
      
      // Parse response (format: ResponseCode=0&url=https://...)
      const responseParams = new URLSearchParams(result);
      const responseCode = responseParams.get("ResponseCode");
      const lowProfileCode = responseParams.get("LowProfileCode");
      const url = responseParams.get("url");

      if (responseCode !== "0" || !url || !lowProfileCode) {
        const description = responseParams.get("Description");
        
        if (responseCode === "650") {
          console.error("[Cardcom] Permission error - Low Profile API not enabled:", result);
          throw new Error("חשבון Cardcom לא מאושר להשתמש ב-Low Profile API. יש ליצור קשר עם Cardcom לשדרוג החשבון.");
        }
        
        console.error("[Cardcom] Failed to create products payment session:", result);
        throw new Error(description || "שגיאה ביצירת קישור תשלום");
      }

      console.log(`[Cardcom] Products payment session created: ${lowProfileCode}`);
      
      return {
        url,
        lowProfileCode,
      };
    } catch (error) {
      console.error("[Cardcom] Error creating products payment session:", error);
      throw error;
    }
  }

  /**
   * Verify webhook signature (if Cardcom sends signed webhooks)
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    try {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");

      // Remove 'sha256=' prefix if present
      const cleanSignature = signature.startsWith('sha256=') 
        ? signature.substring(7) 
        : signature;

      // Both buffers must be same length for timingSafeEqual
      if (cleanSignature.length !== expectedSignature.length) {
        return false;
      }

      return crypto.timingSafeEqual(
        Buffer.from(cleanSignature, "hex"),
        Buffer.from(expectedSignature, "hex")
      );
    } catch (error) {
      console.error("[Cardcom] Signature verification failed:", error);
      return false;
    }
  }

  /**
   * Parse webhook data from Cardcom
   */
  parseWebhookData(body: any): {
    dealId: string;
    customerId: string;
    packageId: string;
    amount: number;
    currency: string;
    cardcomTransactionId: string;
    status: "success" | "failed";
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    returnValue?: any;
  } | null {
    try {
      // Cardcom sends data in specific fields
      const dealId = body.DealResponseID || body.InternalDealID;
      const amount = parseFloat(body.SumToBill || "0");
      const cardcomTransactionId = body.InternalDealID;
      const responseCode = body.ResponseCode || body.ExtShvaParams?.code36;

      // Extract customer info from Cardcom fields
      const customerName = body.CustName || body.CustomerName;
      const customerPhone = body.CustMobilePH || body.CustomerPhone || body.CustPhone;
      const customerEmail = body.CustEmail || body.CustomerEmail;

      // Parse custom return value
      let customData = { customerId: "", packageId: "" };
      if (body.ReturnValue) {
        try {
          customData = JSON.parse(body.ReturnValue);
        } catch (e) {
          console.warn("[Cardcom] Could not parse ReturnValue:", body.ReturnValue);
        }
      }

      return {
        dealId,
        customerId: customData.customerId,
        packageId: customData.packageId,
        amount,
        currency: "ILS",
        cardcomTransactionId,
        status: responseCode === "0" ? "success" : "failed",
        customerName,
        customerPhone,
        customerEmail,
        returnValue: body.ReturnValue,
      };
    } catch (error) {
      console.error("[Cardcom] Error parsing webhook data:", error);
      return null;
    }
  }

  /**
   * Create invoice (for record-keeping)
   */
  async createInvoice(params: {
    customerName: string;
    customerEmail: string;
    items: Array<{
      description: string;
      price: number;
      quantity: number;
    }>;
  }): Promise<string | null> {
    if (!this.isConfigured || !this.config) {
      console.warn("[Cardcom] Cannot create invoice - service not configured");
      return null;
    }

    try {
      const formData = new URLSearchParams({
        TerminalNumber: this.config.terminalNumber,
        UserName: this.config.apiUsername,
        CustName: params.customerName,
        Email: params.customerEmail,
        SendByEmail: "true",
        Language: this.config.language,
      });

      // Add invoice lines
      params.items.forEach((item, index) => {
        formData.append(`InvoiceLines[${index}].Description`, item.description);
        formData.append(`InvoiceLines[${index}].Price`, item.price.toString());
        formData.append(`InvoiceLines[${index}].Quantity`, item.quantity.toString());
      });

      const response = await fetch(
        `${this.baseUrl}/Interface/CreateInvoice.aspx`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const result = await response.text();
      const responseParams = new URLSearchParams(result);
      const responseCode = responseParams.get("ResponseCode");
      const invoiceNumber = responseParams.get("InvoiceNumber");

      if (responseCode !== "0" || !invoiceNumber) {
        console.error("[Cardcom] Failed to create invoice:", result);
        return null;
      }

      console.log(`[Cardcom] Invoice created: ${invoiceNumber}`);
      return invoiceNumber;
    } catch (error) {
      console.error("[Cardcom] Error creating invoice:", error);
      return null;
    }
  }

  /**
   * Check if service is configured
   */
  isReady(): boolean {
    return this.isConfigured;
  }
}

// Export singleton instance
export const cardcomService = new CardcomService();
