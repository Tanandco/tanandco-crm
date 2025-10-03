import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, X, Check, Loader2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
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
  benefits?: string[];
  originalPrice?: number;
  popular?: boolean;
}

export function PurchaseOverlay({ open, onClose }: PurchaseOverlayProps) {
  const [step, setStep] = useState<'packages' | 'customer' | 'processing'>('packages');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const { toast } = useToast();

  const { data: packagesResponse, isLoading } = useQuery({
    queryKey: ['/api/packages'],
    enabled: open,
  });

  const packages: Package[] = Array.isArray(packagesResponse) 
    ? packagesResponse 
    : (packagesResponse as any)?.data ?? (packagesResponse as any)?.packages ?? [];

  const selectedPackage = packages.find(pkg => pkg.id === selectedPackageId);

  useEffect(() => {
    if (!open) {
      setStep('packages');
      setSelectedPackageId(null);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
    }
  }, [open]);

  const purchaseMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPackageId) throw new Error('No package selected');
      
      const response = await apiRequest('POST', '/api/payments/cardcom/session', {
        packageId: selectedPackageId,
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
      if (data?.data?.paymentUrl) {
        window.location.href = data.data.paymentUrl;
      } else {
        toast({
          title: '❌ שגיאה',
          description: 'לא ניתן ליצור סשן תשלום',
          variant: 'destructive'
        });
        setStep('customer');
      }
    },
    onError: (error: any) => {
      toast({
        title: '❌ שגיאה',
        description: error.message || 'שגיאה בתהליך התשלום',
        variant: 'destructive'
      });
      setStep('customer');
    }
  });

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackageId(packageId);
    setStep('customer');
  };

  const handleContinueToPayment = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast({
        title: '⚠️ שדות חובה',
        description: 'אנא מלא שם וטלפון',
        variant: 'destructive'
      });
      return;
    }

    const phoneRegex = /^(972|05)\d{8,9}$|^\+?972\d{8,9}$|^05\d{1}-?\d{7}$/;
    if (!phoneRegex.test(customerPhone)) {
      toast({
        title: '⚠️ מספר טלפון לא תקין',
        description: 'אנא הכנס מספר טלפון ישראלי תקין',
        variant: 'destructive'
      });
      return;
    }

    setStep('processing');
    purchaseMutation.mutate();
  };

  const handleBackToPackages = () => {
    setStep('packages');
    setSelectedPackageId(null);
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent 
        className="max-w-6xl max-h-[95vh] border-none overflow-hidden p-0 flex flex-col bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950"
      >
        <DialogTitle className="sr-only">רכישת חבילות שיזוף</DialogTitle>
        <DialogDescription className="sr-only">בחר חבילה והמשך לתשלום</DialogDescription>

        {/* Header */}
        <div 
          className="bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 backdrop-blur-lg border-b border-primary/40 px-6 py-2 shadow-lg"
          style={{ filter: 'drop-shadow(0 2px 8px hsl(var(--primary) / 0.3))' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 font-hebrew">
              <CreditCard 
                className="w-5 h-5 text-primary" 
                style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary)))' }}
              />
              רכישת חבילה
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10 h-8 w-8"
              data-testid="button-close-purchase"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-8">
          {step === 'packages' && (
            <div className="h-full flex flex-col">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-white mb-1 font-hebrew">בחר חבילה</h3>
                <p className="text-gray-300 text-sm">כל החבילות כוללות גישה למיטות השיזוף 24/7 בכל שעות היום ובכל שעות הלילה</p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-16 h-16 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-6 gap-3 w-full">
                  {packages.filter(pkg => pkg.type === 'sun-beds').map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className={`
                        relative p-3 cursor-pointer transition-all duration-300
                        hover:scale-105 hover:shadow-2xl
                        border-2 rounded-lg
                        flex flex-col
                        h-[280px]
                        ${selectedPackageId === pkg.id 
                          ? 'border-primary shadow-lg shadow-primary/50' 
                          : 'border-primary/30 hover:border-primary/60'
                        }
                        ${pkg.popular ? 'ring-2 ring-primary ring-offset-2 ring-offset-slate-950' : ''}
                        backdrop-blur-sm
                        animate-fade-in
                      `}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        background: selectedPackageId === pkg.id
                          ? 'linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--background)) 100%)'
                          : 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--primary) / 0.05) 100%)',
                        filter: pkg.popular 
                          ? 'drop-shadow(0 0 20px hsl(var(--primary) / 0.5))' 
                          : 'drop-shadow(0 0 15px hsl(var(--primary) / 0.2))',
                        boxShadow: selectedPackageId === pkg.id 
                          ? '0 0 30px hsl(var(--primary) / 0.4), 0 0 60px hsl(var(--primary) / 0.2)' 
                          : undefined
                      }}
                      onClick={() => handleSelectPackage(pkg.id)}
                      data-testid={`package-card-${pkg.id}`}
                    >
                      {/* Popular Badge */}
                      {pkg.popular && (
                        <div 
                          className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg animate-pulse"
                          style={{
                            filter: 'drop-shadow(0 0 10px hsl(var(--primary))) drop-shadow(0 0 20px hsl(var(--primary)))',
                            boxShadow: '0 0 20px hsl(var(--primary) / 0.6)'
                          }}
                        >
                          <Sparkles className="w-3 h-3" />
                          פופולרי
                        </div>
                      )}

                      {/* Package Name - Fixed Height */}
                      <h3 className="text-sm font-bold text-foreground mb-1 text-center font-hebrew leading-tight h-8 flex items-center justify-center">
                        {pkg.nameHe}
                      </h3>

                      {/* Sessions Count */}
                      <div className="text-center mb-2">
                        <span 
                          className="text-2xl font-bold text-primary"
                          style={{
                            filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.5))',
                            textShadow: '0 0 10px hsl(var(--primary) / 0.5)'
                          }}
                        >
                          {pkg.sessions}
                        </span>
                        <span className="text-xs text-muted-foreground mr-1">
                          {pkg.sessions === 1 ? 'כניסה' : 'כניסות'}
                        </span>
                      </div>

                      {/* Price - Fixed Height */}
                      <div className="text-center mb-2 h-16 flex flex-col justify-center">
                        <div className="h-4">
                          {pkg.originalPrice ? (
                            <div className="text-xs text-muted-foreground line-through">
                              ₪{pkg.originalPrice}
                            </div>
                          ) : (
                            <div className="h-4"></div>
                          )}
                        </div>
                        <div 
                          className="text-xl font-bold text-foreground"
                          style={{
                            filter: 'drop-shadow(0 0 6px hsl(var(--primary) / 0.3))'
                          }}
                        >
                          ₪{pkg.price}
                        </div>
                        <div className="h-4">
                          {pkg.sessions > 1 ? (
                            <div className="text-xs text-muted-foreground">
                              (₪{(pkg.price / pkg.sessions).toFixed(1)} לכניסה)
                            </div>
                          ) : (
                            <div className="h-4"></div>
                          )}
                        </div>
                      </div>

                      {/* Benefits - Fixed Height */}
                      <div className="flex-1 mb-2 h-12 overflow-hidden">
                        {pkg.benefits && pkg.benefits.length > 0 ? (
                          <div className="space-y-1">
                            {pkg.benefits.slice(0, 2).map((benefit, i) => (
                              <div key={i} className="flex items-start gap-1">
                                <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-muted-foreground font-hebrew leading-tight">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-12"></div>
                        )}
                      </div>

                      {/* Select Button - Always at bottom */}
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPackage(pkg.id);
                        }}
                        className={`
                          w-full h-7 text-xs transition-all duration-300 mt-auto
                          ${selectedPackageId === pkg.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
                          }
                        `}
                        data-testid={`button-select-package-${pkg.id}`}
                      >
                        {selectedPackageId === pkg.id ? 'נבחר' : 'בחר'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'customer' && selectedPackage && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-3 font-hebrew">פרטי לקוח</h3>
                <p className="text-gray-300 text-lg mb-6">אנא מלא את הפרטים שלך להמשך התשלום</p>
                
                {/* Selected Package Summary */}
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 mb-8">
                  <p className="text-gray-400 text-sm mb-2">חבילה נבחרת:</p>
                  <h4 className="text-2xl font-bold text-primary mb-2">{selectedPackage.nameHe}</h4>
                  <div className="flex items-center justify-center gap-6 text-white">
                    <span className="text-lg">{selectedPackage.sessions} כניסות</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-2xl font-bold">₪{selectedPackage.price}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white text-lg mb-3 font-hebrew">שם מלא *</label>
                  <Input 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="הכנס שם מלא" 
                    className="bg-black/50 border-primary/30 text-white h-14 text-lg"
                    data-testid="input-customer-name"
                  />
                </div>

                <div>
                  <label className="block text-white text-lg mb-3 font-hebrew">טלפון *</label>
                  <Input 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="05XXXXXXXX" 
                    className="bg-black/50 border-primary/30 text-white h-14 text-lg"
                    data-testid="input-customer-phone"
                  />
                </div>

                <div>
                  <label className="block text-white text-lg mb-3 font-hebrew">אימייל (אופציונלי)</label>
                  <Input 
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@example.com" 
                    type="email"
                    className="bg-black/50 border-primary/30 text-white h-14 text-lg"
                    data-testid="input-customer-email"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={handleBackToPackages}
                  className="flex-1 h-14 text-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
                  data-testid="button-back-to-packages"
                >
                  <ArrowRight className="w-5 h-5 ml-2" />
                  חזור לבחירת חבילה
                </Button>
                
                <Button
                  onClick={handleContinueToPayment}
                  className="flex-1 h-14 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary font-bold"
                  data-testid="button-continue-to-payment"
                >
                  המשך לתשלום
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-20 h-20 animate-spin text-primary mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">מעביר לתשלום מאובטח...</h3>
              <p className="text-gray-300 text-lg">אנא המתן, מעביר אותך לעמוד התשלום של Cardcom</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
