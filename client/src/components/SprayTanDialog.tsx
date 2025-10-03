import { useState } from 'react';
import { ArrowLeft, X, UserPlus, Search, CreditCard, Droplets, Clock, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CustomerSearchDialog from "@/components/CustomerSearchDialog";
import { PurchaseOverlay } from "@/components/PurchaseOverlay";

interface SprayTanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SprayTanDialog({ open, onOpenChange }: SprayTanDialogProps) {
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);

  if (!open) return null;

  const sprayTanOptions = [
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
      color: "text-blue-500",
      onClick: () => {
        setShowCustomerSearch(true);
      }
    },
    {
      icon: CreditCard,
      title: "רכישת חבילה",
      color: "text-purple-500",
      onClick: () => {
        setShowPurchaseOverlay(true);
      }
    },
    {
      icon: Droplets,
      title: "טיפול מיידי",
      color: "text-cyan-500",
      onClick: () => {
        // Start immediate treatment
      }
    }
  ];

  const treatments = [
    {
      name: "אקספרס 8 דקות",
      duration: "8 דקות",
      description: "שיזוף מהיר למראה טבעי",
      price: "₪150",
      gradient: "from-pink-500/20 to-purple-500/20"
    },
    {
      name: "קלאסי 15 דקות",
      duration: "15 דקות",
      description: "טיפול שיזוף מלא ומושלם",
      price: "₪200",
      gradient: "from-purple-500/20 to-blue-500/20"
    },
    {
      name: "פרימיום 20 דקות",
      duration: "20 דקות",
      description: "שיזוף עמוק עם תוצאות לאורך זמן",
      price: "₪250",
      gradient: "from-blue-500/20 to-pink-500/20"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Pink/Purple Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-500/20 to-black opacity-90 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-purple-500/10" />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 right-6 z-30">
        <Button
          onClick={() => onOpenChange(false)}
          variant="outline"
          size="lg"
          className="bg-white/10 border-pink-500/30 text-white backdrop-blur-sm hover:bg-pink-500/20 hover:border-pink-500"
          data-testid="button-back-spray-tan"
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
            <Droplets className="w-12 h-12 text-pink-500" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 1))' }} />
            <h1 className="text-4xl font-bold text-white font-hebrew" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }}>
              שיזוף בהתזה
            </h1>
            <Sparkles className="w-10 h-10 text-purple-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 1))' }} />
          </div>
          
          {/* Pink Separator */}
          <div className="relative py-2 flex justify-center">
            <div 
              className="w-2/3 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" 
              style={{
                filter: 'drop-shadow(0 0 16px rgba(236, 72, 153, 1)) drop-shadow(0 0 32px rgba(168, 85, 247, 0.8))',
                boxShadow: '0 0 35px rgba(236, 72, 153, 1), 0 0 60px rgba(168, 85, 247, 0.8)'
              }}
            />
          </div>

          <p className="text-lg text-gray-300 font-hebrew max-w-2xl mx-auto">
            טכנולוגיית התזה מתקדמת לשיזוף אחיד ומושלם ללא חשיפה לשמש
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-8">
          {sprayTanOptions.map((option, index) => (
            <div
              key={index}
              onClick={option.onClick}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              data-testid={`spray-tan-action-${index}`}
            >
              <div 
                className="h-40 rounded-lg border-2 border-pink-500/30 bg-gradient-to-br from-gray-900/80 via-black/90 to-purple-900/30 backdrop-blur-sm flex flex-col items-center justify-center gap-3 transition-all duration-300 group-hover:border-pink-500 group-hover:shadow-2xl"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                }}
              >
                <option.icon 
                  className={`w-16 h-16 ${option.color} transition-all duration-300 group-hover:scale-110`}
                  style={{
                    filter: `drop-shadow(0 0 20px ${option.color.includes('pink') ? 'rgba(236, 72, 153, 1)' : 
                            option.color.includes('blue') ? 'rgba(59, 130, 246, 1)' :
                            option.color.includes('purple') ? 'rgba(168, 85, 247, 1)' : 
                            'rgba(6, 182, 212, 1)'})`
                  }}
                />
                <span className="text-white font-semibold text-center px-2 font-hebrew">{option.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Treatment Options */}
        <div className="px-8 space-y-4">
          <h2 className="text-2xl font-bold text-white text-center font-hebrew" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }}>
            סוגי טיפולים
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {treatments.map((treatment, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border border-pink-500/30 bg-gradient-to-br ${treatment.gradient} backdrop-blur-sm transition-all duration-300 hover:border-pink-500 hover:scale-105`}
                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}
                data-testid={`treatment-${index}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-pink-400" />
                  <h3 className="text-xl font-bold text-white font-hebrew">{treatment.name}</h3>
                </div>
                
                <p className="text-gray-300 text-sm mb-3 font-hebrew">{treatment.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 font-hebrew">{treatment.duration}</span>
                  <span className="text-2xl font-bold text-pink-400" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }}>
                    {treatment.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="px-8">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 text-center font-hebrew">יתרונות שיזוף בהתזה</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-300 font-hebrew">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>ללא קרינה מזיקה</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>תוצאות מיידיות</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>שיזוף אחיד</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>עמידות עד 10 ימים</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>מתאים לכל גוון עור</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>בטיחותי לחלוטין</span>
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
