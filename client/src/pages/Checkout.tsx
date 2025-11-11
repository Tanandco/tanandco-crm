import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Star, Check, Globe, Hand } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Logo from "@/components/Logo";

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
}

interface Customer {
  id: string;
  fullName: string;
  phone: string;
}

type Language = 'he' | 'en' | 'fr';

const translations = {
  he: {
    greeting: 'שלום',
    selectPackage: 'בחר את החבילה המתאימה לך',
    sessions: 'כניסות',
    session: 'כניסה',
    includesBronzer: 'כולל ברונזר',
    buyNow: 'לרכישה',
    creating: 'יוצר תשלום...',
    popular: 'הכי פופולרי',
    otherPackage: 'רוצה חבילה אחרת?',
    contactUs: 'צור קשר איתנו ב-WhatsApp ונעזור לך למצוא את החבילה המושלמת',
    whatsappContact: 'פנייה ב-WhatsApp',
    customerNotFound: 'לקוח לא נמצא',
    backHome: 'חזרה לדף הבית',
  },
  en: {
    greeting: 'Hello',
    selectPackage: 'Select Your Perfect Package',
    sessions: 'sessions',
    session: 'session',
    includesBronzer: 'Includes bronzer',
    buyNow: 'Buy Now',
    creating: 'Creating payment...',
    popular: 'Most Popular',
    otherPackage: 'Want a different package?',
    contactUs: 'Contact us on WhatsApp and we\'ll help you find the perfect package',
    whatsappContact: 'Contact on WhatsApp',
    customerNotFound: 'Customer not found',
    backHome: 'Back to Home',
  },
  fr: {
    greeting: 'Bonjour',
    selectPackage: 'Choisissez Votre Forfait Parfait',
    sessions: 'séances',
    session: 'séance',
    includesBronzer: 'Comprend un bronzeur',
    buyNow: 'Acheter',
    creating: 'Création du paiement...',
    popular: 'Le Plus Populaire',
    otherPackage: 'Vous voulez un autre forfait?',
    contactUs: 'Contactez-nous sur WhatsApp et nous vous aiderons à trouver le forfait parfait',
    whatsappContact: 'Contact sur WhatsApp',
    customerNotFound: 'Client non trouvé',
    backHome: 'Retour à l\'accueil',
  },
};

export default function Checkout() {
  const { customerId } = useParams<{ customerId: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [language, setLanguage] = useState<Language>('he');

  const t = translations[language];
  const dir = language === 'he' ? 'rtl' : 'ltr';

  const { data: customer, isLoading: customerLoading } = useQuery<Customer>({
    queryKey: ['/api/customers', customerId],
    enabled: !!customerId,
  });

  const { data: packages, isLoading: packagesLoading } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (packageId: string) => {
      const baseUrl = window.location.origin;
      const response = await apiRequest('POST', '/api/payments/cardcom/session', {
        customerId,
        packageId,
        successUrl: `${baseUrl}/payment-success`,
        errorUrl: `${baseUrl}/payment-error`,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: language === 'he' ? "שגיאה" : language === 'en' ? "Error" : "Erreur",
        description: error.message || (language === 'he' ? 'לא ניתן ליצור תשלום' : language === 'en' ? 'Cannot create payment' : 'Impossible de créer le paiement'),
        variant: "destructive",
      });
    },
  });

  if (customerLoading || packagesLoading) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin" style={{ 
          filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' 
        }} />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center gap-6" dir={dir}>
        <h2 className="text-3xl font-bold neon-text">{t.customerNotFound}</h2>
        <Button 
          onClick={() => navigate('/')} 
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          data-testid="button-back-home"
        >
          {t.backHome}
        </Button>
      </div>
    );
  }

  const sunBedPackages = packages?.filter(pkg => pkg.type === 'sun-beds') || [];

  return (
    <div className="min-h-screen bg-black text-white" dir={dir}>
      {/* Header with Logo and Language Selector */}
      <div className="flex items-center justify-between p-6 max-w-[1280px] mx-auto">
        <Logo size="large" />
        
        {/* Language Selector */}
        <div className="flex gap-2">
          {(['he', 'en', 'fr'] as Language[]).map((lang) => (
            <Button
              key={lang}
              onClick={() => setLanguage(lang)}
              variant={language === lang ? "default" : "outline"}
              className={
                language === lang 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-[0_0_20px_rgba(236,72,153,0.6)]' 
                  : ''
              }
              data-testid={`button-lang-${lang}`}
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-6 pb-12">
        {/* Greeting */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 neon-text flex items-center justify-center gap-3">
            {t.greeting} {customer.fullName}!
            <Hand className="w-12 h-12" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }} />
          </h1>
          <p className="text-2xl text-gray-300">
            {t.selectPackage}
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sunBedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`
                group relative 
                bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
                border-2 ${pkg.popular ? 'border-pink-500/60' : 'border-pink-500/20'}
                rounded-xl p-6
                transition-all duration-300
                hover-elevate active-elevate-2
                ${pkg.popular ? 'shadow-[0_0_30px_rgba(236,72,153,0.4)]' : ''}
              `}
              data-testid={`card-package-${pkg.id}`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 -right-3 z-10">
                  <div className="
                    bg-gradient-to-r from-pink-600 to-purple-600 
                    text-white px-4 py-1 rounded-full
                    shadow-[0_0_20px_rgba(236,72,153,0.6)]
                    flex items-center gap-1
                  ">
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
                      <span className="text-sm text-gray-300 text-right flex-1">{benefit}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Buy Button */}
              <Button
                onClick={() => createPaymentMutation.mutate(pkg.id)}
                disabled={createPaymentMutation.isPending}
                className="
                  w-full
                  bg-gradient-to-r from-pink-600 to-purple-600 
                  hover:from-pink-700 hover:to-purple-700
                  shadow-[0_0_20px_rgba(236,72,153,0.4)]
                  text-lg font-bold
                "
                data-testid={`button-buy-${pkg.id}`}
              >
                {createPaymentMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t.creating}
                  </>
                ) : (
                  t.buyNow
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Custom Package CTA */}
        <div className="max-w-3xl mx-auto">
          <div className="
            bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
            border-2 border-pink-500/20
            rounded-xl p-8
            text-center
          ">
            <h3 className="text-2xl font-bold mb-4 neon-text">{t.otherPackage}</h3>
            <p className="text-gray-300 mb-6">{t.contactUs}</p>
            <Button
              onClick={() => window.open(`https://wa.me/972${customer.phone.substring(1)}`, '_blank')}
              className="
                bg-green-600 hover:bg-green-700
                shadow-[0_0_20px_rgba(34,197,94,0.4)]
                font-bold
              "
              data-testid="button-whatsapp-contact"
            >
              <Globe className="w-5 h-5 mr-2" />
              {t.whatsappContact}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
