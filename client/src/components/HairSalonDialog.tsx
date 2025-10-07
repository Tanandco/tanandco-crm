import { useState } from 'react';
import { ArrowLeft, X, Scissors, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NewClientDialog } from "@/components/NewClientDialog";
import CustomerSearchDialog from "@/components/CustomerSearchDialog";
import { PurchaseOverlay } from "@/components/PurchaseOverlay";
import searchIcon from '@assets/3_1759474572534.png';
import packageIcon from '@assets/2_1759474652165.png';
import newCustomerIcon from '@assets/Dהורדותfreepik__spray-tan-variation-b-modern-flatbadge-3d-spray-gu__47717.png_1759805942437.png';

interface HairSalonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HairSalonDialog({ open, onOpenChange }: HairSalonDialogProps) {
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);

  if (!open) return null;

  const salonActions: Array<{
    icon: string | any;
    iconType: 'image' | 'component' | 'lucide';
    title: string;
    onClick: () => void;
  }> = [
    {
      icon: newCustomerIcon,
      iconType: 'image' as const,
      title: "לקוח חדש - הרשמה",
      onClick: () => {
        setShowNewClientDialog(true);
      }
    },
    {
      icon: searchIcon,
      iconType: 'image' as const,
      title: "חיפוש לקוח קיים",
      onClick: () => {
        setShowCustomerSearch(true);
      }
    },
    {
      icon: packageIcon,
      iconType: 'image' as const,
      title: "רכישת חבילה",
      onClick: () => {
        setShowPurchaseOverlay(true);
      }
    },
    {
      icon: Scissors,
      iconType: 'lucide' as const,
      title: "שירות מיידי",
      onClick: () => {
        console.log('Start immediate service');
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Purple/Indigo Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-indigo-500/20 to-black opacity-90 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-indigo-500/10" />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 right-6 z-30">
        <Button
          onClick={() => onOpenChange(false)}
          variant="outline"
          size="lg"
          className="bg-white/10 border-white/20 text-white backdrop-blur-sm"
          data-testid="button-back-hair-salon"
        >
          <ArrowLeft className="w-5 h-5 ml-2" />
          חזרה לשירות עצמי
        </Button>
      </div>

      {/* Welcome Header */}
      <div className="absolute top-16 left-0 right-0 z-20">
        <div className="text-center space-y-4 px-4">
          <div className="flex items-center justify-center gap-3">
            <Scissors className="w-12 h-12 text-purple-500" style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 1))' }} />
            <h1 
              className="text-xl font-bold text-white font-varela tracking-wide" 
              style={{ fontFamily: "'Varela Round', sans-serif !important" }}
            >
              מספרה ועיצוב שיער - מעצבי שיער מקצועיים
            </h1>
            <Sparkles className="w-10 h-10 text-pink-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 1))' }} />
          </div>
          
          {/* Purple Neon Separator */}
          <div className="relative py-1 flex justify-center">
            <div 
              className="w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" 
              style={{
                filter: 'drop-shadow(0 0 16px rgba(168, 85, 247, 1)) drop-shadow(0 0 32px rgba(99, 102, 241, 1)) drop-shadow(0 0 48px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 64px rgba(99, 102, 241, 0.6))',
                boxShadow: '0 0 35px rgba(168, 85, 247, 1), 0 0 60px rgba(99, 102, 241, 0.8), 0 0 80px rgba(168, 85, 247, 0.6), inset 0 0 20px rgba(168, 85, 247, 0.5)'
              }}
            />
            <div className="absolute inset-0 flex justify-center">
              <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-80 blur-sm animate-pulse" />
            </div>
          </div>
          
          {/* About Section */}
          <div className="px-2 mx-[9px]">
            <p className="text-sm font-semibold text-white mb-3 text-center font-varela">
              מעצבי שיער מוסמכים ומנוסים למראה מושלם
            </p>
            <div className="text-gray-300 space-y-1 text-sm" dir="rtl">
              <p>• תספורות ועיצוב שיער מקצועי ומותאם אישית</p>
              <p>• צביעות והבהרות בטכניקות מתקדמות</p>
              <p>• טיפולי שיער מקצועיים לחיזוק והזנה</p>
              <p>• החלקות קרטין וברזילאיות</p>
              <p>• ניסיון של למעלה מ-10 שנים</p>
              <p>• מוצרים מקצועיים ואיכותיים</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container - positioned lower to avoid overlap */}
      <div className="relative w-full max-w-4xl flex items-center justify-center mt-80">
        {/* Service Fields - All in one row */}
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex gap-2 justify-center flex-nowrap animate-scale-in">
            {salonActions.map((action, index) => (
              <div key={index} className="relative">
                {/* Solid black background */}
                <div className="absolute inset-0 bg-black rounded-md" />
                
                <button
                  onClick={action.onClick}
                  className="
                    group relative h-[140px] w-[130px] sm:h-[150px] sm:w-[140px] md:h-[160px] md:w-[150px]
                    bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
                    border hover:border-2
                    rounded-md backdrop-blur-sm
                    flex flex-col items-center justify-between pb-4
                    transition-all duration-300 ease-in-out
                    hover-elevate active-elevate-2
                    overflow-visible
                  "
                  style={{
                    borderColor: 'rgba(168, 85, 247, 0.6)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 1)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.6)'}
                  data-testid={`hair-salon-action-${index}`}
                >
                  <div className="flex-1 flex items-center justify-center">
                    {action.iconType === 'image' ? (
                      <img 
                        src={action.icon as string}
                        alt={action.title}
                        className="w-24 h-24 object-contain"
                        style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))' }}
                      />
                    ) : action.iconType === 'lucide' ? (
                      <action.icon 
                        className="w-20 h-20 text-purple-500"
                        style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))' }}
                      />
                    ) : null}
                  </div>
                  
                  {action.title && (
                    <div className="px-2 text-center">
                      <p className="text-white text-xs font-semibold leading-tight font-hebrew">
                        {action.title}
                      </p>
                    </div>
                  )}

                  {/* Ripple effect container */}
                  <div className="absolute inset-0 rounded-md overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
                    <div className="ripple"></div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Client Dialog */}
      <NewClientDialog 
        open={showNewClientDialog}
        onOpenChange={setShowNewClientDialog}
      />

      {/* Customer Search Dialog */}
      <CustomerSearchDialog
        open={showCustomerSearch}
        onOpenChange={setShowCustomerSearch}
        onCustomerSelect={(customer) => {
          console.log('Selected customer:', customer);
          setShowCustomerSearch(false);
        }}
      />

      {/* Purchase Overlay */}
      {showPurchaseOverlay && (
        <PurchaseOverlay
          open={showPurchaseOverlay}
          onClose={() => setShowPurchaseOverlay(false)}
        />
      )}
    </div>
  );
}
