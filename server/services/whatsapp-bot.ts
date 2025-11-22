/**
 * WhatsApp Smart Bot Service
 * בוט WhatsApp חכם עם תחושה אנושית
 * מטפל בכל ניהול שירות לקוחות ומכירות
 */

import { whatsappService } from "./whatsapp-service";
import { cardcomService } from "./cardcom-service";
import { getPackageById, getAllPackages } from "../config/packages";
import type { IStorage } from "../storage";
import type { Customer, Membership, Transaction } from "../../shared/schema";

interface Intent {
  type: 'greeting' | 'balance' | 'packages' | 'purchase' | 'history' | 'help' | 'health' | 'face' | 'hours' | 'location' | 'price' | 'unknown';
  confidence: number;
  entities?: Record<string, any>;
}

class WhatsAppBot {
  constructor(private storage: IStorage) {}

  /**
   * זיהוי כוונה מההודעה
   */
  private detectIntent(message: string): Intent {
    const lowerMessage = message.toLowerCase().trim();
    
    // ברכות ופתיחות
    if (/\b(שלום|היי|הי|בוקר|ערב|לילה|מה נשמע|מה קורה|מה המצב)\b/.test(lowerMessage)) {
      return { type: 'greeting', confidence: 0.9 };
    }

    // בדיקת יתרה
    if (/\b(יתרה|יתרת|כמה נשאר|כמה כניסות|יתרת כניסות|יתרתי|יתרה שלי|יתרת כרטיסיה)\b/.test(lowerMessage)) {
      return { type: 'balance', confidence: 0.95 };
    }

    // חבילות ומחירים
    if (/\b(חבילות|חבילה|מחירים|מחיר|כמה עולה|מה המחיר|איזה חבילות|איזה חבילה|מה יש)\b/.test(lowerMessage)) {
      return { type: 'packages', confidence: 0.9 };
    }

    // רכישה
    if (/\b(לרכוש|לרכישה|לרכוש|לקנות|לקנות|אני רוצה|אני מעוניין|אני מעוניינת|אני רוצה לקנות|אני רוצה לרכוש)\b/.test(lowerMessage)) {
      return { type: 'purchase', confidence: 0.85 };
    }

    // היסטוריה
    if (/\b(היסטוריה|רכישות|קניות|מה קניתי|איזה חבילות|תאריכים|מתי)\b/.test(lowerMessage)) {
      return { type: 'history', confidence: 0.85 };
    }

    // טופס בריאות
    if (/\b(טופס בריאות|בריאות|הצהרת בריאות|טופס|למלא טופס)\b/.test(lowerMessage)) {
      return { type: 'health', confidence: 0.9 };
    }

    // רישום פנים
    if (/\b(רישום פנים|זיהוי פנים|פנים|להרשם|רישום|face|face id)\b/.test(lowerMessage)) {
      return { type: 'face', confidence: 0.9 };
    }

    // שעות פעילות
    if (/\b(שעות|מתי פתוח|מתי סגור|פתוח|סגור|שעות פעילות|מתי אפשר|מתי אתם)\b/.test(lowerMessage)) {
      return { type: 'hours', confidence: 0.9 };
    }

    // מיקום
    if (/\b(איפה|מיקום|כתובת|איך מגיעים|איך להגיע|להגיע|למצוא)\b/.test(lowerMessage)) {
      return { type: 'location', confidence: 0.9 };
    }

    // עזרה
    if (/\b(עזרה|מה אפשר|מה יש|מה אתם|מה אפשר לעשות|מה יש לכם|מה יש כאן)\b/.test(lowerMessage)) {
      return { type: 'help', confidence: 0.85 };
    }

    return { type: 'unknown', confidence: 0.1 };
  }

