import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, X, Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AlinChatBox from "@/components/AlinChatBox";
import Alin from "@/components/Alin";
import { NewClientDialog } from "@/components/NewClientDialog";
import { PurchaseOverlay } from "@/components/PurchaseOverlay";
import TanningProductCarousel from "@/components/TanningProductCarousel";
import CustomerSearchDialog from "@/components/CustomerSearchDialog";
import searchIcon from '@assets/3_1759474572534.png';
import bronzerIcon from '@assets/4_1759474624696.png';
import packageIcon from '@assets/member-card-icon.png';
import newCustomerIcon from '@assets/Dהורדותfreepik__spray-tan-variation-b-modern-flatbadge-3d-spray-gu__47717.png_1759805942437.png';

interface SunBedsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SunBedsDialog({ open, onOpenChange }: SunBedsDialogProps) {
  const [, navigate] = useLocation();
  const [showPricingOverlay, setShowPricingOverlay] = useState(false);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showProductCarousel, setShowProductCarousel] = useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);

  if (!open) return null;

  const tanningOptions: Array<{
    icon: string | any;
    iconType: 'image' | 'component' | 'lucide';
    title: string;
    isFunction: boolean;
    testId?: string;
    onClick: () => void;
  }> = [
    {
      icon: newCustomerIcon,
      iconType: 'image' as const,
      title: "לקוח חדש - הרשמה",
      isFunction: false,
      onClick: () => {
        setShowNewClientDialog(true);
      }
    },
    {
      icon: searchIcon,
      iconType: 'image' as const,
      title: "חיפוש משתזף קיים",
      isFunction: false,
      onClick: () => {
        setShowCustomerSearch(true);
      }
    },
    {
      icon: bronzerIcon,
      iconType: 'image' as const,
      title: "רכישת ברונזרים",
      isFunction: false,
      onClick: () => {
        setShowProductCarousel(true);
      }
    },
    {
      icon: packageIcon,
      iconType: 'image' as const,
      title: "רכישת חבילה",
      isFunction: false,
      testId: "button-purchase-overlay",
      onClick: () => {
        setShowPricingOverlay(true);
      }
    },
    {
      icon: Alin,
      iconType: 'component' as const,
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
          className="bg-white/10 border-white/20 text-white backdrop-blur-sm"
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
                filter: 'drop-shadow(0 0 16px rgba(236, 72, 153, 1)) drop-shadow(0 0 32px rgba(236, 72, 153, 1)) drop-shadow(0 0 48px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 64px rgba(236, 72, 153, 0.6))',
                boxShadow: '0 0 35px rgba(236, 72, 153, 1), 0 0 60px rgba(236, 72, 153, 0.8), 0 0 80px rgba(236, 72, 153, 0.6), inset 0 0 20px rgba(236, 72, 153, 0.5)'
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
        className="relative w-full max-w-4xl flex items-center justify-center mt-80"
      >
        {/* Close Button */}
        <Button 
          onClick={() => onOpenChange(false)} 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 text-white z-10"
          data-testid="button-close-sun-beds"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Service Fields - All in one row */}
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex gap-2 justify-center flex-nowrap animate-scale-in">
            {tanningOptions.map((option, index) => (
              <div key={index} className="relative">
                {/* Solid black background */}
                <div className="absolute inset-0 bg-black rounded-md" />
                
                <button
                  onClick={option.onClick}
                  className="
                    group relative h-[140px] w-[130px] sm:h-[150px] sm:w-[140px] md:h-[160px] md:w-[150px]
                    bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
                    border hover:border-2
                    rounded-md backdrop-blur-sm
                    flex flex-col items-center justify-between pb-4
                    transition-all duration-150 ease-in-out
                    hover-elevate active-elevate-2
                    overflow-visible
                  "
                  style={{
                    borderColor: 'rgba(236, 72, 153, 0.6)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.6)'}
                  data-testid={(option as any).testId || `action-tile-${index}`}
                >
                <div className="flex-1 flex items-center justify-center transition-all duration-150 group-hover:scale-110">
                  {option.iconType === 'image' ? (
                    <img 
                      src={option.icon as string}
                      alt={option.title}
                      className={`${
                        option.title === "רכישת חבילה"
                          ? "w-36 h-36"
                          : option.title === "רכישת ברונזרים" || option.title === "חיפוש משתזף קיים"
                          ? "w-28 h-28"
                          : "w-32 h-32"
                      } object-contain group-hover:drop-shadow-[0_0_30px_rgba(236,72,153,1)]`}
                      style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }}
                    />
                  ) : option.iconType === 'component' ? (
                    <div className="-mt-6">
                      <option.icon size={180} />
                    </div>
                  ) : option.icon && !option.isFunction && (
                    <option.icon 
                      className="w-32 h-32 text-pink-400 group-hover:drop-shadow-[0_0_30px_rgba(236,72,153,1)]"
                      style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }}
                    />
                  )}
                </div>
                <span className="text-sm font-medium text-white text-center font-hebrew px-2">
                  {option.title}
                </span>
                
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </button>
              </div>
            ))}
          </div>
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

      {/* Purchase Overlay */}
      {showPricingOverlay && (
        <PurchaseOverlay 
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
              className="absolute top-4 right-4 z-10 bg-white/10 border-white/20 text-white"
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

      {/* Customer Search Dialog */}
      <CustomerSearchDialog
        open={showCustomerSearch}
        onOpenChange={setShowCustomerSearch}
        onCustomerSelect={(customer) => {
          console.log('Selected customer:', customer);
          setShowCustomerSearch(false);
          // Could navigate to customer management or show details
        }}
      />
    </div>
  );
}
