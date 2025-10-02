import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, UserPlus, CreditCard, X, Sparkles, Search, ScanFace, Droplets } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AlinChatBox from "@/components/AlinChatBox";
import { NewClientDialog } from "@/components/NewClientDialog";
import { AdvancedPurchaseOverlay } from "@/components/AdvancedPurchaseOverlay";
import TanningProductCarousel from "@/components/TanningProductCarousel";

interface SunBedsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SunBedsDialog({ open, onOpenChange }: SunBedsDialogProps) {
  const [, navigate] = useLocation();
  const [showPricingOverlay, setShowPricingOverlay] = useState(false);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showProductCarousel, setShowProductCarousel] = useState(false);
  const [showFaceRecognitionDialog, setShowFaceRecognitionDialog] = useState(false);

  if (!open) return null;

  const tanningOptions = [
    {
      icon: UserPlus,
      title: "לקוח חדש - הרשמה",
      isFunction: false,
      onClick: () => {
        setShowNewClientDialog(true);
      }
    },
    {
      icon: Search,
      title: "חיפוש משתזף קיים",
      isFunction: false,
      onClick: () => {
        // Search existing customer
      }
    },
    {
      icon: ScanFace,
      title: "הרשמה לשירותי 24/7",
      isFunction: false,
      onClick: () => {
        setShowFaceRecognitionDialog(true);
      }
    },
    {
      icon: Droplets,
      title: "רכישת ברונזרים",
      isFunction: false,
      onClick: () => {
        setShowProductCarousel(true);
      }
    },
    {
      icon: CreditCard,
      title: "רכישת כרטיסיה",
      isFunction: false,
      onClick: () => {
        setShowPricingOverlay(true);
      }
    },
    {
      icon: Sparkles,
      title: "AI TAN",
      isFunction: false,
      onClick: () => {
        window.open('https://preview--radiant-booth-studio.lovable.app/', '_blank');
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Purple Neon Overlay Background */}
      <div className="absolute inset-0">
        {/* Purple background */}
        <div className="absolute inset-0 bg-purple-500/50 backdrop-blur-sm" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-70" />
      </div>
      
      {/* Back to Self Service Button - moved to top corner */}
      <div className="absolute top-6 right-6 z-30">
        <Button 
          onClick={() => onOpenChange(false)} 
          variant="outline" 
          size="lg" 
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          data-testid="button-back-to-self-service"
        >
          <ArrowLeft className="w-5 h-5 ml-2" />
          חזרה לשירות עצמי
        </Button>
      </div>

      {/* Welcome Header */}
      <div className="absolute top-16 left-0 right-0 z-20">
        <div className="text-center space-y-4 px-4">
          <div className="flex items-center justify-center mb-1">
            <h1 
              className="text-xl font-bold text-white font-varela tracking-wide" 
              style={{ fontFamily: "'Varela Round', sans-serif !important" }}
            >
              ברוכים הבאים לעולם המחר של תעשיית השיזוף
            </h1>
          </div>
          
          {/* Pink Neon Separator */}
          <div className="relative py-1 flex justify-center">
            <div 
              className="w-1/2 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-pulse" 
              style={{
                filter: 'drop-shadow(0 0 16px rgba(255, 20, 147, 1)) drop-shadow(0 0 32px rgba(236, 72, 153, 1)) drop-shadow(0 0 48px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 64px rgba(255, 20, 147, 0.6))',
                boxShadow: '0 0 35px rgba(255, 20, 147, 1), 0 0 60px rgba(236, 72, 153, 0.8), 0 0 80px rgba(255, 20, 147, 0.6), inset 0 0 20px rgba(255, 20, 147, 0.5)'
              }}
            />
            <div className="absolute inset-0 flex justify-center">
              <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent opacity-80 blur-sm animate-pulse" />
            </div>
          </div>
          
          {/* About Us Section */}
          <div className="px-2 mx-[9px]">
            <p className="text-sm font-semibold text-white mb-3 text-center font-varela">
              גאים להוביל את המודל ההייברידי של עולם השיזוף
            </p>
            <div className="text-gray-300 space-y-1 text-sm" dir="rtl">
              <p>• ללא צורך בתיאום מראש או קביעת תורים</p>
              <p>• כניסה עצמאית בכל שעה של היום ובכל שעה של הלילה</p>
              <p>• מיטות השיזוף זמינות 24/7 ללקוחות הבוטיק</p>
              <p>• הכניסה למתחם השיזוף לאחר שעות הפעילות כרוך בהרשמה למערכת זיהוי פנים מתקדמת</p>
              <p>• צוות מקצועי ומנוסה שיעניק לכם שירות ברמה הגבוהה ביותר</p>
              <p>• שעות פעילות: 10:00-19:00, ימי שישי 10:00-14:00, ימי שבת סגור</p>
              <p className="text-xs text-gray-400 mr-2">* בשירות עצמי לאחר שעות הפעילות</p>
              <p>• שירות לקוחות זמין 24/7 • סביבה נקיה, בטוחה ומקצועית</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container - positioned lower to avoid overlap */}
      <div 
        className="relative w-full max-w-4xl flex items-center justify-center" 
        style={{ marginTop: '320px' }}
      >
        {/* Close Button */}
        <Button 
          onClick={() => onOpenChange(false)} 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 text-white hover:bg-white/20 z-10"
          data-testid="button-close-sun-beds"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Service Fields with Larger Design */}
        <div className="w-full max-w-full mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 animate-scale-in">
            {tanningOptions.map((option, index) => (
              <div 
                key={index} 
                className="group cursor-pointer transform-gpu transition-all duration-500 hover:animate-magnetic-hover" 
                onClick={option.onClick}
                onMouseEnter={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.08)';
                    e.currentTarget.style.filter = 'brightness(1.3) saturate(1.4) drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))';
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.filter = 'brightness(1) saturate(1) drop-shadow(0 0 0px rgba(236, 72, 153, 0))';
                  }
                }}
                style={{
                  transition: 'all 0.4s cubic-bezier(0.34, 1.45, 0.64, 1)'
                }}
                data-testid={`action-tile-${index}`}
              >
                <div 
                  className="w-full aspect-square p-12 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-400 backdrop-blur-sm overflow-hidden relative bg-gradient-to-br from-background via-background/95 to-primary/5 border-primary/50 shadow-2xl group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(236,72,153,0.7)]"
                  style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(8px)',
                    transform: 'translateZ(0)',
                    filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.4))'
                  }}
                >
                  {/* Enhanced inner glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 via-primary/10 to-white/5 opacity-0 group-hover:opacity-100 transition-all duration-400" />
                  
                  {/* Icon Container */}
                  <div className="relative z-10 transform transition-all duration-400 group-hover:scale-110 flex-1 flex items-center justify-center">
                    <span 
                      style={{
                        filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 1)) drop-shadow(0 0 40px hsl(var(--primary) / 0.5))'
                      }}
                      className="transition-all duration-400 w-full group-hover:drop-shadow-[0_0_40px_rgba(236,72,153,0.9)]"
                    >
                      {option.icon && !option.isFunction && (
                        <option.icon 
                          className="w-12 h-12 text-primary group-hover:text-white transition-all duration-400"
                          strokeWidth={1.5}
                        />
                      )}
                    </span>
                  </div>
                  
                  {/* Icon Label - only show if title exists */}
                  {option.title && (
                    <div className="text-center mt-6 px-2">
                      <span className="text-white text-sm font-hebrew font-medium opacity-90 group-hover:opacity-100 transition-all duration-400 block leading-tight whitespace-nowrap overflow-hidden text-ellipsis group-hover:drop-shadow-[0_0_12px_rgba(236,72,153,0.8)] group-hover:text-pink-100">
                        {option.title}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety reminder */}
      <div className="fixed bottom-4 left-4 z-20 max-w-xs">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-3 text-xs">
          <p className="text-cyan-200 font-hebrew text-right mb-1">💡 זכרו:</p>
          <p className="text-gray-300 font-hebrew text-right leading-relaxed">
            שיזוף בטוח מתחיל בזיהוי סוג העור ומנוחה של 48 שעות בין סשנים
          </p>
        </div>
      </div>

      {/* Alin Chat Box */}
      <div className="fixed top-80 right-6 z-30">
        <AlinChatBox 
          isSelfServicePage={true} 
          contextMessage="היי אני אלין, פה איתכם במיטות השיזוף, אני אלווה אתכם בכל תהליך ההרשמה 24/7" 
        />
      </div>

      {/* New Client Dialog */}
      <NewClientDialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog} />

      {/* Advanced Purchase Overlay */}
      {showPricingOverlay && (
        <AdvancedPurchaseOverlay 
          open={showPricingOverlay} 
          onClose={() => setShowPricingOverlay(false)} 
        />
      )}

      {/* Product Carousel */}
      {showProductCarousel && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
          <div className="relative w-full max-w-5xl max-h-[80vh]">
            <Button 
              onClick={() => setShowProductCarousel(false)} 
              variant="outline" 
              size="lg" 
              className="absolute top-4 right-4 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
              data-testid="button-close-carousel"
            >
              <X className="w-6 h-6 ml-2" />
              סגור
            </Button>
            <div className="h-full overflow-y-auto">
              <TanningProductCarousel 
                onAddToCart={(productId) => {
                  // Add your cart logic here
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Face Recognition Registration Dialog */}
      {showFaceRecognitionDialog && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 rounded-xl border border-primary/30 p-8 max-w-md w-full">
            <Button 
              onClick={() => setShowFaceRecognitionDialog(false)} 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-white hover:bg-white/10"
              data-testid="button-close-face-recognition"
            >
              <X className="w-6 h-6" />
            </Button>
            
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <ScanFace className="w-10 h-10 text-primary" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-2">הרשמה לשירותי 24/7</h3>
                <p className="text-gray-300 text-sm">
                  הרשמה למערכת זיהוי פנים לכניסה עצמאית לאחר שעות הפעילות
                </p>
              </div>
              
              <div className="space-y-4">
                <Input 
                  placeholder="שם מלא" 
                  className="bg-black/50 border-primary/30 text-white" 
                  data-testid="input-full-name"
                />
                <Input 
                  placeholder="מספר טלפון" 
                  className="bg-black/50 border-primary/30 text-white"
                  data-testid="input-phone"
                />
                <Input 
                  placeholder="כתובת אימייל" 
                  className="bg-black/50 border-primary/30 text-white"
                  data-testid="input-email"
                />
              </div>
              
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
                data-testid="button-start-registration"
              >
                התחל הרשמה
              </Button>
              
              <p className="text-xs text-gray-400 text-center">
                ההרשמה כוללת צילום תמונה ואימות זהות
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
