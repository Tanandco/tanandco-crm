/**
 * Max Payment Gateway Service
 * אינטגרציה עם מקס - רכישות פיזיות בקופה
 * 
 * Max היא חברת הסליקה הפיזית במסוף אשראי
 * שונה מ-Cardcom שמשמש לרכישות אונליין
 */

interface MaxConfig {
  terminalId: string;
  merchantId: string;
  apiKey: string;
  apiSecret: string;
  environment: 'production' | 'sandbox';
}

interface MaxPaymentRequest {
  amount: number;
  currency: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  description: string;
  packageId?: string;
  transactionType: 'charge' | 'refund';
}

interface MaxPaymentResponse {
  success: boolean;
  transactionId?: string;
  approvalCode?: string;
  errorCode?: string;
  errorMessage?: string;
  receipt?: string;
}

interface MaxWebhookData {
  transactionId: string;
  customerId: string;
  packageId?: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'cancelled';
  approvalCode?: string;
  receiptNumber?: string;
  timestamp: string;
}

class MaxService {
  private config: MaxConfig | null = null;
  private isConfigured: boolean = false;
  private baseUrl: string;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const terminalId = process.env.MAX_TERMINAL_ID;
    const merchantId = process.env.MAX_MERCHANT_ID;
    const apiKey = process.env.MAX_API_KEY;
    const apiSecret = process.env.MAX_API_SECRET;
    const environment = (process.env.MAX_ENVIRONMENT || 'production') as 'production' | 'sandbox';

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
      environment,
    };

    // Set base URL based on environment
    this.baseUrl = environment === 'production'
      ? 'https://api.max.co.il' // Update with actual Max API URL
      : 'https://sandbox.max.co.il'; // Update with actual Max sandbox URL

    this.isConfigured = true;
    console.log("[Max] Service initialized successfully");
  }

  /**
   * Process physical payment at POS terminal
   * תהליך תשלום פיזי במסוף אשראי
   */
  async processPhysicalPayment(request: MaxPaymentRequest): Promise<MaxPaymentResponse> {
    if (!this.isConfigured || !this.config) {
      console.warn("[Max] Cannot process payment - service not configured");
      return {
        success: false,
        errorMessage: "Max service not configured",
      };
    }

    try {
      // Max API typically requires:
      // 1. Terminal ID
      // 2. Amount
      // 3. Currency
      // 4. Transaction type
      // 5. Signature/Authentication

      const payload = {
        TerminalID: this.config.terminalId,
        MerchantID: this.config.merchantId,
        Amount: request.amount.toFixed(2),
        Currency: request.currency,
        TransactionType: request.transactionType === 'charge' ? '01' : '04', // Charge or Refund
        Description: request.description,
        CustomerName: request.customerName,
        CustomerPhone: request.customerPhone,
        ReferenceNumber: `${request.customerId}_${Date.now()}`,
        Metadata: JSON.stringify({
          customerId: request.customerId,
          packageId: request.packageId,
        }),
      };

      // Generate signature for authentication
      const signature = this.generateSignature(payload);

      const response = await fetch(`${this.baseUrl}/api/v1/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-Signature': signature,
          'X-Merchant-ID': this.config.merchantId,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result.StatusCode !== '000') {
        console.error('[Max] Payment failed:', result);
        return {
          success: false,
          errorCode: result.StatusCode || result.ErrorCode,
          errorMessage: result.ErrorMessage || result.Message || 'תשלום נכשל',
        };
      }

      console.log(`[Max] Payment processed successfully: ${result.TransactionID}`);

      return {
        success: true,
        transactionId: result.TransactionID,
        approvalCode: result.ApprovalCode,
        receipt: result.ReceiptNumber,
      };
    } catch (error: any) {
      console.error('[Max] Error processing payment:', error);
      return {
        success: false,
        errorMessage: error.message || 'שגיאה בעיבוד התשלום',
      };
    }
  }

  /**
   * Generate signature for API authentication
   */
  private generateSignature(payload: any): string {
    const crypto = require('crypto');
    
    // Create signature string (order matters)
    const signatureString = [
      this.config!.terminalId,
      this.config!.merchantId,
      payload.Amount,
      payload.Currency,
      payload.ReferenceNumber,
      this.config!.apiSecret,
    ].join('|');

    // Generate HMAC SHA256
    const signature = crypto
      .createHmac('sha256', this.config!.apiSecret)
      .update(signatureString)
      .digest('hex');

    return signature.toUpperCase();
  }

  /**
   * Verify webhook signature from Max
   */
  verifyWebhookSignature(payload: any, signature: string): boolean {
    if (!this.isConfigured || !this.config) {
      return false;
    }

    try {
      const crypto = require('crypto');
      
      // Create signature string from payload
      const signatureString = [
        payload.TransactionID,
        payload.Amount,
        payload.Currency,
        payload.StatusCode,
        this.config.apiSecret,
      ].join('|');

      const expectedSignature = crypto
        .createHmac('sha256', this.config.apiSecret)
        .update(signatureString)
        .digest('hex')
        .toUpperCase();

      return signature.toUpperCase() === expectedSignature;
    } catch (error) {
      console.error('[Max] Signature verification failed:', error);
      return false;
    }
  }

  /**
   * Parse webhook data from Max
   */
  parseWebhookData(body: any): MaxWebhookData | null {
    try {
      // Parse metadata if exists
      let metadata = { customerId: '', packageId: '' };
      if (body.Metadata) {
        try {
          metadata = JSON.parse(body.Metadata);
        } catch (e) {
          console.warn('[Max] Could not parse Metadata:', body.Metadata);
        }
      }

      const status = body.StatusCode === '000' ? 'success' : 'failed';

      return {
        transactionId: body.TransactionID || body.TransactionId,
        customerId: metadata.customerId || body.CustomerID || '',
        packageId: metadata.packageId || body.PackageID,
        amount: parseFloat(body.Amount || '0'),
        currency: body.Currency || 'ILS',
        status,
        approvalCode: body.ApprovalCode,
        receiptNumber: body.ReceiptNumber,
        timestamp: body.Timestamp || new Date().toISOString(),
      };
    } catch (error) {
      console.error('[Max] Error parsing webhook data:', error);
      return null;
    }
  }

  /**
   * Process refund (if needed)
   */
  async processRefund(transactionId: string, amount: number): Promise<MaxPaymentResponse> {
    if (!this.isConfigured || !this.config) {
      return {
        success: false,
        errorMessage: "Max service not configured",
      };
    }

    try {
      const payload = {
        TerminalID: this.config.terminalId,
        MerchantID: this.config.merchantId,
        OriginalTransactionID: transactionId,
        Amount: amount.toFixed(2),
        Currency: 'ILS',
        TransactionType: '04', // Refund
      };

      const signature = this.generateSignature(payload);

      const response = await fetch(`${this.baseUrl}/api/v1/payments/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-Signature': signature,
          'X-Merchant-ID': this.config.merchantId,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result.StatusCode !== '000') {
        return {
          success: false,
          errorCode: result.StatusCode,
          errorMessage: result.ErrorMessage || 'החזר נכשל',
        };
      }

      return {
        success: true,
        transactionId: result.TransactionID,
        approvalCode: result.ApprovalCode,
      };
    } catch (error: any) {
      console.error('[Max] Error processing refund:', error);
      return {
        success: false,
        errorMessage: error.message || 'שגיאה בעיבוד ההחזר',
      };
    }
  }

  /**
   * Check if service is configured
   */
  isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Get terminal status
   */
  async getTerminalStatus(): Promise<{ online: boolean; lastSync?: string }> {
    if (!this.isConfigured || !this.config) {
      return { online: false };
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/terminal/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-Merchant-ID': this.config.merchantId,
        },
      });

      if (!response.ok) {
        return { online: false };
      }

      const result = await response.json();
      return {
        online: result.Online || false,
        lastSync: result.LastSync,
      };
    } catch (error) {
      console.error('[Max] Error checking terminal status:', error);
      return { online: false };
    }
  }
}

// Export singleton instance
export const maxService = new MaxService();

