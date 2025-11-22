/**
 * POS Service - Cash Drawer & Receipt Printer Integration
 * שירות קופה - מדפת מזומן והדפסת קבלות
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface CashDrawerConfig {
  type: 'escpos' | 'usb' | 'serial' | 'network';
  port?: string; // COM port, USB path, or network address
  vendorId?: string; // USB vendor ID
  productId?: string; // USB product ID
}

interface ReceiptData {
  transactionId: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax?: number;
  total: number;
  paymentMethod: string;
  change?: number;
  date: Date;
}

class POSService {
  private config: CashDrawerConfig | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const drawerType = process.env.CASH_DRAWER_TYPE || 'escpos';
    const drawerPort = process.env.CASH_DRAWER_PORT; // COM3, /dev/ttyUSB0, etc.
    const printerInterface = process.env.PRINTER_INTERFACE; // POS-80, etc.

    if (!drawerPort && drawerType !== 'network') {
      console.warn('[POS] Cash drawer not configured - missing CASH_DRAWER_PORT');
      this.isConfigured = false;
      return;
    }

    this.config = {
      type: drawerType as 'escpos' | 'usb' | 'serial' | 'network',
      port: drawerPort,
      vendorId: process.env.CASH_DRAWER_VENDOR_ID,
      productId: process.env.CASH_DRAWER_PRODUCT_ID,
    };

    this.isConfigured = true;
    console.log(`[POS] Cash drawer initialized: ${drawerType} on ${drawerPort || 'network'}`);
  }

  /**
   * Open cash drawer
   * פתיחת מדפת מזומן
   */
  async openCashDrawer(): Promise<boolean> {
    if (!this.isConfigured || !this.config) {
      console.warn('[POS] Cannot open drawer - not configured');
      return false;
    }

    try {
      switch (this.config.type) {
        case 'escpos':
          return await this.openDrawerESCPOS();
        case 'usb':
          return await this.openDrawerUSB();
        case 'serial':
          return await this.openDrawerSerial();
        case 'network':
          return await this.openDrawerNetwork();
        default:
          console.error('[POS] Unknown drawer type:', this.config.type);
          return false;
      }
    } catch (error: any) {
      console.error('[POS] Error opening cash drawer:', error);
      return false;
    }
  }

  /**
   * Open drawer using ESC/POS commands (most common)
   */
  private async openDrawerESCPOS(): Promise<boolean> {
    if (!this.config?.port) {
      return false;
    }

    try {
      // ESC/POS command to open cash drawer: ESC p m t1 t2
      // m = 0 (pin 2) or 1 (pin 5), t1 = pulse time (0-255), t2 = off time (0-255)
      const openDrawerCommand = Buffer.from([0x1B, 0x70, 0x00, 0x19, 0xFF]);

      // For Windows COM port
      if (process.platform === 'win32' && this.config.port.startsWith('COM')) {
        // Use node-serialport or similar library
        // For now, we'll use a simple approach with PowerShell
        const psCommand = `
          $port = new-Object System.IO.Ports.SerialPort ${this.config.port}, 9600, None, 8, one
          $port.Open()
          $port.Write([byte[]](0x1B, 0x70, 0x00, 0x19, 0xFF), 0, 5)
          $port.Close()
        `;
        await execAsync(`powershell -Command "${psCommand}"`);
        console.log('[POS] Cash drawer opened via ESC/POS (Windows COM)');
        return true;
      }

      // For Linux serial port
      if (process.platform === 'linux' && this.config.port.startsWith('/dev/')) {
        const fs = require('fs');
        const fd = fs.openSync(this.config.port, 'w');
        fs.writeSync(fd, openDrawerCommand);
        fs.closeSync(fd);
        console.log('[POS] Cash drawer opened via ESC/POS (Linux serial)');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('[POS] ESC/POS drawer open failed:', error);
      return false;
    }
  }

  /**
   * Open drawer via USB (HID)
   */
  private async openDrawerUSB(): Promise<boolean> {
    // Would require node-hid or similar library
    console.warn('[POS] USB drawer opening not yet implemented');
    return false;
  }

  /**
   * Open drawer via serial port
   */
  private async openDrawerSerial(): Promise<boolean> {
    return await this.openDrawerESCPOS(); // Similar to ESC/POS
  }

  /**
   * Open drawer via network printer
   */
  private async openDrawerNetwork(): Promise<boolean> {
    const printerIP = process.env.PRINTER_IP || '192.168.1.100';
    const printerPort = process.env.PRINTER_PORT || '9100';

    try {
      const openDrawerCommand = Buffer.from([0x1B, 0x70, 0x00, 0x19, 0xFF]);
      
      const net = require('net');
      const client = new net.Socket();
      
      return new Promise((resolve) => {
        client.connect(parseInt(printerPort), printerIP, () => {
          client.write(openDrawerCommand);
          client.end();
          console.log(`[POS] Cash drawer opened via network (${printerIP}:${printerPort})`);
          resolve(true);
        });

        client.on('error', (error) => {
          console.error('[POS] Network drawer open failed:', error);
          resolve(false);
        });

        setTimeout(() => {
          client.destroy();
          resolve(false);
        }, 5000);
      });
    } catch (error: any) {
      console.error('[POS] Network drawer open failed:', error);
      return false;
    }
  }

  /**
   * Print receipt
   * הדפסת קבלה
   */
  async printReceipt(receiptData: ReceiptData): Promise<boolean> {
    if (!this.isConfigured || !this.config) {
      console.warn('[POS] Cannot print receipt - not configured');
      return false;
    }

    try {
      const receiptText = this.formatReceipt(receiptData);
      const receiptBuffer = Buffer.from(receiptText, 'utf8');

      // For Windows COM port
      if (process.platform === 'win32' && this.config.port?.startsWith('COM')) {
        const psCommand = `
          $port = new-Object System.IO.Ports.SerialPort ${this.config.port}, 9600, None, 8, one
          $port.Open()
          $port.Write([System.Text.Encoding]::UTF8.GetBytes('${receiptText.replace(/'/g, "''")}'))
          $port.Close()
        `;
        await execAsync(`powershell -Command "${psCommand}"`);
        console.log('[POS] Receipt printed (Windows COM)');
        return true;
      }

      // For Linux serial port
      if (process.platform === 'linux' && this.config.port?.startsWith('/dev/')) {
        const fs = require('fs');
        const fd = fs.openSync(this.config.port, 'w');
        fs.writeSync(fd, receiptBuffer);
        fs.closeSync(fd);
        console.log('[POS] Receipt printed (Linux serial)');
        return true;
      }

      // For network printer
      if (this.config.type === 'network') {
        const printerIP = process.env.PRINTER_IP || '192.168.1.100';
        const printerPort = process.env.PRINTER_PORT || '9100';

        const net = require('net');
        const client = new net.Socket();
        
        return new Promise((resolve) => {
          client.connect(parseInt(printerPort), printerIP, () => {
            client.write(receiptBuffer);
            client.end();
            console.log(`[POS] Receipt printed via network (${printerIP}:${printerPort})`);
            resolve(true);
          });

          client.on('error', (error) => {
            console.error('[POS] Network print failed:', error);
            resolve(false);
          });

          setTimeout(() => {
            client.destroy();
            resolve(false);
          }, 10000);
        });
      }

      return false;
    } catch (error: any) {
      console.error('[POS] Error printing receipt:', error);
      return false;
    }
  }

  /**
   * Format receipt text
   */
  private formatReceipt(data: ReceiptData): string {
    const ESC = '\x1B';
    const RESET = `${ESC}@`;
    const BOLD_ON = `${ESC}E\x01`;
    const BOLD_OFF = `${ESC}E\x00`;
    const CENTER = `${ESC}a\x01`;
    const LEFT = `${ESC}a\x00`;
    const CUT = `${ESC}i`;

    const dateStr = data.date.toLocaleString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    let receipt = RESET;
    receipt += `${CENTER}${BOLD_ON}Tan & Co${BOLD_OFF}\n`;
    receipt += `${CENTER}רחוב הברזל 11, תל אביב\n`;
    receipt += `${CENTER}טל: 03-1234567\n`;
    receipt += `${LEFT}${'='.repeat(42)}\n`;
    receipt += `${LEFT}${BOLD_ON}קבלה #${data.transactionId.slice(0, 8)}${BOLD_OFF}\n`;
    receipt += `${LEFT}תאריך: ${dateStr}\n`;
    receipt += `${LEFT}לקוח: ${data.customerName}\n`;
    receipt += `${LEFT}${'='.repeat(42)}\n`;
    receipt += `${LEFT}${BOLD_ON}פרטי רכישה:${BOLD_OFF}\n`;

    for (const item of data.items) {
      const itemLine = `${item.name} x${item.quantity}`;
      const priceLine = `₪${item.total.toFixed(2)}`;
      receipt += `${LEFT}${itemLine.padEnd(30)}${priceLine.padStart(12)}\n`;
    }

    receipt += `${LEFT}${'='.repeat(42)}\n`;
    receipt += `${LEFT}${BOLD_ON}סה"כ:${BOLD_OFF} ${'₪' + data.total.toFixed(2).padStart(10)}\n`;
    
    if (data.tax) {
      receipt += `${LEFT}מע"מ: ${'₪' + data.tax.toFixed(2).padStart(10)}\n`;
    }

    receipt += `${LEFT}אמצעי תשלום: ${data.paymentMethod}\n`;
    
    if (data.change && data.change > 0) {
      receipt += `${LEFT}עודף: ${'₪' + data.change.toFixed(2).padStart(10)}\n`;
    }

    receipt += `${LEFT}${'='.repeat(42)}\n`;
    receipt += `${CENTER}${BOLD_ON}תודה על רכישתך!${BOLD_OFF}\n`;
    receipt += `${CENTER}שיזוף נעים! 🌞\n`;
    receipt += `\n\n\n${CUT}`;

    return receipt;
  }

  /**
   * Check if service is configured
   */
  isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Test drawer connection
   */
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured) {
      return false;
    }

    try {
      return await this.openCashDrawer();
    } catch (error) {
      console.error('[POS] Connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const posService = new POSService();