  /**
   * טיפול בהודעה נכנסת - הפונקציה הראשית
   */
  async handleMessage(phoneNumber: string, messageText: string): Promise<void> {
    try {
      const normalizedPhone = this.normalizePhone(phoneNumber);
      
      // מצא או צור לקוח
      let customer = await this.storage.getCustomerByPhone(normalizedPhone);
      
      if (!customer) {
        // לקוח חדש - צור אותו
        customer = await this.storage.createCustomer({
          fullName: `לקוח ${normalizedPhone.slice(-4)}`,
          phone: normalizedPhone,
          stage: 'lead_inbound',
          waOptIn: true,
          lastWhatsAppMsgAt: new Date(),
        });
        
        // שלח הודעת ברכה אישית
        await this.sendGreeting(customer);
        return;
      }

      // עדכן זמן הודעה אחרונה
      await this.storage.updateCustomer(customer.id, {
        lastWhatsAppMsgAt: new Date(),
      });

      // זהה כוונה
      const intent = this.detectIntent(messageText);
      
      // טיפול לפי כוונה
      switch (intent.type) {
        case 'greeting':
          await this.handleGreeting(customer);
          break;
        case 'balance':
          await this.handleBalance(customer);
          break;
        case 'packages':
          await this.handlePackages(customer);
          break;
        case 'purchase':
          await this.handlePurchase(customer, messageText);
          break;
        case 'history':
          await this.handleHistory(customer);
          break;
        case 'health':
          await this.handleHealthForm(customer);
          break;
        case 'face':
          await this.handleFaceRegistration(customer);
          break;
        case 'hours':
          await this.handleHours(customer);
          break;
        case 'location':
          await this.handleLocation(customer);
          break;
        case 'help':
          await this.handleHelp(customer);
          break;
        default:
          await this.handleUnknown(customer, messageText);
      }
    } catch (error: any) {
      console.error('[WhatsApp Bot] Error handling message:', error);
      // שלח הודעת שגיאה ידידותית
      await whatsappService.sendTextMessage(
        phoneNumber,
        'מצטער, הייתה בעיה קטנה. נסה שוב בעוד רגע או פנה אלינו בטלפון 😊'
      );
    }
  }

  /**
   * ברכה ראשונית ללקוח חדש
   */
  private async sendGreeting(customer: Customer): Promise<void> {
    const message = `שלום! 👋\n\nברוכים הבאים ל-Tan & Co!\n\nאני כאן לעזור לך עם כל מה שצריך:\n\n✨ בדיקת יתרת כניסות\n💳 רכישת חבילות\n📋 טופס בריאות\n👤 רישום זיהוי פנים\n📞 מידע על שעות פעילות\n📍 כתובת ומיקום\n\nמה תרצה לדעת? 😊`;
    
    await whatsappService.sendTextMessage(customer.phone, message);
  }

  /**
   * טיפול בברכות
   */
  private async handleGreeting(customer: Customer): Promise<void> {
    const greetings = [
      `שלום ${customer.fullName}! 👋\n\nאיך אפשר לעזור לך היום?`,
      `היי ${customer.fullName}! 😊\n\nמה תרצה לדעת?`,
      `שלום ${customer.fullName}! 🌞\n\nאני כאן לעזור - מה תרצה?`,
    ];
    
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    await whatsappService.sendTextMessage(customer.phone, greeting);
  }

  /**
   * בדיקת יתרה
   */
  private async handleBalance(customer: Customer): Promise<void> {
    const memberships = await this.storage.getMembershipsByCustomer(customer.id);
    const activeMemberships = memberships.filter(m => m.isActive && m.balance > 0);

    if (activeMemberships.length === 0) {
      const message = `שלום ${customer.fullName}! 👋\n\nכרגע אין לך כרטיסיה פעילה.\n\nרוצה לרכוש חבילה חדשה? פשוט כתוב "אני רוצה לרכוש" ואני אשלח לך את כל האפשרויות! 💳✨`;
      await whatsappService.sendTextMessage(customer.phone, message);
      return;
    }

    let message = `שלום ${customer.fullName}! 👋\n\nיתרת הכניסות שלך:\n\n`;
    
    for (const membership of activeMemberships) {
      const typeLabel = this.getMembershipTypeLabel(membership.type);
      const expiryInfo = membership.expiryDate 
        ? `\nתוקף עד: ${new Date(membership.expiryDate).toLocaleDateString('he-IL')}`
        : '';
      
      message += `✨ ${typeLabel}: ${membership.balance} כניסות${expiryInfo}\n\n`;
    }

    message += `רוצה לרכוש עוד? כתוב "אני רוצה לרכוש" 💳`;
    
    await whatsappService.sendTextMessage(customer.phone, message);
  }

  /**
   * הצגת חבילות
   */
  private async handlePackages(customer: Customer): Promise<void> {
    const packages = getAllPackages();
    const sunBedPackages = packages.filter(p => p.type === 'sun-beds');

    let message = `שלום ${customer.fullName}! 👋\n\nהחבילות שלנו למיטות שיזוף:\n\n`;

    for (const pkg of sunBedPackages.slice(0, 5)) {
      const popularBadge = pkg.popular ? '⭐ הכי פופולרי ' : '';
      const bronzerBadge = pkg.hasBronzer ? '✨ כולל ברונזר' : '';
      message += `${pkg.nameHe}${popularBadge ? ' ' + popularBadge : ''}\n`;
      message += `${pkg.sessions} כניסות - ₪${pkg.price}${bronzerBadge ? ' ' + bronzerBadge : ''}\n\n`;
    }

    message += `רוצה לרכוש? כתוב "אני רוצה לרכוש" ואני אשלח לך קישור! 💳✨`;
    
    await whatsappService.sendTextMessage(customer.phone, message);
  }

