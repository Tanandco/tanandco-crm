import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Star, Check, Globe, Hand, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Package {
  id: string;
  nameHe: string;
  nameEn: string;
  type: string;
  sessions: number;
  price: number;
  currency: string;
  benefits?: string[];
  popular?: boolean;
  hasBronzer?: boolean;
  originalPrice?: number;
}

type Language = 'he' | 'en' | 'fr';

const translations = {
  he: {
    title: 'ברוכים הבאים ל-Tan & Co',
    subtitle: 'מכון שיזוף מקצועי עם הטכנולוגיה המתקדמת ביותר',
    selectPackage: 'בחר את החבילה המתאימה לך',
    sessions: 'כניסות',
    session: 'כניסה',
    includesBronzer: 'כולל ברונזר',
    buyNow: 'לרכישה',
    creating: 'יוצר תשלום...',
    popular: 'הכי פופולרי',
    enterPhone: 'הכנס מספר טלפון',
    phonePlaceholder: '050-1234567',
    continue: 'המשך',
    or: 'או',
    contactUs: 'צור קשר',
    whatsappContact: 'פנייה ב-WhatsApp',
    callUs: 'התקשר אלינו',
    emailUs: 'שלח מייל',
    visitUs: 'בוא לבקר',
    address: 'כתובת המכון',
    phone: 'טלפון',
    email: 'אימייל',
    allPackages: 'כל החבילות',
    sunBeds: 'מיטות שיזוף',
    sprayTan: 'התזה',
    massage: 'עיסוי',
    loading: 'טוען...',
  },
  en: {
    title: 'Welcome to Tan & Co',
    subtitle: 'Professional tanning salon with the most advanced technology',
    selectPackage: 'Select Your Perfect Package',
    sessions: 'sessions',
    session: 'session',
    includesBronzer: 'Includes bronzer',
    buyNow: 'Buy Now',
    creating: 'Creating payment...',
    popular: 'Most Popular',
    enterPhone: 'Enter phone number',
    phonePlaceholder: '050-1234567',
    continue: 'Continue',
    or: 'or',
    contactUs: 'Contact Us',
    whatsappContact: 'Contact on WhatsApp',
    callUs: 'Call Us',
    emailUs: 'Email Us',
    visitUs: 'Visit Us',
    address: 'Salon Address',
    phone: 'Phone',
    email: 'Email',
    allPackages: 'All Packages',
    sunBeds: 'Sun Beds',
    sprayTan: 'Spray Tan',
    massage: 'Massage',
    loading: 'Loading...',
  },
  fr: {
    title: 'Bienvenue à Tan & Co',
    subtitle: 'Salon de bronzage professionnel avec la technologie la plus avancée',
    selectPackage: 'Choisissez Votre Forfait Parfait',
    sessions: 'séances',
    session: 'séance',
    includesBronzer: 'Comprend un bronzeur',
    buyNow: 'Acheter',
    creating: 'Création du paiement...',
    popular: 'Le Plus Populaire',
    enterPhone: 'Entrez le numéro de téléphone',
    phonePlaceholder: '050-1234567',
    continue: 'Continuer',
    or: 'ou',
    contactUs: 'Contactez-nous',
    whatsappContact: 'Contact sur WhatsApp',
    callUs: 'Appelez-nous',
    emailUs: 'Envoyez un email',
    visitUs: 'Visitez-nous',
    address: 'Adresse du salon',
    phone: 'Téléphone',
    email: 'Email',
    allPackages: 'Tous les forfaits',
    sunBeds: 'Lits de bronzage',
    sprayTan: 'Bronzage en spray',
    massage: 'Massage',
    loading: 'Chargement...',
  },
};

