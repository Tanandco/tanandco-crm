/**
 * Max Credit Card Terminal Service
 * Integration with Max payment terminal for physical card processing
 */

import crypto from 'crypto';

interface MaxConfig {
  terminalId: string;
  merchantId: string;
  apiKey: string;
  apiSecret: string;
  baseUrl?: string;
}

interface MaxPaymentRequest {
  amount: number;
  currency?: string;
  description?: string;
  referenceId?: string;
  customerName?: string;
  customerPhone?: string;
}

interface MaxPaymentResponse {
  success: boolean;
  transactionId?: string;
  approvalCode?: string;
  cardLast4?: string;
  cardBrand?: string;
  error?: string;
  errorCode?: string;
}

class MaxService {
  private config: MaxConfig | null = null;
  private isConfigured: boolean = false;
  private baseUrl: string = "https://api.max.co.il"; // Update with actual Max API URL

  constructor() {
    this.initialize();
  }

  private initialize() {
    const terminalId = process.env.MAX_TERMINAL_ID;
    const merchantId = process.env.MAX_MERCHANT_ID;
    const apiKey = process.env.MAX_API_KEY;
    const apiSecret = process.env.MAX_API_SECRET;

    if (!terminalId || !merchantId || !apiKey || !apiSecret) {
      console.warn(
        "[Max] Service not configured - missing MAX_TERMINAL_ID, MAX_MERCHANT_ID, MAX_API_KEY, or MAX_API_SECRET"
      );
      this.isConfigured = false;
      return;
    }

    this.config = {
      terminalId,
      merchantId,
      apiKey,
      apiSecret,
      baseUrl: process.env.MAX_API_URL || this.baseUrl,
    };

    this.isConfigured = true;
    console.log("[Max] Service initialized successfully");
  }

  /**
   * Process a payment through Max terminal
   * This would typically trigger the physical terminal to process the payment
   */
  async processPayment(params: MaxPaymentRequest): Promise<MaxPaymentResponse> {
    if (!this.isConfigured || !this.config) {
      console.warn("[Max] Cannot process payment - service not configured");
      return {
        success: false,
        error: "Max service not configured",
        errorCode: "NOT_CONFIGURED",
      };
    }

    try {
      // Generate authentication token
      const authToken = this.generateAuthToken();

      // Prepare payment request
      const paymentData = {
        terminalId: this.config.terminalId,
        merchantId: this.config.merchantId,
        amount: params.amount,
        currency: params.currency || "ILS",
        description: params.description || "POS Sale",
        referenceId: params.referenceId || `POS_${Date.now()}`,
        customerName: params.customerName,
        customerPhone: params.customerPhone,
      };

      // Send payment request to Max API
      const response = await fetch(`${this.config.baseUrl}/api/v1/payments/charge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
          "X-API-Key": this.config.apiKey,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[Max] Payment failed:", errorData);
        return {
          success: false,
          error: errorData.message || "Payment processing failed",
          errorCode: errorData.code || "PAYMENT_FAILED",
        };
      }

      const result = await response.json();

      // Parse Max API response
      if (result.status === "approved" || result.status === "success") {
        return {
          success: true,
          transactionId: result.transactionId || result.id,
          approvalCode: result.approvalCode || result.authCode,
          cardLast4: result.cardLast4 || result.maskedCard,
          cardBrand: result.cardBrand || result.cardType,
        };
      } else {
        return {
          success: false,
          error: result.message || "Payment was declined",
          errorCode: result.errorCode || "DECLINED",
        };
      }
    } catch (error: any) {
      console.error("[Max] Error processing payment:", error);
      return {
        success: false,
        error: error.message || "Failed to process payment",
        errorCode: "PROCESSING_ERROR",
      };
    }
  }

  /**
   * Generate authentication token for Max API
   * Implementation depends on Max API authentication method
   */
  private generateAuthToken(): string {
    // This is a placeholder - actual implementation depends on Max API
    // Common methods: JWT, HMAC, OAuth, etc.
    const timestamp = Date.now();
    const message = `${this.config!.apiKey}${this.config!.apiSecret}${timestamp}`;
    
    // If Max uses HMAC-SHA256:
    const signature = crypto
      .createHmac('sha256', this.config!.apiSecret)
      .update(message)
      .digest('hex');
    
    return `${this.config!.apiKey}:${signature}:${timestamp}`;
  }

  /**
   * Verify payment status
   */
  async verifyPayment(transactionId: string): Promise<MaxPaymentResponse> {
    if (!this.isConfigured || !this.config) {
      return {
        success: false,
        error: "Max service not configured",
        errorCode: "NOT_CONFIGURED",
      };
    }

    try {
      const authToken = this.generateAuthToken();

      const response = await fetch(
        `${this.config.baseUrl}/api/v1/payments/${transactionId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "X-API-Key": this.config.apiKey,
          },
        }
      );

      if (!response.ok) {
        return {
          success: false,
          error: "Failed to verify payment",
          errorCode: "VERIFY_FAILED",
        };
      }

      const result = await response.json();

      if (result.status === "approved" || result.status === "success") {
        return {
          success: true,
          transactionId: result.transactionId || result.id,
          approvalCode: result.approvalCode || result.authCode,
          cardLast4: result.cardLast4 || result.maskedCard,
          cardBrand: result.cardBrand || result.cardType,
        };
      } else {
        return {
          success: false,
          error: result.message || "Payment verification failed",
          errorCode: result.errorCode || "VERIFY_FAILED",
        };
      }
    } catch (error: any) {
      console.error("[Max] Error verifying payment:", error);
      return {
        success: false,
        error: error.message || "Failed to verify payment",
        errorCode: "VERIFY_ERROR",
      };
    }
  }

  /**
   * Cancel/Refund a payment
   */
  async refundPayment(transactionId: string, amount?: number): Promise<MaxPaymentResponse> {
    if (!this.isConfigured || !this.config) {
      return {
        success: false,
        error: "Max service not configured",
        errorCode: "NOT_CONFIGURED",
      };
    }

    try {
      const authToken = this.generateAuthToken();

      const refundData: any = {
        transactionId,
      };
      if (amount) {
        refundData.amount = amount;
      }

      const response = await fetch(
        `${this.config.baseUrl}/api/v1/payments/refund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
            "X-API-Key": this.config.apiKey,
          },
          body: JSON.stringify(refundData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || "Refund failed",
          errorCode: errorData.code || "REFUND_FAILED",
        };
      }

      const result = await response.json();

      if (result.status === "approved" || result.status === "success") {
        return {
          success: true,
          transactionId: result.transactionId || result.id,
        };
      } else {
        return {
          success: false,
          error: result.message || "Refund was declined",
          errorCode: result.errorCode || "REFUND_DECLINED",
        };
      }
    } catch (error: any) {
      console.error("[Max] Error refunding payment:", error);
      return {
        success: false,
        error: error.message || "Failed to process refund",
        errorCode: "REFUND_ERROR",
      };
    }
  }
}

export const maxService = new MaxService();
export default maxService;