  /**
   * טיפול ברכישה
   */
  private async handlePurchase(customer: Customer, messageText: string): Promise<void> {
    // נסה לזהות איזו חבילה
    const packages = getAllPackages();
    let selectedPackage = null;

    // חיפוש לפי שם
    for (const pkg of packages) {
      if (messageText.includes(pkg.nameHe) || messageText.includes(pkg.nameEn)) {
        selectedPackage = pkg;
        break;
      }
    }

    if (selectedPackage) {
      // שלח קישור תשלום ישיר
      const baseUrl = process.env.FRONTEND_URL || 'https://crm.tanandco.co.il';
      const checkoutUrl = `${baseUrl}/checkout/${customer.id}`;
      
      const message = `מצוין! ${selectedPackage.nameHe} 🌞\n\n${selectedPackage.sessions} כניסות - ₪${selectedPackage.price}\n\nלחץ כאן לרכישה:\n${checkoutUrl}\n\nאחרי התשלום תקבל קישורים להשלמת ההרשמה! ✨`;
      
      await whatsappService.sendTextMessage(customer.phone, message);
    } else {
      // שלח קישור כללי
      const baseUrl = process.env.FRONTEND_URL || 'https://crm.tanandco.co.il';
      const checkoutUrl = `${baseUrl}/checkout/${customer.id}`;
      
      const message = `מצוין! 🌞\n\nלחץ כאן לראות את כל החבילות ולרכוש:\n${checkoutUrl}\n\nאחרי התשלום תקבל קישורים להשלמת ההרשמה! ✨`;
      
      await whatsappService.sendTextMessage(customer.phone, message);
    }
  }

  /**
   * היסטוריית רכישות
   */
  private async handleHistory(customer: Customer): Promise<void> {
    const transactions = await this.storage.getTransactionsByCustomer(customer.id);
    const completedTransactions = transactions.filter(t => t.status === 'completed');

    if (completedTransactions.length === 0) {
      const message = `שלום ${customer.fullName}! 👋\n\nעדיין לא ביצעת רכישות.\n\nרוצה לרכוש חבילה? כתוב "אני רוצה לרכוש" 💳`;
      await whatsappService.sendTextMessage(customer.phone, message);
      return;
    }

    let message = `שלום ${customer.fullName}! 👋\n\nהיסטוריית הרכישות שלך:\n\n`;

    // הצג 5 האחרונות
    const recent = completedTransactions.slice(0, 5);
    for (const transaction of recent) {
      const date = new Date(transaction.createdAt).toLocaleDateString('he-IL');
      const packageName = (transaction.metadata as any)?.packageName || 'חבילה';
      message += `📅 ${date}\n${packageName} - ₪${transaction.amount}\n\n`;
    }

    message += `סה"כ רכישות: ${completedTransactions.length}`;
    
    await whatsappService.sendTextMessage(customer.phone, message);
  }

  /**
   * טופס בריאות
   */
  private async handleHealthForm(customer: Customer): Promise<void> {
    if (customer.healthFormSigned) {
      const message = `שלום ${customer.fullName}! 👋\n\nכבר מילאת את טופס הבריאות ✅\n\nצריך משהו אחר?`;
      await whatsappService.sendTextMessage(customer.phone, message);
      return;
    }

    const baseUrl = process.env.FRONTEND_URL || 'https://crm.tanandco.co.il';
    const formUrl = `${baseUrl}/onboarding?customerId=${customer.id}&step=health`;

    const message = `שלום ${customer.fullName}! 👋\n\nכדי להתחיל להשתמש בשירותים, צריך למלא טופס בריאות.\n\nלחץ כאן למלא:\n${formUrl}\n\nזה לוקח רק דקה! ⏱️✨`;
    
    await whatsappService.sendTextMessage(customer.phone, message);
  }

  /**
   * רישום פנים
   */
  private async handleFaceRegistration(customer: Customer): Promise<void> {
    if (customer.faceRecognitionId) {
      const message = `שלום ${customer.fullName}! 👋\n\nכבר נרשמת לזיהוי פנים ✅\n\nעכשיו תוכל להיכנס אוטומטית! 🚪✨`;
      await whatsappService.sendTextMessage(customer.phone, message);
      return;
    }

    const baseUrl = process.env.FRONTEND_URL || 'https://crm.tanandco.co.il';
    const registrationUrl = `${baseUrl}/face-registration?customerId=${customer.id}`;

    const message = `שלום ${customer.fullName}! 👋\n\nרישום זיהוי פנים מאפשר לך להיכנס אוטומטית! 🚪✨\n\nלחץ כאן לרישום:\n${registrationUrl}\n\nזה לוקח רק דקה! ⏱️`;
    
    await whatsappService.sendTextMessage(customer.phone, message);
  }

