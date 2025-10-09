import { useState } from 'react';
import { ArrowLeft, X, Droplets, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NewClientDialog } from "@/components/NewClientDialog";
import CustomerSearchDialog from "@/components/CustomerSearchDialog";
import { PurchaseOverlay } from "@/components/PurchaseOverlay";
import searchIcon from '@assets/3_1759474572534.png';
import packageIcon from '@assets/member-card-icon.png';
import newCustomerIcon from '@assets/Dהורדותfreepik__spray-tan-variation-b-modern-flatbadge-3d-spray-gu__47717.png_1759805942437.png';
import auraAllure1 from '@assets/Aura_Allure_12-4_1759974372343.jpg';
import auraAllure2 from '@assets/Aura_Allure_4_1759974372346.jpg';
import auraAllure3 from '@assets/Aura_Allure_12_1759974372347.jpg';
import auraAllureDetail from '@assets/allure_detail_views_1759974372347.jpg';

interface SprayTanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SprayTanDialog({ open, onOpenChange }: SprayTanDialogProps) {
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = [auraAllure1, auraAllure2, auraAllure3, auraAllureDetail];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  if (!open) return null;

  const sprayTanOptions: Array<{
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
      icon: Droplets,
      iconType: 'lucide' as const,
      title: "טיפול מיידי",
      onClick: () => {
        console.log('Start immediate treatment');
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Pink/Purple Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-pink-600/20 to-black opacity-90 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-purple-500/10" />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-start p-4 pb-20">
        {/* Back Button */}
      <div className="absolute top-6 right-6 z-30">
        <Button
          onClick={() => onOpenChange(false)}
          variant="outline"
          size="lg"
          className="bg-white/10 border-white/20 text-white backdrop-blur-sm"
          data-testid="button-back-spray-tan"
        >
          <ArrowLeft className="w-5 h-5 ml-2" />
          חזרה לשירות עצמי
        </Button>
      </div>

      {/* Welcome Header */}
      <div className="absolute top-16 left-0 right-0 z-20">
        <div className="text-center space-y-4 px-4">
          <div className="flex items-center justify-center gap-3">
            <Droplets className="w-12 h-12 text-pink-500" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 1))' }} />
            <h1 
              className="text-xl font-bold text-white font-varela tracking-wide" 
              style={{ fontFamily: "'Varela Round', sans-serif !important" }}
            >
              שיזוף בהתזה - טכנולוגיה מתקדמת לשיזוף מושלם
            </h1>
            <Sparkles className="w-10 h-10 text-purple-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 1))' }} />
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
          
        </div>
      </div>

      {/* Content Container - positioned lower to avoid overlap */}
      <div className="relative w-full max-w-4xl flex items-center justify-center mt-80">
        {/* Service Fields - All in one row */}
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex gap-2 justify-center flex-nowrap animate-scale-in">
            {sprayTanOptions.map((option, index) => (
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
                  data-testid={`spray-tan-action-${index}`}
                >
                  <div className="flex-1 flex items-center justify-center transition-all duration-150 group-hover:scale-110">
                    {option.iconType === 'image' ? (
                      <img 
                        src={option.icon as string}
                        alt={option.title}
                        className="w-24 h-24 object-contain group-hover:drop-shadow-[0_0_30px_rgba(236,72,153,1)]"
                        style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }}
                      />
                    ) : option.iconType === 'lucide' ? (
                      <option.icon 
                        className="w-20 h-20 text-pink-500 group-hover:drop-shadow-[0_0_30px_rgba(236,72,153,1)]"
                        style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }}
                      />
                    ) : null}
                  </div>
                  
                  {option.title && (
                    <div className="px-2 text-center">
                      <p className="text-white text-xs font-semibold leading-tight font-hebrew">
                        {option.title}
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

      {/* Image Gallery Section */}
      <div className="relative w-full max-w-4xl mt-12 px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white font-hebrew mb-2">
            מכונת Aura Allure - הטכנולוגיה המתקדמת ביותר
          </h2>
          <div className="w-32 h-px mx-auto bg-gradient-to-r from-transparent via-pink-500 to-transparent" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }} />
        </div>

        {/* Gallery */}
        <div className="relative group">
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-pink-500/30" style={{ boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)' }}>
            <img 
              src={galleryImages[currentImageIndex]} 
              alt={`Aura Allure ${currentImageIndex + 1}`}
              className="w-full h-full object-contain bg-black"
            />
            
            {/* Navigation Arrows */}
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border border-pink-500/50 rounded-full p-3 transition-all hover-elevate active-elevate-2"
              data-testid="button-next-image"
            >
              <ChevronRight className="w-6 h-6 text-pink-400" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border border-pink-500/50 rounded-full p-3 transition-all hover-elevate active-elevate-2"
              data-testid="button-prev-image"
            >
              <ChevronLeft className="w-6 h-6 text-pink-400" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? 'bg-pink-500 w-6' 
                      : 'bg-pink-500/30 hover:bg-pink-500/50'
                  }`}
                  data-testid={`indicator-${index}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
          {[
            { title: 'התזה בודדת', price: '₪170', sessions: '1 טיפול', badge: null },
            { title: 'חבילת 3 התזות', price: '₪450', sessions: '3 טיפולים', badge: 'חיסכון ₪60' },
            { title: 'חבילת 6 התזות', price: '₪800', sessions: '6 טיפולים', badge: 'חיסכון ₪220' },
            { title: 'שירות עד הבית', price: '₪350', sessions: 'טיפול מקצועי בנוחות הבית', badge: null },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border rounded-md p-4 hover-elevate active-elevate-2 transition-all"
              style={{
                borderColor: 'rgba(236, 72, 153, 0.6)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.6)'}
            >
              {item.badge && (
                <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold" style={{ boxShadow: '0 0 15px rgba(236, 72, 153, 0.6)' }}>
                  {item.badge}
                </div>
              )}
              <h3 className="text-white font-bold text-lg mb-2 font-hebrew text-center">{item.title}</h3>
              <p className="text-pink-400 font-bold text-2xl mb-1 text-center" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))' }}>{item.price}</p>
              <p className="text-gray-300 text-sm font-hebrew text-center">{item.sessions}</p>
            </div>
          ))}
        </div>

        {/* Info Text */}
        <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border rounded-md p-6 mb-8" style={{ borderColor: 'rgba(236, 72, 153, 0.6)' }}>
          <p className="text-white text-center font-hebrew leading-relaxed">
            שיזוף בהתזה הוא שיטה מתקדמת ובטוחה המתבצעת באמצעות קומפרסור אויר המחובר לאקדח המפזר תמיסת שיזוף בחלקיקים דקיקים.
            התהליך לוקח 15 דקות בלבד ומקנה שיזוף אחיד ומושלם. תמיסת השיזוף מכילה DHA - חומר טבעי המופק מקנה סוכר.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
