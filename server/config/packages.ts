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
    cardcomItemCode: "SINGLE"
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
    benefits: ['8 כניסות', '₪27.5 לכניסה', 'חבילה אישית - לא ניתן לשיתוף או העברה']
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
    benefits: ['10 כניסות + 3 במתנה', '₪23 לכניסה', 'חבילה אישית - לא ניתן לשיתוף או העברה'],
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
    benefits: ['3 כניסות + ברונזר']
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
    benefits: ['6 כניסות + ברונזר איכותי']
  },
  "most-profitable": {
    id: "most-profitable",
    nameHe: "⭐ הכי משתלם!",
    nameEn: "⭐ Best Deal!",
    type: "sun-beds",
    sessions: 10,
    price: 500,
    currency: "ILS",
    cardcomItemCode: "BEST",
    benefits: ['חבילת 10 כניסות', '10 כניסות + ברונזר איכותי']
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
