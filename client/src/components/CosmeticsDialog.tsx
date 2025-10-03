import { useState } from 'react';
import { ArrowLeft, X, UserPlus, Search, CreditCard, Hand, Eye, Clock, Sparkles, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CustomerSearchDialog from "@/components/CustomerSearchDialog";
import { PurchaseOverlay } from "@/components/PurchaseOverlay";

interface CosmeticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CosmeticsDialog({ open, onOpenChange }: CosmeticsDialogProps) {
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);
  const [selectedService, setSelectedService] = useState<'manicure' | 'eyebrows' | null>(null);

  if (!open) return null;

  const cosmeticsActions = [
    {
      icon: UserPlus,
      title: "לקוח חדש - הרשמה",
      color: "text-pink-500",
      onClick: () => {
        // Navigate to registration
      }
    },
    {
      icon: Search,
      title: "חיפוש לקוח קיים",
      color: "text-purple-500",
      onClick: () => {
        setShowCustomerSearch(true);
      }
    },
    {
      icon: CreditCard,
      title: "רכישת חבילה",
      color: "text-blue-500",
      onClick: () => {
        setShowPurchaseOverlay(true);
      }
    }
  ];

  const manicureServices = [
    {
      name: "מניקור בסיסי",
      duration: "30 דקות",
      description: "טיפול בציפורניים ועיצוב",
      price: "₪80",
      gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
      name: "מניקור ג'ל",
      duration: "45 דקות",
      description: "מניקור עם לק ג'ל עמיד",
      price: "₪150",
      gradient: "from-rose-500/20 to-fuchsia-500/20"
    },
    {
      name: "פדיקור",
      duration: "45 דקות",
      description: "טיפול מלא לכפות הרגליים",
      price: "₪120",
      gradient: "from-fuchsia-500/20 to-pink-500/20"
    },
    {
      name: "בניית ציפורניים",
      duration: "90 דקות",
      description: "הארכה והבניה בג'ל",
      price: "₪250",
      gradient: "from-pink-500/20 to-purple-500/20"
    }
  ];

  const eyebrowServices = [
    {
      name: "עיצוב גבות בפינצטה",
      duration: "20 דקות",
      description: "עיצוב מדויק לקו הגבה",
      price: "₪60",
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    {
      name: "עיצוב גבות בשעווה",
      duration: "15 דקות",
      description: "עיצוב מהיר ויעיל",
      price: "₪50",
      gradient: "from-indigo-500/20 to-blue-500/20"
    },
    {
      name: "צביעת גבות",
      duration: "25 דקות",
      description: "צביעה מקצועית לגבות",
      price: "₪70",
      gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
      name: "למינציה לגבות",
      duration: "45 דקות",
      description: "טיפול מתקדם להצמחה",
      price: "₪180",
      gradient: "from-purple-500/20 to-pink-500/20"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Pink/Purple Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-fuchsia-500/20 to-black opacity-90 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-pink-500/10" />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 right-6 z-30">
        <Button
          onClick={() => onOpenChange(false)}
          variant="outline"
          size="lg"
          className="bg-white/10 border-pink-500/30 text-white backdrop-blur-sm hover:bg-pink-500/20 hover:border-pink-500"
          data-testid="button-back-cosmetics"
        >
          <ArrowLeft className="w-5 h-5 ml-2" />
          חזרה
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-6xl z-20 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Star className="w-12 h-12 text-pink-500" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 1))' }} />
            <h1 className="text-4xl font-bold text-white font-hebrew" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }}>
              קוסמטיקה ויופי
            </h1>
            <Sparkles className="w-10 h-10 text-fuchsia-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(217, 70, 239, 1))' }} />
          </div>
          
          {/* Pink Separator */}
          <div className="relative py-1 flex justify-center">
            <div 
              className="w-2/3 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" 
              style={{
                filter: 'drop-shadow(0 0 16px rgba(236, 72, 153, 1)) drop-shadow(0 0 32px rgba(217, 70, 239, 0.8))',
                boxShadow: '0 0 35px rgba(236, 72, 153, 1), 0 0 60px rgba(217, 70, 239, 0.8)'
              }}
            />
          </div>

          <p className="text-lg text-gray-300 font-hebrew max-w-2xl mx-auto">
            טיפולי יופי מקצועיים למראה מושלם
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-3 gap-6 px-8">
          {cosmeticsActions.map((action, index) => (
            <div
              key={index}
              onClick={action.onClick}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              data-testid={`cosmetics-action-${index}`}
            >
              <div 
                className="h-36 rounded-lg border-2 border-pink-500/30 bg-gradient-to-br from-gray-900/80 via-black/90 to-fuchsia-900/30 backdrop-blur-sm flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:border-pink-500 group-hover:shadow-2xl"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                }}
              >
                <action.icon 
                  className={`w-14 h-14 ${action.color} transition-all duration-300 group-hover:scale-110`}
                  style={{
                    filter: `drop-shadow(0 0 20px ${action.color.includes('pink') ? 'rgba(236, 72, 153, 1)' : 
                            action.color.includes('purple') ? 'rgba(168, 85, 247, 1)' :
                            'rgba(59, 130, 246, 1)'})`
                  }}
                />
                <span className="text-white font-semibold text-center px-2 font-hebrew text-sm">{action.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Service Type Selection */}
        <div className="px-8 grid grid-cols-2 gap-6">
          <div
            onClick={() => setSelectedService(selectedService === 'manicure' ? null : 'manicure')}
            className={`cursor-pointer p-6 rounded-lg border-2 transition-all duration-300 ${
              selectedService === 'manicure'
                ? 'border-pink-500 bg-pink-500/20'
                : 'border-pink-500/30 bg-gradient-to-br from-gray-900/80 via-black/90 to-pink-900/30'
            } backdrop-blur-sm hover:border-pink-500`}
            data-testid="service-type-manicure"
          >
            <div className="text-center space-y-3">
              <Hand className="w-16 h-16 text-pink-500 mx-auto" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 1))' }} />
              <h2 className="text-2xl font-bold text-white font-hebrew">מניקור ופדיקור</h2>
              <p className="text-gray-300 text-sm font-hebrew">טיפולי ציפורניים מקצועיים</p>
            </div>
          </div>

          <div
            onClick={() => setSelectedService(selectedService === 'eyebrows' ? null : 'eyebrows')}
            className={`cursor-pointer p-6 rounded-lg border-2 transition-all duration-300 ${
              selectedService === 'eyebrows'
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-purple-500/30 bg-gradient-to-br from-gray-900/80 via-black/90 to-purple-900/30'
            } backdrop-blur-sm hover:border-purple-500`}
            data-testid="service-type-eyebrows"
          >
            <div className="text-center space-y-3">
              <Eye className="w-16 h-16 text-purple-500 mx-auto" style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 1))' }} />
              <h2 className="text-2xl font-bold text-white font-hebrew">אומנית גבות</h2>
              <p className="text-gray-300 text-sm font-hebrew">עיצוב וטיפול בגבות</p>
            </div>
          </div>
        </div>

        {/* Services Display */}
        {selectedService && (
          <div className="px-8 space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-white text-center font-hebrew" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }}>
              {selectedService === 'manicure' ? 'שירותי מניקור ופדיקור' : 'שירותי עיצוב גבות'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(selectedService === 'manicure' ? manicureServices : eyebrowServices).map((service, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border ${
                    selectedService === 'manicure' ? 'border-pink-500/30' : 'border-purple-500/30'
                  } bg-gradient-to-br ${service.gradient} backdrop-blur-sm transition-all duration-300 hover:border-${
                    selectedService === 'manicure' ? 'pink' : 'purple'
                  }-500 hover:scale-105`}
                  style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}
                  data-testid={`service-${selectedService}-${index}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className={`w-5 h-5 ${selectedService === 'manicure' ? 'text-pink-400' : 'text-purple-400'}`} />
                    <h3 className="text-xl font-bold text-white font-hebrew">{service.name}</h3>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3 font-hebrew">{service.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 font-hebrew">{service.duration}</span>
                    <span 
                      className={`text-2xl font-bold ${selectedService === 'manicure' ? 'text-pink-400' : 'text-purple-400'}`}
                      style={{ filter: `drop-shadow(0 0 10px ${selectedService === 'manicure' ? 'rgba(236, 72, 153, 0.8)' : 'rgba(168, 85, 247, 0.8)'})` }}
                    >
                      {service.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        {!selectedService && (
          <div className="px-8">
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 text-center font-hebrew">היתרונות שלנו</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-300 font-hebrew">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>קוסמטיקאיות מוסמכות</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>מוצרים איכותיים</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>כלים סטריליים</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>אווירה נעימה</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>מחירים הוגנים</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>שירות אדיב</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
