import { useState } from 'react';
import { ArrowLeft, X, UserPlus, Search, CreditCard, Scissors, Clock, Sparkles, Palette } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CustomerSearchDialog from "@/components/CustomerSearchDialog";
import { PurchaseOverlay } from "@/components/PurchaseOverlay";

interface HairSalonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HairSalonDialog({ open, onOpenChange }: HairSalonDialogProps) {
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);

  if (!open) return null;

  const salonActions = [
    {
      icon: UserPlus,
      title: "לקוח חדש - הרשמה",
      color: "text-purple-500",
      onClick: () => {
        // Navigate to registration
      }
    },
    {
      icon: Search,
      title: "חיפוש לקוח קיים",
      color: "text-blue-500",
      onClick: () => {
        setShowCustomerSearch(true);
      }
    },
    {
      icon: CreditCard,
      title: "רכישת חבילה",
      color: "text-pink-500",
      onClick: () => {
        setShowPurchaseOverlay(true);
      }
    },
    {
      icon: Scissors,
      title: "שירות מיידי",
      color: "text-cyan-500",
      onClick: () => {
        // Start immediate service
      }
    }
  ];

  const services = [
    {
      name: "תספורת גברים",
      duration: "30 דקות",
      description: "תספורת מקצועית בידי מעצב שיער",
      price: "₪120",
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    {
      name: "תספורת נשים",
      duration: "45 דקות",
      description: "תספורת ועיצוב שיער מקצועי",
      price: "₪150",
      gradient: "from-indigo-500/20 to-pink-500/20"
    },
    {
      name: "צביעה",
      duration: "90 דקות",
      description: "צביעה מלאה או הבהרה",
      price: "₪350",
      gradient: "from-pink-500/20 to-purple-500/20"
    },
    {
      name: "פן + סלסול",
      duration: "60 דקות",
      description: "פן ועיצוב שיער מקצועי",
      price: "₪180",
      gradient: "from-purple-500/20 to-blue-500/20"
    },
    {
      name: "החלקה",
      duration: "120 דקות",
      description: "החלקת שיער קרטין/ברזילאית",
      price: "₪800",
      gradient: "from-blue-500/20 to-indigo-500/20"
    },
    {
      name: "טיפולי שיער",
      duration: "45 דקות",
      description: "טיפול חיזוק והזנה לשיער",
      price: "₪200",
      gradient: "from-indigo-500/20 to-purple-500/20"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Purple/Black Gradient Background */}
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
          className="bg-white/10 border-purple-500/30 text-white backdrop-blur-sm hover:bg-purple-500/20 hover:border-purple-500"
          data-testid="button-back-hair-salon"
        >
          <ArrowLeft className="w-5 h-5 ml-2" />
          חזרה
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-6xl z-20 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Scissors className="w-12 h-12 text-purple-500" style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 1))' }} />
            <h1 className="text-4xl font-bold text-white font-hebrew" style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))' }}>
              מספרה ועיצוב שיער
            </h1>
            <Sparkles className="w-10 h-10 text-pink-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 1))' }} />
          </div>
          
          {/* Purple Separator */}
          <div className="relative py-2 flex justify-center">
            <div 
              className="w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" 
              style={{
                filter: 'drop-shadow(0 0 16px rgba(168, 85, 247, 1)) drop-shadow(0 0 32px rgba(99, 102, 241, 0.8))',
                boxShadow: '0 0 35px rgba(168, 85, 247, 1), 0 0 60px rgba(99, 102, 241, 0.8)'
              }}
            />
          </div>

          <p className="text-lg text-gray-300 font-hebrew max-w-2xl mx-auto">
            מעצבי שיער מקצועיים ומנוסים למראה מושלם
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-8">
          {salonActions.map((action, index) => (
            <div
              key={index}
              onClick={action.onClick}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              data-testid={`hair-salon-action-${index}`}
            >
              <div 
                className="h-40 rounded-lg border-2 border-purple-500/30 bg-gradient-to-br from-gray-900/80 via-black/90 to-indigo-900/30 backdrop-blur-sm flex flex-col items-center justify-center gap-3 transition-all duration-300 group-hover:border-purple-500 group-hover:shadow-2xl"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                }}
              >
                <action.icon 
                  className={`w-16 h-16 ${action.color} transition-all duration-300 group-hover:scale-110`}
                  style={{
                    filter: `drop-shadow(0 0 20px ${action.color.includes('purple') ? 'rgba(168, 85, 247, 1)' : 
                            action.color.includes('blue') ? 'rgba(59, 130, 246, 1)' :
                            action.color.includes('pink') ? 'rgba(236, 72, 153, 1)' : 
                            'rgba(6, 182, 212, 1)'})`
                  }}
                />
                <span className="text-white font-semibold text-center px-2 font-hebrew">{action.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="px-8 space-y-4">
          <h2 className="text-2xl font-bold text-white text-center font-hebrew" style={{ filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.8))' }}>
            שירותי המספרה
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border border-purple-500/30 bg-gradient-to-br ${service.gradient} backdrop-blur-sm transition-all duration-300 hover:border-purple-500 hover:scale-105`}
                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}
                data-testid={`service-${index}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-bold text-white font-hebrew">{service.name}</h3>
                </div>
                
                <p className="text-gray-300 text-sm mb-3 font-hebrew">{service.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 font-hebrew">{service.duration}</span>
                  <span className="text-2xl font-bold text-purple-400" style={{ filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.8))' }}>
                    {service.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stylist Info Section */}
        <div className="px-8">
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 text-center font-hebrew flex items-center justify-center gap-2">
              <Palette className="w-6 h-6 text-purple-400" />
              למה לבחור בנו?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-300 font-hebrew">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>מעצבי שיער מוסמכים</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>מוצרים מקצועיים</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>ניסיון של 10+ שנים</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>עיצוב אישי ומותאם</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>טיפולים מתקדמים</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>אווירה נעימה</span>
              </div>
            </div>
          </div>
        </div>
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
