import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Minus, CreditCard, ShoppingCart } from 'lucide-react';
import TanningProductCarouselCompact from './TanningProductCarouselCompact';

interface AdvancedPurchaseOverlayProps {
  open: boolean;
  onClose: () => void;
}

interface Package {
  id: string;
  name: string;
  sessions: number;
  price: number;
  benefits: string[];
}

export function AdvancedPurchaseOverlay({ open, onClose }: AdvancedPurchaseOverlayProps) {
  const [customTanSessions, setCustomTanSessions] = useState(4);
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const packages: Package[] = [
    {
      id: 'single-entry',
      name: 'בודדת כניסה אחת',
      sessions: 1,
      price: 70,
      benefits: ['ללא התחייבות']
    },
    {
      id: '8-entries',
      name: 'כרטיסיית 8 כניסות',
      sessions: 8,
      price: 220,
      benefits: ['8 כניסות', '₪27.5 לכניסה']
    },
    {
      id: 'home-package',
      name: 'כרטיסיית הבית',
      sessions: 13,
      price: 300,
      benefits: ['10 כניסות + 3 במתנה', '₪23 לכניסה + ברונזר']
    },
    {
      id: 'small-touch',
      name: 'ככה בקטנה',
      sessions: 3,
      price: 220,
      benefits: ['3 כניסות + ברונזר']
    },
    {
      id: 'beginners-package',
      name: 'חבילה למתחילים',
      sessions: 6,
      price: 360,
      benefits: ['6 כניסות + ברונזר איכותי']
    },
    {
      id: 'most-profitable',
      name: '⭐ הכי משתלם!',
      sessions: 10,
      price: 400,
      benefits: ['חבילת 10 כניסות', '10 כניסות + ברונזר איכותי']
    }
  ];

  const updateCart = (itemId: string, change: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const getTotalPrice = () => {
    let total = 0;
    Object.entries(cart).forEach(([itemId, quantity]) => {
      if (quantity > 0) {
        const package_ = packages.find(p => p.id === itemId);
        const price = package_?.price || 0;
        total += price * quantity;
      }
    });
    return total;
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent 
        className="max-w-none w-screen h-screen border-none overflow-hidden p-0 m-0 flex flex-col"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          transform: 'none',
          margin: 0
        }}
      >
        {/* Purple Neon Overlay Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-purple-500/50 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-70" />
        </div>

        <DialogTitle className="sr-only">חנות מוצרי שיזוף וחבילות</DialogTitle>
        <DialogDescription className="sr-only">בחר מוצרי שיזוף וחבילות כניסות למיטות שיזוף</DialogDescription>

        {/* Header */}
        <div 
          className="relative bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 backdrop-blur-lg border-b border-primary/40 px-3 py-1.5 shadow-lg z-10"
          style={{ filter: 'drop-shadow(0 2px 8px hsl(var(--primary) / 0.3))' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 font-hebrew">
              <CreditCard 
                className="w-3.5 h-3.5 text-primary" 
                style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary)))' }}
              />
              רכישת כרטיסיות ומוצרים
            </h2>
            <div className="flex items-center gap-4">
              {getTotalItems() > 0 && (
                <div className="flex items-center gap-2 bg-primary/20 px-2 py-0.5 rounded-full">
                  <ShoppingCart className="w-3.5 h-3.5 text-primary" />
                  <span className="text-white font-bold text-sm">{getTotalItems()}</span>
                  <span className="text-primary font-bold text-sm">₪{getTotalPrice()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1 flex flex-col pt-2 pb-1 px-2 space-y-1 overflow-hidden z-10">
          {/* Packages Section */}
          <div className="w-full">
            <h3 className="text-xs font-bold text-white mb-0.5 text-center font-hebrew">חבילות שיזוף</h3>
            <div className="grid grid-cols-7 gap-2 px-1" style={{ height: '160px' }}>
              {packages.map(pkg => (
                <div
                  key={pkg.id}
                  className="bg-gradient-to-br from-background via-background/95 to-primary/5 backdrop-blur-sm border-2 border-primary/50 rounded-lg p-2 hover:border-primary transition-all duration-300 group hover:scale-[1.05] flex flex-col w-full shadow-2xl hover:shadow-primary/50 relative overflow-hidden"
                  style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(8px)',
                    transform: 'translateZ(0)',
                    filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.4))'
                  }}
                  data-testid={`package-${pkg.id}`}
                >
                  {/* Enhanced inner glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/2 via-primary/2 to-white/2 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                  <div className="text-center mb-0.5 flex-1">
                    <h4 className="text-[10px] font-bold text-white mb-0.5 relative z-10 font-hebrew leading-tight">{pkg.name}</h4>
                    <div className="text-primary text-xl font-bold mb-0.5 relative z-10">₪{pkg.price}</div>
                    {pkg.sessions > 1 && pkg.sessions < 999 && (
                      <p className="text-gray-300 text-[9px] relative z-10 font-hebrew">{pkg.sessions} כניסות</p>
                    )}
                  </div>

                  <div className="space-y-0.5 mb-0.5 flex-1 relative z-10">
                    {pkg.benefits.slice(0, 1).map((benefit, index) => (
                      <div key={index} className="flex items-center gap-1 text-[9px] text-gray-300 font-hebrew justify-center">
                        <div className="w-0.5 h-0.5 bg-primary rounded-full flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center relative z-10">
                    <Button
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-bold px-2 py-1.5 text-[10px] w-full transition-all duration-300 hover:scale-105 font-hebrew"
                      style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.5))' }}
                      onClick={() => {
                        console.log(`רכישת חבילה: ${pkg.name}`);
                      }}
                      data-testid={`button-purchase-${pkg.id}`}
                    >
                      רכוש עכשיו
                    </Button>
                  </div>
                </div>
              ))}

              {/* Build Your Tan Package */}
              <div
                className="bg-gradient-to-br from-background via-background/95 to-purple-500/10 backdrop-blur-sm border-2 border-purple-400/60 rounded-lg p-2 hover:border-purple-400 transition-all duration-300 group hover:scale-[1.05] flex flex-col w-full shadow-2xl hover:shadow-purple-500/50 relative overflow-hidden"
                style={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(8px)',
                  transform: 'translateZ(0)',
                  filter: 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.6))'
                }}
                data-testid="package-custom"
              >
                {/* Enhanced inner glow effect - purple variant */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/2 via-purple-500/3 to-white/2 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                <div className="text-center mb-0.5 relative z-10">
                  <h4 className="text-[10px] font-bold text-white mb-0.5 font-hebrew leading-tight">בנה את השיזוף שלך</h4>
                  <div className="text-purple-400 text-lg font-bold mb-0.5">₪{customTanSessions * 40}</div>
                  <p className="text-gray-300 text-[9px] font-hebrew">{customTanSessions} כניסות - ₪40 לכניסה</p>
                </div>

                <div className="flex items-center justify-center mb-0.5 relative z-10">
                  <div className="flex items-center space-x-2 bg-black/50 rounded-lg px-1.5 py-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 text-white hover:bg-white/20"
                      onClick={() => setCustomTanSessions(Math.max(4, customTanSessions - 1))}
                      data-testid="button-decrease-sessions"
                    >
                      <Minus className="h-2 w-2" />
                    </Button>

                    <span className="text-white font-bold text-xs min-w-[1.2rem] text-center">
                      {customTanSessions}
                    </span>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 text-white hover:bg-white/20"
                      onClick={() => setCustomTanSessions(Math.min(20, customTanSessions + 1))}
                      data-testid="button-increase-sessions"
                    >
                      <Plus className="h-2 w-2" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-0.5 mb-0.5 flex-1 relative z-10">
                  {customTanSessions >= 10 && (
                    <div className="flex items-center gap-1 text-[9px] text-green-400 animate-pulse font-hebrew justify-center">
                      <div className="w-0.5 h-0.5 bg-green-400 rounded-full flex-shrink-0" />
                      🎁 ברונזר במתנה!
                    </div>
                  )}
                </div>

                <Button
                  className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold px-2 py-1.5 text-[10px] w-full transition-all duration-300 hover:scale-105 relative z-10 font-hebrew"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(147, 51, 234, 0.7))' }}
                  onClick={() => {
                    console.log(`Build your tan: ${customTanSessions} sessions for ₪${customTanSessions * 40}`);
                  }}
                  data-testid="button-purchase-custom"
                >
                  רכוש עכשיו
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer - Checkout */}
        <div className="relative bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 backdrop-blur-lg border-t border-primary/40 px-3 py-2 shadow-lg z-10">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-hebrew text-sm h-9"
              data-testid="button-close-overlay"
            >
              סגור
            </Button>

            {getTotalItems() > 0 && (
              <Button
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold px-4 py-2 text-sm font-hebrew h-9"
                style={{ filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.7))' }}
                data-testid="button-checkout"
              >
                <CreditCard className="w-3.5 h-3.5 ml-2" />
                לתשלום (₪{getTotalPrice()})
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