  /**
   * שעות פעילות
   */
  private async handleHours(customer: Customer): Promise<void> {
    const message = `שלום ${customer.fullName}! 👋\n\nשעות הפעילות שלנו:\n\n🕐 ראשון - חמישי: 09:00 - 21:00\n🕐 שישי: 09:00 - 15:00\n🕐 שבת: 10:00 - 20:00\n\n✨ עם כרטיסיה פעילה תוכל להיכנס 24/7!\n\nצריך משהו אחר? 😊`;
    
    await whatsappService.sendTextMessage(customer.phone, message);
  }

  /**
   * מיקום
   */
  private async handleLocation(customer: Customer): Promise<void> {
    const address = process.env.BUSINESS_ADDRESS || 'כתובת המכון, תל אביב';
    const message = `שלום ${customer.fullName}! 👋\n\n📍 המיקום שלנו:\n\n${address}\n\nרוצה הנחיות GPS? כתוב "GPS" 🗺️`;
    
    await whatsappService.sendTextMessage(customer.phone, message);
  }

  /**
   * עזרה כללית
   */
  private async handleHelp(customer: Customer): Promise<void> {
    const message = `שלום ${customer.fullName}! 👋\n\nאני כאן לעזור! אפשר לשאול אותי:\n\n✨ "כמה כניסות נשארו" - בדיקת יתרה\n💳 "אני רוצה לרכוש" - רכישת חבילה\n📋 "טופס בריאות" - קישור לטופס\n👤 "רישום פנים" - קישור לרישום\n📅 "היסטוריה" - רכישות קודמות\n🕐 "שעות" - שעות פעילות\n📍 "איפה" - כתובת ומיקום\n\nמה תרצה לדעת? 😊`;
    
    await whatsappService.sendTextMessage(customer.phone, message);
  }

  /**
   * טיפול בהודעה לא מזוהה
   */
  private async handleUnknown(customer: Customer, messageText: string): Promise<void> {
    // נסה לזהות אם זה שאלה או בקשה
    const isQuestion = /\?|מה|איך|מתי|איפה|למה/.test(messageText);
    
    if (isQuestion) {
      const message = `שלום ${customer.fullName}! 👋\n\nאני לא בטוח שהבנתי בדיוק מה שאלת...\n\nאבל אני יכול לעזור עם:\n✨ בדיקת יתרה\n💳 רכישת חבילות\n📋 טופס בריאות\n👤 רישום פנים\n📅 היסטוריה\n🕐 שעות פעילות\n📍 מיקום\n\nאו פשוט כתוב "עזרה" ואני אסביר הכל! 😊`;
      await whatsappService.sendTextMessage(customer.phone, message);
    } else {
      const message = `שלום ${customer.fullName}! 👋\n\nאני לא בטוח שהבנתי...\n\nאבל אני כאן לעזור! כתוב "עזרה" ואני אסביר מה אפשר לעשות 😊`;
      await whatsappService.sendTextMessage(customer.phone, message);
    }
  }

  /**
   * תווית סוג כרטיסיה
   */
  private getMembershipTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'sun-beds': 'מיטות שיזוף',
      'spray-tan': 'שיזוף בהתזה',
      'hair-salon': 'מספרה',
      'massage': 'עיסוי',
    };
    return labels[type] || type;
  }

  /**
   * נרמול מספר טלפון
   */
  private normalizePhone(phone: string): string {
    let normalized = phone.replace(/\D/g, '');
    if (normalized.startsWith('972')) {
      normalized = '0' + normalized.substring(3);
    } else if (!normalized.startsWith('0')) {
      normalized = '0' + normalized;
    }
    return normalized;
  }
}

// Export singleton instance - will be initialized in routes.ts
let whatsappBotInstance: WhatsAppBot | null = null;

export function initWhatsAppBot(storage: IStorage): WhatsAppBot {
  if (!whatsappBotInstance) {
    whatsappBotInstance = new WhatsAppBot(storage);
  }
  return whatsappBotInstance;
}

export function getWhatsAppBot(): WhatsAppBot {
  if (!whatsappBotInstance) {
    throw new Error('WhatsApp Bot not initialized. Call initWhatsAppBot first.');
  }
  return whatsappBotInstance;
}

