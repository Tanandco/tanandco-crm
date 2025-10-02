import Logo from '@/components/Logo';
import AnimatedBook from '@/components/AnimatedBook';
import ZenCarousel from '@/components/ZenCarousel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sun, AlertTriangle, CheckCircle, XCircle, UserPlus, Search, Shield, ShoppingCart, Sparkles, Clock, Store, Bot } from 'lucide-react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';

interface SunBedsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SunBedsDialog({ open, onOpenChange }: SunBedsDialogProps) {
  const [, navigate] = useLocation();

  // Fetch bed bronzer products
  const { data: bedBronzers } = useQuery<any[]>({
    queryKey: ['/api/products', { tanningType: 'bed-bronzer' }],
    queryFn: async () => {
      const res = await fetch(`/api/products?tanningType=bed-bronzer`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch bed bronzers');
      return res.json();
    },
    enabled: open,
  });

  // Transform bed bronzer products for carousel
  const bronzerProducts = bedBronzers?.filter(p => p.is_featured || p.isFeatured).map((p) => ({
    id: p.id,
    name: p.name_he || p.nameHe || p.name,
    price: parseFloat(p.sale_price || p.salePrice || p.price),
    image: p.images?.[0] || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80',
    images: p.images || [],
    category: p.brand && p.brand !== 'OTHER' ? p.brand : 'ברונזר',
    description: p.description_he || p.descriptionHe || p.description,
    badge: p.badge,
    bronzerStrength: p.bronzer_strength || p.bronzerStrength,
  })) || [];

  const packages = [
    {
      id: 'single',
      title: 'כניסה בודדת',
      subtitle: 'כניסה אחת',
      price: 70,
      pricePerSession: null,
      features: [],
      isPersonal: true,
      testId: 'package-single'
    },
    {
      id: '8-sessions',
      title: 'כרטיסיית 8 כניסות',
      subtitle: '',
      price: 220,
      pricePerSession: 27.5,
      features: [],
      isPersonal: true,
      testId: 'package-8'
    },
    {
      id: 'home',
      title: 'כרטיסיית הבית',
      subtitle: 'החבילה המשתלמת ביותר!',
      price: 300,
      pricePerSession: 15,
      features: ['20 כניסות', 'כולל ברונזר בית', 'תוקף 12 חודשים'],
      isPersonal: true,
      isHighlighted: true,
      testId: 'package-home'
    },
  ];

  const sharedPackages = [
    {
      id: 'small-shared',
      title: 'ככה בקטנה',
      subtitle: '8 כניסות',
      price: 220,
      pricePerSession: 27.5,
      features: ['ניתן לשיתוף', 'תוקף 12 חודשים'],
      testId: 'package-small-shared'
    },
    {
      id: 'beginners',
      title: 'בול למתחילים',
      subtitle: '12 כניסות',
      price: 360,
      pricePerSession: 30,
      features: ['ניתן לשיתוף', 'תוקף 12 חודשים'],
      testId: 'package-beginners'
    },
    {
      id: 'best-value',
      title: 'הולכים על בטוח',
      subtitle: '20 כניסות',
      price: 400,
      pricePerSession: 20,
      features: ['ניתן לשיתוף', 'תוקף 12 חודשים', 'המחיר הכי משתלם לכניסה'],
      isHighlighted: true,
      testId: 'package-best-value'
    },
  ];

  const dos = [
    'להתחיל עם זמני חשיפה קצרים ולהגדיל בהדרגה',
    'להשתמש בקרם הגנה מתאים לסוג העור שלכם',
    'להסיר תכשיטים וקוסמטיקה לפני השיזוף',
    'להשתמש במשקפי מגן מיוחדים',
    'לשתות הרבה מים לפני ואחרי השיזוף',
    'להקפיד על הפסקה של 48 שעות בין שיזופים',
  ];

  const donts = [
    'לא להיחשף לשמש באותו יום בו עושים שיזוף מלאכותי',
    'לא להשתזף אם אתם נוטלים תרופות רגישות לאור',
    'לא להשתזף במהלך הריון או הנקה',
    'לא להסיר את משקפי המגן במהלך השיזוף',
    'לא להשתזף אם יש לכם פצעים או כוויות פתוחות',
    'לא להגזים בזמני החשיפה',
  ];

  const handleActionClick = (action: string) => {
    if (action === 'new-customer') {
      onOpenChange(false);
      navigate('/onboarding');
    } else if (action === 'search-customer') {
      // TODO: implement search
      console.log('Search customer clicked');
    } else if (action === 'register-247') {
      onOpenChange(false);
      navigate('/face-registration');
    } else if (action === 'purchase-packages') {
      // Scroll to packages section - keep dialog open
      setTimeout(() => {
        document.getElementById('packages-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (action === 'shop') {
      onOpenChange(false);
      navigate('/shop');
    } else if (action === 'ai-tan') {
      // TODO: implement AI TAN
      console.log('AI TAN clicked');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[95vw] w-full h-[95vh] max-h-[95vh] p-0 bg-black border-pink-500/30 overflow-hidden"
        data-testid="sun-beds-dialog"
      >
        <DialogTitle className="sr-only">מיטות שיזוף - מידע, מחירים וחבילות</DialogTitle>
        <DialogDescription className="sr-only">
          מידע על שירותי מיטות השיזוף, הנחיות בטיחות, מחירי חבילות אישיות ומשפחתיות, ומוצרי ברונזר
        </DialogDescription>
        <div className="h-full overflow-y-auto overflow-x-hidden relative" dir="rtl">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"
            style={{ 
              animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />
          
          <div className="container mx-auto px-6 py-6 max-w-6xl relative z-10">
            {/* Logo */}
            <div className="mb-4">
              <Logo size="small" showGlow={true} showUnderline={false} />
            </div>
            
            {/* Navigation Buttons */}
            <div className="fixed top-6 left-6 right-6 z-50 flex justify-between pointer-events-none">
              {/* Back Button */}
              <button
                className="
                  pointer-events-auto
                  group relative w-12 h-12
                  bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
                  border border-gray-500/60 hover:border-gray-400/80
                  rounded-lg backdrop-blur-sm
                  flex items-center justify-center
                  transition-all duration-300 ease-in-out
                  hover:scale-105 active:scale-95
                  hover-elevate active-elevate-2
                "
                style={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => onOpenChange(false)}
                data-testid="button-back-nav"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-white group-hover:text-pink-400 transition-colors duration-300"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
                  }}
                >
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>

              {/* Home Button */}
              <button
                className="
                  pointer-events-auto
                  group relative w-12 h-12
                  bg-gradient-to-br from-pink-900/90 via-purple-900/80 to-pink-900/90
                  border border-pink-500/60 hover:border-pink-400/80
                  rounded-lg backdrop-blur-sm
                  flex items-center justify-center
                  transition-all duration-300 ease-in-out
                  hover:scale-105 active:scale-95
                  hover-elevate active-elevate-2
                "
                style={{
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => {
                  onOpenChange(false);
                  navigate('/');
                }}
                data-testid="button-home-nav"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-white group-hover:text-pink-300 transition-colors duration-300"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.5))'
                  }}
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </button>
            </div>

            {/* Main Title */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3">
                <Sun className="w-10 h-10 text-pink-400" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />
                <h1 
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  data-testid="title-sun-beds"
                >
                  מיטות שיזוף
                </h1>
              </div>
            </div>

            {/* Animated Book */}
            <AnimatedBook />

            {/* Action Buttons */}
            <div className="mb-8">
              <h2 
                className="text-2xl font-bold text-center mb-4 text-pink-300"
                data-testid="title-actions"
              >
                בחרו את הפעולה המתאימה
              </h2>

              <div className="grid grid-cols-3 gap-3 max-w-5xl mx-auto">
                <Button
                  onClick={() => handleActionClick('new-customer')}
                  className="h-auto py-4 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 border border-pink-500/50 flex flex-col gap-2"
                  data-testid="button-new-customer"
                >
                  <UserPlus className="w-6 h-6" />
                  <span className="text-sm font-medium">לקוח חדש - הרשמה</span>
                </Button>

                <Button
                  onClick={() => handleActionClick('search-customer')}
                  className="h-auto py-4 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border border-blue-500/50 flex flex-col gap-2"
                  data-testid="button-search-customer"
                >
                  <Search className="w-6 h-6" />
                  <span className="text-sm font-medium">חיפוש משתזף קיים</span>
                </Button>

                <Button
                  onClick={() => handleActionClick('register-247')}
                  className="h-auto py-4 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border border-purple-500/50 flex flex-col gap-2"
                  data-testid="button-register-247"
                >
                  <Clock className="w-6 h-6" />
                  <span className="text-sm font-medium">הרשמה לשירותי 24/7</span>
                </Button>

                <Button
                  onClick={() => handleActionClick('purchase-packages')}
                  className="h-auto py-4 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 border border-amber-500/50 flex flex-col gap-2"
                  data-testid="button-purchase-packages"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-sm font-medium">רכישה / חידוש חבילות</span>
                </Button>

                <Button
                  onClick={() => handleActionClick('shop')}
                  className="h-auto py-4 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border border-emerald-500/50 flex flex-col gap-2"
                  data-testid="button-shop"
                >
                  <Store className="w-6 h-6" />
                  <span className="text-sm font-medium">החנות שלכם</span>
                </Button>

                <Button
                  onClick={() => handleActionClick('ai-tan')}
                  className="h-auto py-4 px-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 border border-violet-500/50 flex flex-col gap-2"
                  data-testid="button-ai-tan"
                >
                  <Bot className="w-6 h-6" />
                  <span className="text-sm font-medium">AI TAN</span>
                </Button>
              </div>
            </div>

            {/* Packages Section */}
            <div id="packages-section" className="mb-8">
              <h2 
                className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                data-testid="title-packages"
              >
                מחירון כרטיסיות
              </h2>

              {/* Personal Packages */}
              <div className="mb-6">
                <h3 
                  className="text-xl font-bold text-pink-300 mb-3 text-center"
                  data-testid="title-personal-packages"
                >
                  חבילות אישיות (לא ניתן להעברה)
                </h3>
                
                <div className="grid md:grid-cols-3 gap-3 max-w-4xl mx-auto mb-3">
                  {packages.map((pkg) => (
                    <Card 
                      key={pkg.id}
                      className={`p-4 ${pkg.isHighlighted 
                        ? 'bg-gradient-to-br from-pink-900/40 to-purple-900/40 border-pink-500/50 ring-2 ring-pink-500/30' 
                        : 'bg-slate-900/60 border-slate-700/50'
                      }`}
                      data-testid={pkg.testId}
                    >
                      <h4 className="text-lg font-bold text-pink-200 mb-1">{pkg.title}</h4>
                      {pkg.subtitle && (
                        <p className="text-xs text-pink-300/70 mb-2">{pkg.subtitle}</p>
                      )}
                      <div className="text-2xl font-bold text-white mb-2">₪{pkg.price}</div>
                      {pkg.pricePerSession && (
                        <div className="text-sm text-pink-200/70 mb-2">
                          (₪{pkg.pricePerSession} לכניסה)
                        </div>
                      )}
                      {pkg.features.length > 0 && (
                        <ul className="space-y-1">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="text-xs text-pink-100/80 flex items-start gap-1">
                              <span className="text-pink-400">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Card>
                  ))}
                </div>

                <p className="text-xs text-pink-200/60 text-center max-w-2xl mx-auto" data-testid="personal-package-note">
                  * כרטיסיות אישיות בתוקף 12 חודשים מיום הרכישה ואינן ניתנות להעברה לאדם אחר
                </p>
              </div>

              {/* Shared Packages */}
              <div>
                <h3 
                  className="text-xl font-bold text-cyan-300 mb-3 text-center"
                  data-testid="title-shared-packages"
                >
                  חבילות לשיתוף (ניתן להעברה)
                </h3>
                
                <div className="grid md:grid-cols-3 gap-3 max-w-4xl mx-auto mb-3">
                  {sharedPackages.map((pkg) => (
                    <Card 
                      key={pkg.id}
                      className={`p-4 ${pkg.isHighlighted 
                        ? 'bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-500/50 ring-2 ring-cyan-500/30' 
                        : 'bg-slate-900/60 border-slate-700/50'
                      }`}
                      data-testid={pkg.testId}
                    >
                      <h4 className="text-lg font-bold text-cyan-200 mb-1">{pkg.title}</h4>
                      {pkg.subtitle && (
                        <p className="text-xs text-cyan-300/70 mb-2">{pkg.subtitle}</p>
                      )}
                      <div className="text-2xl font-bold text-white mb-2">₪{pkg.price}</div>
                      {pkg.pricePerSession && (
                        <div className="text-sm text-cyan-200/70 mb-2">
                          (₪{pkg.pricePerSession} לכניסה)
                        </div>
                      )}
                      {pkg.features.length > 0 && (
                        <ul className="space-y-1">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="text-xs text-cyan-100/80 flex items-start gap-1">
                              <span className="text-cyan-400">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Card>
                  ))}
                </div>

                <p className="text-xs text-cyan-200/60 text-center max-w-2xl mx-auto" data-testid="shared-package-note">
                  * חבילות משותפות ניתנות להעברה בין בני משפחה וחברים
                </p>
              </div>
            </div>

            {/* Bronzers Carousel */}
            {bronzerProducts.length > 0 && (
              <div className="mb-8">
                <h2 
                  className="text-2xl font-bold text-center mb-4 text-pink-300"
                  data-testid="title-bronzers"
                >
                  הברונזרים שלנו
                </h2>
                <div data-testid="bronzers-carousel">
                  <ZenCarousel products={bronzerProducts} />
                </div>
              </div>
            )}

            {/* Important Notice */}
            <div 
              className="max-w-3xl mx-auto p-4 rounded-lg bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 border border-orange-500/30"
              data-testid="important-notice"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-orange-300 mb-1">חשוב לדעת</h3>
                  <p className="text-sm text-orange-100/90 leading-relaxed">
                    לפני השימוש הראשון במיטת השיזוף, חשוב לעבור ייעוץ אישי עם אחד מאנשי הצוות המקצועי שלנו. 
                    נקבע יחד את תוכנית השיזוף המתאימה לך ונוודא שאת/ה מקבל/ת את התוצאות הטובות ביותר בצורה בטוחה.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
