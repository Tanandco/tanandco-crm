export interface Package {
  id: string;
  nameHe: string;
  nameEn: string;
  type: string; // membership type: 'sun-beds', 'spray-tan', etc.
  sessions: number;
  price: number;
  currency: string;
  cardcomItemCode?: string; // Cardcom product code
  description?: string;
  descriptionHe?: string;
  benefits?: string[]; // Package benefits
  originalPrice?: number; // Original price for discount display
  popular?: boolean; // Popular package badge
  hasBronzer?: boolean; // Includes bronzer product
}

export const packagesCatalog: Record<string, Package> = {
  // Sun Beds Packages
  "single-entry": {
    id: "single-entry",
    nameHe: "בודדת כניסה אחת",
    nameEn: "Single Entry",
    type: "sun-beds",
    sessions: 1,
    price: 70,
    currency: "ILS",
    cardcomItemCode: "SINGLE",
    benefits: ['באופן זמני מתאפשר להנות מהשירות 24/7']
  },
  "8-entries": {
    id: "8-entries",
    nameHe: "כרטיסיית 8 כניסות",
    nameEn: "8 Entries Card",
    type: "sun-beds",
    sessions: 8,
    price: 220,
    currency: "ILS",
    cardcomItemCode: "CARD8",
    benefits: ['חבילה אישית - לא ניתן לשיתוף או העברה']
  },
  "home-package": {
    id: "home-package",
    nameHe: "כרטיסיית הבית",
    nameEn: "Home Package",
    type: "sun-beds",
    sessions: 13,
    price: 300,
    currency: "ILS",
    cardcomItemCode: "HOME",
    benefits: ['10 כניסות + 3 במתנה', 'חבילה אישית - לא ניתן לשיתוף או העברה'],
    popular: true
  },
  "small-touch": {
    id: "small-touch",
    nameHe: "ככה בקטנה",
    nameEn: "Small Touch",
    type: "sun-beds",
    sessions: 3,
    price: 220,
    currency: "ILS",
    cardcomItemCode: "SMALL",
    hasBronzer: true,
    benefits: ['תוקף 12 חודשים', 'ניתן לשיתוף']
  },
  "beginners-package": {
    id: "beginners-package",
    nameHe: "חבילה למתחילים",
    nameEn: "Beginners Package",
    type: "sun-beds",
    sessions: 6,
    price: 360,
    currency: "ILS",
    cardcomItemCode: "BEGIN",
    hasBronzer: true,
    benefits: ['תוקף 12 חודשים', 'ניתן לשיתוף']
  },
  "most-profitable": {
    id: "most-profitable",
    nameHe: "חבילה בול",
    nameEn: "Bull's Eye Package",
    type: "sun-beds",
    sessions: 10,
    price: 500,
    currency: "ILS",
    cardcomItemCode: "BEST",
    hasBronzer: true,
    benefits: ['תוקף 12 חודשים', 'ניתן לשיתוף']
  },
  "monthly-unlimited": {
    id: "monthly-unlimited",
    nameHe: "חופשי חודשי",
    nameEn: "Monthly Unlimited",
    type: "sun-beds",
    sessions: 999,
    price: 350,
    currency: "ILS",
    cardcomItemCode: "MONTHLY_UNL",
    benefits: ['כניסות ללא הגבלה', 'תוקף חודש אחד', 'אישי - לא ניתן לשיתוף']
  },
  "yearly-unlimited": {
    id: "yearly-unlimited",
    nameHe: "חופשי שנתי",
    nameEn: "Yearly Unlimited",
    type: "sun-beds",
    sessions: 999,
    price: 2500,
    currency: "ILS",
    cardcomItemCode: "YEARLY_UNL",
    benefits: ['כניסות ללא הגבלה', 'תוקף שנה מלאה', 'אישי - לא ניתן לשיתוף'],
    popular: true
  },
};

export function getPackageById(packageId: string): Package | null {
  return packagesCatalog[packageId] || null;
}

export function getAllPackages(): Package[] {
  return Object.values(packagesCatalog);
}

export function getPackagesByType(type: string): Package[] {
  return Object.values(packagesCatalog).filter((pkg) => pkg.type === type);
}