export default function Landing() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [language, setLanguage] = useState<Language>('he');
  const [phone, setPhone] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const t = translations[language];
  const dir = language === 'he' ? 'rtl' : 'ltr';

  const { data: packages, isLoading: packagesLoading } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
  });

  // Create customer and proceed to checkout
  const createCustomerMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      const normalizedPhone = normalizePhone(phoneNumber);
      
      // Check if customer exists by searching
      let customerId: string;
      
      try {
        const searchResponse = await apiRequest('GET', `/api/customers/search/${normalizedPhone}`);
        const searchResult = await searchResponse.json();
        
        // Find exact phone match
        const existingCustomer = searchResult.data?.find((c: any) => c.phone === normalizedPhone);
        
        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          // Create new customer
          const createResponse = await apiRequest('POST', '/api/customers', {
            fullName: `לקוח ${normalizedPhone.slice(-4)}`,
            phone: normalizedPhone,
            isNewClient: true,
            healthFormSigned: false,
          });
          const newCustomer = await createResponse.json();
          customerId = newCustomer.data.id;
        }
      } catch (error) {
        // If search fails, try to create new customer
        const createResponse = await apiRequest('POST', '/api/customers', {
          fullName: `לקוח ${normalizedPhone.slice(-4)}`,
          phone: normalizedPhone,
          isNewClient: true,
          healthFormSigned: false,
        });
        const newCustomer = await createResponse.json();
        customerId = newCustomer.data.id;
      }
      
      return customerId;
    },
    onSuccess: (customerId) => {
      if (selectedPackage) {
        navigate(`/checkout/${customerId}`);
      } else {
        navigate(`/checkout/${customerId}`);
      }
    },
    onError: (error: any) => {
      toast({
        title: language === 'he' ? "שגיאה" : language === 'en' ? "Error" : "Erreur",
        description: error.message || (language === 'he' ? 'לא ניתן ליצור לקוח' : language === 'en' ? 'Cannot create customer' : 'Impossible de créer le client'),
        variant: "destructive",
      });
    },
  });

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowPhoneInput(true);
  };

  const handleContinue = () => {
    if (!phone.trim()) {
      toast({
        title: language === 'he' ? "שגיאה" : language === 'en' ? "Error" : "Erreur",
        description: language === 'he' ? 'אנא הכנס מספר טלפון' : language === 'en' ? 'Please enter phone number' : 'Veuillez entrer le numéro de téléphone',
        variant: "destructive",
      });
      return;
    }
    createCustomerMutation.mutate(phone);
  };

  const normalizePhone = (phone: string): string => {
    let normalized = phone.replace(/\D/g, '');
    if (normalized.startsWith('972')) {
      normalized = '0' + normalized.substring(3);
    } else if (!normalized.startsWith('0')) {
      normalized = '0' + normalized;
    }
    return normalized;
  };

  if (packagesLoading) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center" dir={dir}>
        <Loader2 className="w-16 h-16 animate-spin" style={{ 
          filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' 
        }} />
      </div>
    );
  }

  const allPackages = packages || [];
  const sunBedPackages = allPackages.filter(pkg => pkg.type === 'sun-beds');
  const sprayTanPackages = allPackages.filter(pkg => pkg.type === 'spray-tan');
  const massagePackages = allPackages.filter(pkg => pkg.type === 'massage');

  return (
    <div className="min-h-screen bg-black text-white" dir={dir}>
      {/* Header with Language Selector */}
      <div className="flex items-center justify-between p-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold neon-text">Tan & Co</h1>
        </div>
        <div className="flex gap-2">
          {(['he', 'en', 'fr'] as Language[]).map((lang) => (
            <Button
              key={lang}
              onClick={() => setLanguage(lang)}
              variant={language === lang ? "default" : "outline"}
              size="sm"
              className={
                language === lang 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-[0_0_20px_rgba(236,72,153,0.6)]' 
                  : ''
              }
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-6 py-12 text-center">
        <h1 className="text-6xl font-bold mb-4 neon-text flex items-center justify-center gap-3">
          {t.title}
          <Hand className="w-16 h-16" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }} />
        </h1>
        <p className="text-2xl text-gray-300 mb-8">
          {t.subtitle}
        </p>
      </div>

      {/* Phone Input Modal */}
      {showPhoneInput && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir={dir}>
          <div className="bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-2 border-pink-500/40 rounded-xl p-8 max-w-md w-full shadow-[0_0_40px_rgba(236,72,153,0.4)]">
            <h3 className="text-2xl font-bold mb-4 neon-text text-center">{t.enterPhone}</h3>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              className="mb-4 text-lg h-14 bg-gray-800/50 border-pink-500/30 focus:border-pink-500"
              dir="ltr"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleContinue}
                disabled={createCustomerMutation.isPending}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 h-14 text-lg"
              >
                {createCustomerMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t.creating}
                  </>
                ) : (
                  t.continue
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowPhoneInput(false);
                  setSelectedPackage(null);
                }}
                variant="outline"
                className="h-14"
              >
                ביטול
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 pb-12">
        <h2 className="text-4xl font-bold mb-8 neon-text text-center">
          {t.selectPackage}
        </h2>

        {/* Sun Beds Packages */}
        {sunBedPackages.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-6 text-pink-400">{t.sunBeds}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sunBedPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  language={language}
                  t={t}
                  onSelect={() => handlePackageSelect(pkg.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Spray Tan Packages */}
        {sprayTanPackages.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-6 text-purple-400">{t.sprayTan}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sprayTanPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  language={language}
                  t={t}
                  onSelect={() => handlePackageSelect(pkg.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Massage Packages */}
        {massagePackages.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-6 text-blue-400">{t.massage}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {massagePackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  language={language}
                  t={t}
                  onSelect={() => handlePackageSelect(pkg.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2 border-pink-500/20 rounded-xl p-8">
            <h3 className="text-3xl font-bold mb-6 neon-text text-center">{t.contactUs}</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Button
                onClick={() => window.open('https://wa.me/972501234567', '_blank')}
                className="bg-green-600 hover:bg-green-700 h-16 text-lg"
              >
                <Globe className="w-5 h-5 mr-2" />
                {t.whatsappContact}
              </Button>
              <Button
                onClick={() => window.open('tel:+972501234567', '_blank')}
                variant="outline"
                className="h-16 text-lg border-pink-500/30 hover:bg-pink-500/10"
              >
                <Phone className="w-5 h-5 mr-2" />
                {t.callUs}
              </Button>
              <Button
                onClick={() => window.open('mailto:info@tanandco.co.il', '_blank')}
                variant="outline"
                className="h-16 text-lg border-pink-500/30 hover:bg-pink-500/10"
              >
                <Mail className="w-5 h-5 mr-2" />
                {t.emailUs}
              </Button>
            </div>
            <div className="mt-6 text-center text-gray-400">
              <MapPin className="w-5 h-5 inline mr-2" />
              <span>{t.address}: כתובת המכון, תל אביב</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PackageCardProps {
  pkg: Package;
  language: Language;
  t: typeof translations.he;
  onSelect: () => void;
}

function PackageCard({ pkg, language, t, onSelect }: PackageCardProps) {
  return (
    <div
      className={`
        group relative 
        bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
        border-2 ${pkg.popular ? 'border-pink-500/60' : 'border-pink-500/20'}
        rounded-xl p-6
        transition-all duration-300
        hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]
        ${pkg.popular ? 'shadow-[0_0_30px_rgba(236,72,153,0.4)]' : ''}
      `}
    >
      {/* Popular Badge */}
      {pkg.popular && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-1 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.6)] flex items-center gap-1">
            <Star className="w-4 h-4" fill="currentColor" />
            <span className="text-sm font-bold">{t.popular}</span>
          </div>
        </div>
      )}

      {/* Package Title */}
      <h3 className="text-2xl font-bold mb-2 neon-text text-center">
        {language === 'he' ? pkg.nameHe : pkg.nameEn}
      </h3>
      
      {/* Sessions */}
      <p className="text-gray-400 text-center mb-6">
        {pkg.sessions} {pkg.sessions === 1 ? t.session : t.sessions}
      </p>

      {/* Price */}
      <div className="text-center mb-6">
        {pkg.originalPrice && pkg.originalPrice > pkg.price && (
          <div className="text-lg text-gray-500 line-through mb-2">
            ₪{pkg.originalPrice}
          </div>
        )}
        <div className="text-5xl font-bold neon-text">
          ₪{pkg.price}
        </div>
        {pkg.hasBronzer && (
          <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">{t.includesBronzer}</span>
          </div>
        )}
      </div>

      {/* Benefits */}
      {pkg.benefits && pkg.benefits.length > 0 && (
        <div className="space-y-2 mb-6">
          {pkg.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-300 flex-1">{benefit}</span>
            </div>
          ))}
        </div>
      )}

      {/* Buy Button */}
      <Button
        onClick={onSelect}
        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-[0_0_20px_rgba(236,72,153,0.4)] text-lg font-bold h-12"
      >
        {t.buyNow}
      </Button>
    </div>
  );
}

