import { whatsappService } from "./whatsapp-service";
import type { IStorage } from "../storage";
import type { Customer, Membership } from "../../shared/schema";

/**
 * WhatsApp Management Service - Handle customer interactions via WhatsApp
 */
class WhatsAppManagementService {
  constructor(private storage: IStorage) {}

  /**
   * Process incoming WhatsApp message and respond appropriately
   */
  async processMessage(phoneNumber: string, messageText: string): Promise<void> {
    try {
      const normalizedPhone = this.normalizePhone(phoneNumber);
      const customer = await this.storage.getCustomerByPhone(normalizedPhone);

      if (!customer) {
        // New customer - send welcome message
        await whatsappService.sendTextMessage(
          phoneNumber,
          "שלום! ברוכים הבאים ל-Tan & Co 🌞\n\nלהזמנת כרטיסיה, לחץ על הקישור:\n[קישור תשלום]"
        );
        return;
      }

      // Normalize message text
      const normalizedMessage = messageText.trim().toLowerCase();

      // Check for commands
      if (this.isBalanceQuery(normalizedMessage)) {
        await this.handleBalanceQuery(customer);
      } else if (this.isUpdateRequest(normalizedMessage)) {
        await this.handleUpdateRequest(customer, messageText);
      } else if (this.isMembershipQuery(normalizedMessage)) {
        await this.handleMembershipQuery(customer);
      } else if (this.isHelpRequest(normalizedMessage)) {
        await this.handleHelpRequest(customer);
      } else {
        // Default response
        await this.handleDefaultResponse(customer);
      }
    } catch (error) {
      console.error("[WhatsApp Management] Error processing message:", error);
    }
  }

  /**
   * Check if message is a balance query
   */
  private isBalanceQuery(message: string): boolean {
    const balanceKeywords = ['יתרה', 'יתרות', 'כמה נשאר', 'כמה כניסות', 'balance', 'יתרה שלי'];
    return balanceKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Handle balance query
   */
  private async handleBalanceQuery(customer: Customer): Promise<void> {
    try {
      const memberships = await this.storage.getMembershipsByCustomer(customer.id);
      const activeMemberships = memberships.filter(m => m.isActive && m.balance > 0);

      if (activeMemberships.length === 0) {
        await whatsappService.sendTextMessage(
          customer.phone,
          `שלום ${customer.fullName}!\n\nאין לך כרטיסיות פעילות כרגע.\n\nלהזמנת כרטיסיה חדשה, לחץ כאן:\n[קישור תשלום]`
        );
        return;
      }

      let message = `שלום ${customer.fullName}! 🌞\n\nיתרות הכרטיסיות שלך:\n\n`;
      
      for (const membership of activeMemberships) {
        const typeLabel = this.getMembershipTypeLabel(membership.type);
        const expiryInfo = membership.expiryDate 
          ? `\nתוקף עד: ${new Date(membership.expiryDate).toLocaleDateString('he-IL')}`
          : '';
        
        message += `📋 ${typeLabel}\nיתרה: ${membership.balance} כניסות${expiryInfo}\n\n`;
      }

      message += `להזמנת כרטיסיה נוספת, לחץ כאן:\n[קישור תשלום]`;

      await whatsappService.sendTextMessage(customer.phone, message);
    } catch (error) {
      console.error("[WhatsApp Management] Error handling balance query:", error);
    }
  }

  /**
   * Check if message is an update request
   */
  private isUpdateRequest(message: string): boolean {
    const updateKeywords = ['עדכן', 'שנה', 'עדכון', 'update', 'change'];
    return updateKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Handle update request
   */
  private async handleUpdateRequest(customer: Customer, messageText: string): Promise<void> {
    await whatsappService.sendTextMessage(
      customer.phone,
      `שלום ${customer.fullName}!\n\nלעדכון פרטים, אנא צור קשר עם הצוות בטלפון או דרך האתר.\n\nפרטים נוכחיים:\nשם: ${customer.fullName}\nטלפון: ${customer.phone}${customer.email ? `\nאימייל: ${customer.email}` : ''}`
    );
  }

  /**
   * Check if message is a membership query
   */
  private isMembershipQuery(message: string): boolean {
    const membershipKeywords = ['כרטיסיה', 'כרטיסיות', 'חבילה', 'membership', 'card'];
    return membershipKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Handle membership query
   */
  private async handleMembershipQuery(customer: Customer): Promise<void> {
    try {
      const memberships = await this.storage.getMembershipsByCustomer(customer.id);
      const activeMemberships = memberships.filter(m => m.isActive && m.balance > 0);

      if (activeMemberships.length === 0) {
        await whatsappService.sendTextMessage(
          customer.phone,
          `שלום ${customer.fullName}!\n\nאין לך כרטיסיות פעילות כרגע.\n\nלהזמנת כרטיסיה חדשה, לחץ כאן:\n[קישור תשלום]`
        );
        return;
      }

      let message = `שלום ${customer.fullName}! 🌞\n\nכרטיסיות פעילות:\n\n`;
      
      for (const membership of activeMemberships) {
        const typeLabel = this.getMembershipTypeLabel(membership.type);
        message += `📋 ${typeLabel}\nיתרה: ${membership.balance}/${membership.totalPurchased} כניסות\n`;
        
        if (membership.expiryDate) {
          const expiryDate = new Date(membership.expiryDate);
          const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          message += `תוקף: ${daysLeft > 0 ? `${daysLeft} ימים` : 'פג תוקף'}\n`;
        }
        
        message += '\n';
      }

      await whatsappService.sendTextMessage(customer.phone, message);
    } catch (error) {
      console.error("[WhatsApp Management] Error handling membership query:", error);
    }
  }

  /**
   * Check if message is a help request
   */
  private isHelpRequest(message: string): boolean {
    const helpKeywords = ['עזרה', 'help', 'מידע', 'מה אפשר', 'איך'];
    return helpKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Handle help request
   */
  private async handleHelpRequest(customer: Customer): Promise<void> {
    const helpMessage = `שלום ${customer.fullName}! 🌞\n\nאני כאן לעזור לך:\n\n` +
      `📋 "יתרה" - בדיקת יתרת כניסות\n` +
      `📋 "כרטיסיה" - מידע על כרטיסיות\n` +
      `📋 "עדכן" - עדכון פרטים\n` +
      `📋 "עזרה" - הצגת הודעה זו\n\n` +
      `להזמנת כרטיסיה חדשה, לחץ כאן:\n[קישור תשלום]`;

    await whatsappService.sendTextMessage(customer.phone, helpMessage);
  }

  /**
   * Handle default response
   */
  private async handleDefaultResponse(customer: Customer): Promise<void> {
    const baseUrl = process.env.APP_BASE_URL || "http://localhost:5000";
    const checkoutUrl = `${baseUrl}/checkout/${customer.id}`;

    await whatsappService.sendTextMessage(
      customer.phone,
      `שלום ${customer.fullName}! 🌞\n\nאיך אפשר לעזור?\n\n` +
      `📋 "יתרה" - בדיקת יתרה\n` +
      `📋 "כרטיסיה" - מידע על כרטיסיות\n` +
      `📋 "עזרה" - רשימת פקודות\n\n` +
      `להזמנת כרטיסיה: ${checkoutUrl}`
    );
  }

  /**
   * Get membership type label in Hebrew
   */
  private getMembershipTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'sun-beds': 'מיטות שיזוף',
      'spray-tan': 'שיזוף בהתזה',
      'hair-salon': 'מספרה',
      'cosmetics': 'קוסמטיקה',
    };
    return labels[type] || type;
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

export { WhatsAppManagementService };

