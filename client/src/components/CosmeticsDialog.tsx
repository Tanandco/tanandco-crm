import { useState } from 'react';
import { ArrowLeft, X, Star, Sparkles, Droplet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NewClientDialog } from "@/components/NewClientDialog";
import CustomerSearchDialog from "@/components/CustomerSearchDialog";
import { PurchaseOverlay } from "@/components/PurchaseOverlay";
import EyebrowsDialog from "@/components/EyebrowsDialog";
import RivkaManicureDialog from "@/components/RivkaManicureDialog";
import ShayManicureDialog from "@/components/ShayManicureDialog";
import searchIcon from '@assets/3_1759474572534.png';
import packageIcon from '@assets/member-card-icon.png';
import newCustomerIcon from '@assets/Dהורדותfreepik__spray-tan-variation-b-modern-flatbadge-3d-spray-gu__47717.png_1759805942437.png';

interface CosmeticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CosmeticsDialog({ open, onOpenChange }: CosmeticsDialogProps) {
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);
  const [showEyebrowsDialog, setShowEyebrowsDialog] = useState(false);
  const [showRivkaDialog, setShowRivkaDialog] = useState(false);
  const [showShayDialog, setShowShayDialog] = useState(false);

  if (!open) return null;

  const cosmeticsActions: Array<{
    title: string;
    subtitle?: string;
    byLine?: string;
    icon: any;
    onClick: () => void;
  }> = [
    {
      title: "אומנות גבות",
      byLine: "BY ELIT EYEBROWS",
      icon: Droplet,
      onClick: () => {
        setShowEyebrowsDialog(true);
      }
    },
    {
      title: "מניקור גל",
      byLine: "BY רבקה סולטן",
      icon: Droplet,
      onClick: () => {
        setShowRivkaDialog(true);
      }
    },
    {
      title: "מניקור ג'ל",
      byLine: "BY שי לניאדו",
      icon: Droplet,
      onClick: () => {
        setShowShayDialog(true);
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        @keyframes flow-gradient-border {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 200% 200%;
          }
        }
        
        .flowing-border-cosmetics {
          position: relative;
        }
        
        .flowing-border-cosmetics::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 0.375rem;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(236, 72, 153, 0.8),
            rgba(168, 85, 247, 0.6),
            rgba(139, 92, 246, 0.8),
            rgba(236, 72, 153, 0.6),
            rgba(168, 85, 247, 0.8)
          );
          background-size: 200% 200%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: flow-gradient-border 3s linear infinite;
          pointer-events: none;
        }
      `}</style>
      {/* Pink/Purple Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-pink-500/20 to-black opacity-90 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-pink-500/10" />
      </div>

      {/* Back Button */}
      <div className="absolute top-4 md:top-6 right-4 md:right-6 z-30">
        <Button
          onClick={() => onOpenChange(false)}
          variant="outline"
          size="icon"
          className="bg-white/10 border-white/20 text-white backdrop-blur-sm h-10 w-10 md:h-auto md:w-auto md:px-4"
          data-testid="button-back-cosmetics"
        >
          <ArrowLeft className="w-5 h-5 md:ml-2" />
          <span className="hidden md:inline">חזרה לשירות עצמי</span>
        </Button>
      </div>

      {/* Content Container - Centered */}
      <div className="relative w-full max-w-4xl flex items-center justify-center">
        {/* Service Fields - Grid on mobile, Row on desktop */}
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:flex gap-4 md:gap-8 justify-center animate-scale-in">
            {cosmeticsActions.map((action, index) => (
              <div key={index} className="relative">
                {/* Solid black background */}
                <div className="absolute inset-0 bg-black rounded-md" />
                
                <button
                  onClick={action.onClick}
                  className="
                    group relative h-[120px] w-full md:h-[280px] md:w-[450px]
                    bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
                    border-0
                    rounded-md backdrop-blur-sm
                    flex items-center justify-center
                    transition-all duration-150 ease-in-out
                    hover-elevate active-elevate-2
                    flowing-border-cosmetics
                  "
                  style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}
                  data-testid={`cosmetics-action-${index}`}
                >
                  <div className="px-4 text-center space-y-1 md:space-y-2">
                    <div className="inline-block p-3 md:p-4 rounded-full mx-auto bg-black/40" style={{ boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.8), inset 0 -2px 6px rgba(255, 255, 255, 0.1)' }}>
                      <action.icon 
                        className="w-8 h-8 md:w-12 md:h-12 text-gray-800"
                      />
                    </div>
                    <p className="text-white text-base md:text-2xl font-bold leading-tight font-hebrew">
                      {action.title}
                    </p>
                    {action.subtitle && (
                      <p className="text-pink-300 text-xs md:text-sm font-medium leading-tight">
                        {action.subtitle}
                      </p>
                    )}
                    {action.byLine && (
                      <p className="text-pink-400 text-[10px] md:text-xs font-semibold leading-tight">
                        {action.byLine}
                      </p>
                    )}
                  </div>

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

      {/* Eyebrows Dialog */}
      <EyebrowsDialog
        open={showEyebrowsDialog}
        onOpenChange={setShowEyebrowsDialog}
      />

      {/* Rivka Manicure Dialog */}
      <RivkaManicureDialog
        open={showRivkaDialog}
        onOpenChange={setShowRivkaDialog}
      />

      {/* Shay Manicure Dialog */}
      <ShayManicureDialog
        open={showShayDialog}
        onOpenChange={setShowShayDialog}
      />
    </div>
  );
}
