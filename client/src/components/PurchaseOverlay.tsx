import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, X, Check, Loader2 } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface PurchaseOverlayProps {
  open: boolean;
  onClose: () => void;
}

interface Package {
  id: string;
  nameHe: string;
  nameEn: string;
  type: string;
  sessions: number;
  price: number;
  currency: string;
  descriptionHe?: string;
}

export function PurchaseOverlay({ open, onClose }: PurchaseOverlayProps) {
  const [step, setStep] = useState<'customer' | 'packages'>('customer');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const { toast } = useToast();

  const { data: packagesData, isLoading } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
    enabled: step === 'packages',
  });

  const packages = packagesData || [];

  const purchaseMutation = useMutation({
    mutationFn: async ({ packageId }: { packageId: string }) => {
      const response = await apiRequest('POST', '/api/payments/cardcom/session', {
        packageId,
        customerName,
        customerPhone,
        customerEmail,
        customerId: 'guest',
        successUrl: `${window.location.origin}/payment-success`,
        errorUrl: `${window.location.origin}/payment-error`,
        indicatorUrl: `${window.location.origin}/api/webhooks/cardcom/payment`,
      });
      return response;
    },
    onSuccess: (data: any) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast({
          title: '❌ שגיאה',
          description: 'לא ניתן ליצור סשן תשלום',
          variant: 'destructive'
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: '❌ שגיאה',
        description: error.message || 'שגיאה בתהליך התשלום',
        variant: 'destructive'
      });
    }
  });

  const handleContinue = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast({
        title: '⚠️ שדות חובה',
        description: 'אנא מלא שם וטלפון',
        variant: 'destructive'
      });
      return;
    }
    setStep('packages');
  };

  const handlePurchase = (packageId: string) => {
    purchaseMutation.mutate({ packageId });
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] border-none overflow-hidden p-0 flex flex-col"
      >
        <DialogTitle className="sr-only">רכישת חבילות שיזוף</DialogTitle>
        <DialogDescription className="sr-only">בחר חבילה והמשך לתשלום</DialogDescription>

        {/* Header */}
        <div 
          className="bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 backdrop-blur-lg border-b border-primary/40 px-6 py-4 shadow-lg"
          style={{ filter: 'drop-shadow(0 2px 8px hsl(var(--primary) / 0.3))' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-3 font-hebrew">
              <CreditCard 
                className="w-6 h-6 text-primary" 
                style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary)))' }}
              />
              רכישת כרטיסיה
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
              data-testid="button-close-purchase"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950">
          {step === 'customer' ? (
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">פרטי לקוח</h3>
                <p className="text-gray-300">אנא מלא את הפרטים שלך להמשך התשלום</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2 font-hebrew">שם מלא *</label>
                  <Input 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="הכנס שם מלא" 
                    className="bg-black/50 border-primary/30 text-white h-12 text-lg"
                    data-testid="input-customer-name"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-hebrew">טלפון *</label>
                  <Input 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="05XXXXXXXX" 
                    className="bg-black/50 border-primary/30 text-white h-12 text-lg"
                    data-testid="input-customer-phone"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-hebrew">אימייל (אופציונלי)</label>
                  <Input 
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@example.com" 
                    className="bg-black/50 border-primary/30 text-white h-12 text-lg"
                    data-testid="input-customer-email"
                  />
                </div>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full h-14 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary font-bold"
                data-testid="button-continue-to-packages"
              >
                המשך לבחירת חבילה
              </Button>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">בחר חבילה</h3>
                <p className="text-gray-300">כל החבילות כוללות גישה למיטות השיזוף המתקדמות ביותר</p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.filter(pkg => pkg.type === 'sun-beds').map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-2 border-primary/40 rounded-2xl p-6 hover:border-primary transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-primary/50"
                      style={{
                        filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.3))'
                      }}
                      data-testid={`package-card-${pkg.id}`}
                    >
                      {/* Package Info */}
                      <div className="text-center mb-6">
                        <h4 className="text-xl font-bold text-white mb-2 font-hebrew">{pkg.nameHe}</h4>
                        {pkg.descriptionHe && (
                          <p className="text-gray-300 text-sm mb-4 font-hebrew">{pkg.descriptionHe}</p>
                        )}
                        
                        {/* Sessions */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <div className="bg-primary/20 px-4 py-2 rounded-lg">
                            <span className="text-primary font-bold text-lg">{pkg.sessions}</span>
                            <span className="text-white text-sm mr-2">כניסות</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-center">
                          <div className="text-4xl font-bold text-primary mb-1">₪{pkg.price}</div>
                          {pkg.sessions > 1 && pkg.sessions < 999 && (
                            <p className="text-gray-400 text-sm">₪{Math.round(pkg.price / pkg.sessions)} לכניסה</p>
                          )}
                        </div>
                      </div>

                      {/* Purchase Button */}
                      <Button
                        onClick={() => handlePurchase(pkg.id)}
                        disabled={purchaseMutation.isPending}
                        className="w-full h-12 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary font-bold"
                        data-testid={`button-purchase-${pkg.id}`}
                      >
                        {purchaseMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                            מעביר לתשלום...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5 ml-2" />
                            רכוש עכשיו
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={() => setStep('customer')}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  data-testid="button-back-to-customer"
                >
                  חזור לעריכת פרטים
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
