import Logo from '@/components/Logo';
import ZenCarousel from '@/components/ZenCarousel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sun, AlertTriangle, CheckCircle, XCircle, UserPlus, Search, Shield, ShoppingCart, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';

export default function SunBeds() {
  const [, navigate] = useLocation();

  // Fetch bed bronzer products
  const { data: bedBronzers, isLoading } = useQuery<any[]>({
    queryKey: ['/api/products', { tanningType: 'bed-bronzer' }],
    queryFn: async () => {
      const res = await fetch(`/api/products?tanningType=bed-bronzer`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch bed bronzers');
      return res.json();
    },
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
      subtitle: '10 כניסות + 3 במתנה',
      price: 300,
      pricePerSession: 23,
      features: ['+ ברונזר'],
      isPersonal: true,
      highlight: true,
      testId: 'package-home'
    }
  ];

  const sharedPackages = [
    {
      id: 'small',
      title: 'ככה בקטנה',
      subtitle: '3 כניסות + ברונזר איכותי',
      price: 220,
      features: [],
      isPersonal: false,
      testId: 'package-small-shared'
    },
    {
      id: 'beginners',
      title: 'בול למתחילים',
      subtitle: '6 כניסות + ברונזר איכותי',
      price: 360,
      features: [],
      isPersonal: false,
      testId: 'package-beginners'
    },
    {
      id: 'best-value',
      title: 'הולכים על בטוח',
      subtitle: 'הכי משתלם - 10 כניסות + ברונזר איכותי',
      price: 400,
      features: [],
      isPersonal: false,
      highlight: true,
      testId: 'package-best-value'
    }
  ];

  const actionButtons = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: 'לקוח חדש - הרשמה',
      subtitle: 'הצהרת בריאות + זיהוי פנים',
      onClick: () => navigate('/onboarding'),
      color: 'from-pink-500 to-purple-500',
      testId: 'button-new-customer'
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: 'חיפוש משתזף קיים',
      subtitle: 'סימון כרטיסיה קיימת',
      onClick: () => {/* TODO: implement search */},
      color: 'from-purple-500 to-blue-500',
      testId: 'button-search-customer'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'הרשמה לשירותי 24/7',
      subtitle: 'כניסה עצמאית בכל שעה',
      onClick: () => navigate('/face-registration'),
      color: 'from-blue-500 to-cyan-500',
      testId: 'button-register-247'
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: 'רכישה / חידוש חבילות',
      subtitle: 'צפו במחירון ובחרו חבילה',
      onClick: () => {
        const element = document.getElementById('packages-section');
        element?.scrollIntoView({ behavior: 'smooth' });
      },
      color: 'from-cyan-500 to-pink-500',
      testId: 'button-purchase-packages'
    }
  ];

  const dosList = [
    'התחילו עם זמנים קצרים והעלו בהדרגה',
    'שתו הרבה מים לפני ואחרי',
    'השתמשו בברונזר איכותי',
    'הסירו תכשיטים וקוסמטיקה',
    'הגנו על העיניים עם משקפי UV',
    'המתינו 48 שעות בין פעמים'
  ];

  const dontsList = [
    'אל תשתזפו אם העור שלכם שרוף או מגורה',
    'אל תשתמשו בשמנים לא מיועדים',
    'אל תעלו על הזמן המומלץ',
    'אל תשתזפו תחת תרופות המגבירות רגישות',
    'אל תשתזפו אם יש לכם פצעים פתוחים',
    'אל תשתזפו בהריון ללא אישור רופא'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 overflow-auto" dir="rtl">
      {/* Header with Back Button */}
      <div className="absolute top-4 right-4 z-[100]">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="border-pink-500/50 hover:border-pink-500 gap-2"
          data-testid="button-back"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה
        </Button>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Logo */}
        <div className="mb-6">
          <Logo size="small" showGlow={true} showUnderline={true} />
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sun 
              className="text-pink-400" 
              size={48}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))'
              }}
            />
            <h1 
              className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.4))'
              }}
              data-testid="title-sun-beds"
            >
              מיטות שיזוף
            </h1>
          </div>
        </div>

        {/* Introduction - Animated */}
        <div className="mb-12 max-w-3xl mx-auto">
          <style>{`
            @keyframes fadeInSlide {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes glowPulse {
              0%, 100% {
                box-shadow: 
                  0 0 20px rgba(236, 72, 153, 0.3),
                  0 0 40px rgba(168, 85, 247, 0.2),
                  inset 0 0 20px rgba(236, 72, 153, 0.1);
                border-color: rgba(236, 72, 153, 0.4);
              }
              50% {
                box-shadow: 
                  0 0 30px rgba(236, 72, 153, 0.6),
                  0 0 60px rgba(168, 85, 247, 0.4),
                  inset 0 0 30px rgba(236, 72, 153, 0.2);
                border-color: rgba(236, 72, 153, 0.8);
              }
            }

            @keyframes shimmer {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }

            @keyframes iconBounce {
              0%, 100% {
                transform: translateY(0) scale(1);
              }
              50% {
                transform: translateY(-10px) scale(1.1);
              }
            }

            .introduction-box {
              animation: fadeInSlide 0.8s ease-out, glowPulse 3s ease-in-out infinite;
              position: relative;
              overflow: hidden;
            }

            .introduction-box::before {
              content: '';
              position: absolute;
              top: 0;
              left: -200%;
              width: 200%;
              height: 100%;
              background: linear-gradient(
                90deg,
                transparent,
                rgba(236, 72, 153, 0.1) 25%,
                rgba(168, 85, 247, 0.2) 50%,
                rgba(236, 72, 153, 0.1) 75%,
                transparent
              );
              animation: shimmer 4s linear infinite;
              pointer-events: none;
            }

            .intro-icon {
              animation: iconBounce 2s ease-in-out infinite;
            }

            .intro-title {
              background: linear-gradient(
                90deg,
                #ec4899,
                #a855f7,
                #ec4899,
                #a855f7
              );
              background-size: 200% auto;
              -webkit-background-clip: text;
              background-clip: text;
              animation: shimmer 3s linear infinite;
            }
          `}</style>
          
          <div 
            className="introduction-box p-8 rounded-lg bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border-2"
            data-testid="introduction"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-pink-400 intro-icon" />
              <h2 className="text-3xl font-bold intro-title text-transparent">
                שיזוף בטוח ומדורג
              </h2>
              <Sparkles className="w-8 h-8 text-purple-400 intro-icon" style={{ animationDelay: '0.5s' }} />
            </div>
            
            <div className="relative z-10">
              <p className="text-xl text-pink-100 leading-relaxed text-center font-semibold mb-2">
                ⚠️ חשוב לקרוא! ⚠️
              </p>
              <p className="text-lg text-pink-100/90 leading-relaxed text-center">
                אנחנו מאמינים בשיזוף בטוח ואחראי. כל לקוח מקבל תוכנית שיזוף אישית המותאמת לסוג העור שלו, 
                עם התקדמות הדרגתית שמבטיחה תוצאות מושלמות ללא פגיעה בעור.
              </p>
            </div>
          </div>
        </div>

        {/* Tips and Guidelines Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {/* Do's */}
          <Card className="p-6 bg-slate-900/40 border-green-500/30">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <h3 className="text-2xl font-bold text-green-300" data-testid="title-dos">מה כן לעשות</h3>
            </div>
            <ul className="space-y-3" data-testid="dos-list">
              {dosList.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div 
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                      boxShadow: '0 0 10px rgba(74, 222, 128, 0.6)'
                    }}
                  />
                  <p className="text-base text-green-100/90 leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </Card>

          {/* Don'ts */}
          <Card className="p-6 bg-slate-900/40 border-red-500/30">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-8 h-8 text-red-400" />
              <h3 className="text-2xl font-bold text-red-300" data-testid="title-donts">מה אסור לעשות</h3>
            </div>
            <ul className="space-y-3" data-testid="donts-list">
              {dontsList.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div 
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #f87171, #ef4444)',
                      boxShadow: '0 0 10px rgba(248, 113, 113, 0.6)'
                    }}
                  />
                  <p className="text-base text-red-100/90 leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mb-16">
          <h2 
            className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
            data-testid="title-actions"
          >
            בחרו את הפעולה המתאימה
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {actionButtons.map((action) => (
              <button
                key={action.testId}
                onClick={action.onClick}
                className="p-6 rounded-lg bg-slate-900/40 border-2 border-pink-500/30 hover:border-pink-500/60 transition-all duration-300 hover-elevate active-elevate-2 text-right"
                data-testid={action.testId}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-pink-300 mb-1">{action.title}</h3>
                    <p className="text-sm text-pink-100/70">{action.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Packages Section */}
        <div id="packages-section" className="mb-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-pink-400" />
              <h2 
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
                data-testid="title-packages"
              >
                מחירון כרטיסיות
              </h2>
              <Sparkles className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-xl text-pink-300/90">✨ בחר את החבילה המושלמת עבורך ✨</p>
          </div>

          {/* Personal Packages */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center text-pink-300 mb-6" data-testid="title-personal-packages">
              חבילות אישיות
            </h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-6">
              {packages.map((pkg) => (
                <Card 
                  key={pkg.id}
                  className={`p-6 bg-slate-900/40 ${pkg.highlight ? 'border-2 border-pink-500/60' : 'border border-pink-500/30'} relative overflow-hidden`}
                  data-testid={pkg.testId}
                >
                  {pkg.highlight && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center py-1 text-sm font-bold">
                      מומלץ
                    </div>
                  )}
                  <div className={pkg.highlight ? 'mt-6' : ''}>
                    <h4 className="text-xl font-bold text-pink-300 mb-2">{pkg.title}</h4>
                    {pkg.subtitle && <p className="text-sm text-pink-200/70 mb-4">{pkg.subtitle}</p>}
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">₪{pkg.price}</span>
                    </div>
                    {pkg.pricePerSession && (
                      <p className="text-pink-200/80 text-sm mb-2">₪{pkg.pricePerSession} לכניסה</p>
                    )}
                    {pkg.features.map((feature, idx) => (
                      <p key={idx} className="text-pink-300/90 text-sm">{feature}</p>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-center text-pink-200/70 text-sm max-w-2xl mx-auto" data-testid="personal-package-note">
              חבילות אישיות בלבד, לא ניתנות לשיתוף או העברה • תקפות ל-12 חודשים
            </p>
          </div>

          {/* Shared Packages */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center text-pink-300 mb-6" data-testid="title-shared-packages">
              חבילות לשיתוף
            </h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-6">
              {sharedPackages.map((pkg) => (
                <Card 
                  key={pkg.id}
                  className={`p-6 bg-slate-900/40 ${pkg.highlight ? 'border-2 border-cyan-500/60' : 'border border-cyan-500/30'} relative overflow-hidden`}
                  data-testid={pkg.testId}
                >
                  {pkg.highlight && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center py-1 text-sm font-bold">
                      הכי משתלם
                    </div>
                  )}
                  <div className={pkg.highlight ? 'mt-6' : ''}>
                    <h4 className="text-xl font-bold text-cyan-300 mb-2">{pkg.title}</h4>
                    <p className="text-sm text-cyan-200/70 mb-4">{pkg.subtitle}</p>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">₪{pkg.price}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-center text-cyan-200/70 text-sm max-w-2xl mx-auto" data-testid="shared-package-note">
              חבילות ניתנות לשיתוף עם משפחה וחברים
            </p>
          </div>
        </div>

        {/* Bronzers Carousel */}
        {!isLoading && bronzerProducts.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4"
                data-testid="title-bronzers"
              >
                הברונזרים שלנו
              </h2>
              <p className="text-lg text-pink-200/80">מוצרים איכותיים לשיזוף מושלם</p>
            </div>
            <div data-testid="bronzers-carousel">
              <ZenCarousel products={bronzerProducts} onAddToCart={(id) => console.log('Add to cart:', id)} />
            </div>
          </div>
        )}

        {/* Important Notice */}
        <div className="max-w-3xl mx-auto mb-12">
          <div 
            className="p-6 rounded-lg bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 border-2 border-orange-500/40"
            data-testid="important-notice"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-orange-400 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-orange-300 mb-2">חשוב לדעת!</h3>
                <p className="text-orange-100/90 leading-relaxed">
                  כל לקוח מקבל ייעוץ אישי לפני תחילת התהליך. הצוות המקצועי שלנו כאן כדי להבטיח 
                  שתקבלו את התוצאות הטובות ביותר בצורה הבטוחה ביותר. אל תהססו לפנות אלינו עם כל שאלה!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
