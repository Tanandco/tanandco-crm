import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, Wallet, Smartphone, Building2, Apple, 
  Smartphone as GooglePay, CheckCircle, X, Loader2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  totalAmount: number;
  customerId?: string;
  customerName?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  onPaymentSuccess: (transactionId: string, paymentMethod: string) => void;
}

type PaymentMethod = 'cash' | 'card' | 'bit' | 'transfer' | 'apple-pay' | 'google-pay';

export default function PaymentDialog({
  open,
  onClose,
  totalAmount,
  customerId,
  customerName,
  items,
  onPaymentSuccess,
}: PaymentDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [cashReceived, setCashReceived] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setSelectedMethod(null);
      setCashReceived('');
    }
  }, [open]);

  const paymentMethods: Array<{ id: PaymentMethod; label: string; icon: any; color: string }> = [
    { id: 'cash', label: 'מזומן', icon: Wallet, color: 'from-green-500 to-emerald-600' },
    { id: 'card', label: 'אשראי', icon: CreditCard, color: 'from-blue-500 to-cyan-600' },
    { id: 'bit', label: 'ביט', icon: Smartphone, color: 'from-purple-500 to-pink-600' },
    { id: 'transfer', label: 'העברה בנקאית', icon: Building2, color: 'from-indigo-500 to-blue-600' },
    { id: 'apple-pay', label: 'אפל פיי', icon: Apple, color: 'from-gray-700 to-gray-900' },
    { id: 'google-pay', label: 'גוגל פיי', icon: GooglePay, color: 'from-blue-400 to-blue-600' },
  ];

  const calculateChange = () => {
    if (!cashReceived || !selectedMethod || selectedMethod !== 'cash') return 0;
    const received = parseFloat(cashReceived);
    if (isNaN(received) || received < totalAmount) return 0;
    return received - totalAmount;
  };

  const change = calculateChange();
  const isValidCashPayment = selectedMethod === 'cash' && cashReceived && parseFloat(cashReceived) >= totalAmount;

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: 'בחר אמצעי תשלום',
        description: 'אנא בחר אמצעי תשלום',
        variant: 'destructive',
      });
      return;
    }

    if (selectedMethod === 'cash' && !isValidCashPayment) {
      toast({
        title: 'סכום לא תקין',
        description: 'סכום המזומן חייב להיות גדול או שווה לסכום התשלום',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Process payment based on method
      let transactionId: string;
      let paymentResult: any;

      switch (selectedMethod) {
        case 'cash':
          // Cash payment - open drawer and print receipt
          paymentResult = await apiRequest('POST', '/api/payments/pos/process', {
            customerId: customerId || 'guest',
            customerName: customerName || 'אורח',
            amount: totalAmount,
            currency: 'ILS',
            paymentMethod: 'cash',
            items,
            cashReceived: parseFloat(cashReceived),
            change,
          });
          transactionId = paymentResult.data?.transactionId || `cash-${Date.now()}`;
          break;

        case 'card':
          // Card payment via Max (physical POS)
          paymentResult = await apiRequest('POST', '/api/payments/max/process', {
            amount: totalAmount,
            currency: 'ILS',
            customerId: customerId || 'guest',
            customerName: customerName || 'אורח',
            customerPhone: '',
            description: `POS Sale - ${items.length} items`,
            transactionType: 'charge',
          });
          if (!paymentResult.success) {
            throw new Error(paymentResult.error || 'תשלום אשראי נכשל');
          }
          transactionId = paymentResult.data?.transactionId || `card-${Date.now()}`;
          break;

        case 'bit':
          // Bit payment (Israeli payment app)
          paymentResult = await apiRequest('POST', '/api/payments/bit/process', {
            amount: totalAmount,
            currency: 'ILS',
            customerId: customerId || 'guest',
            customerName: customerName || 'אורח',
            items,
          });
          if (!paymentResult.success) {
            throw new Error(paymentResult.error || 'תשלום ביט נכשל');
          }
          transactionId = paymentResult.data?.transactionId || `bit-${Date.now()}`;
          break;

        case 'transfer':
          // Bank transfer - manual confirmation
          paymentResult = await apiRequest('POST', '/api/payments/transfer/process', {
            amount: totalAmount,
            currency: 'ILS',
            customerId: customerId || 'guest',
            customerName: customerName || 'אורח',
            items,
          });
          transactionId = paymentResult.data?.transactionId || `transfer-${Date.now()}`;
          break;

        case 'apple-pay':
        case 'google-pay':
          // Digital wallet payment
          paymentResult = await apiRequest('POST', '/api/payments/digital-wallet/process', {
            amount: totalAmount,
            currency: 'ILS',
            customerId: customerId || 'guest',
            customerName: customerName || 'אורח',
            walletType: selectedMethod,
            items,
          });
          if (!paymentResult.success) {
            throw new Error(paymentResult.error || `תשלום ${selectedMethod === 'apple-pay' ? 'אפל פיי' : 'גוגל פיי'} נכשל`);
          }
          transactionId = paymentResult.data?.transactionId || `${selectedMethod}-${Date.now()}`;
          break;

        default:
          throw new Error('אמצעי תשלום לא נתמך');
      }

      // Success - notify parent and close
      onPaymentSuccess(transactionId, selectedMethod);
      toast({
        title: '✅ תשלום הושלם',
        description: `תשלום בוצע בהצלחה באמצעות ${paymentMethods.find(m => m.id === selectedMethod)?.label}`,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: '❌ שגיאה בתשלום',
        description: error.message || 'אירעה שגיאה בעיבוד התשלום',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700 text-white" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-pink-400" />
            תשלום
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            סכום לתשלום: <span className="text-pink-400 font-bold text-lg">₪{totalAmount.toFixed(2)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Payment Methods Grid */}
          <div>
            <Label className="text-slate-300 mb-3 block">בחר אמצעי תשלום:</Label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                return (
                  <Button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    variant={isSelected ? 'default' : 'outline'}
                    className={`
                      h-20 flex flex-col items-center justify-center gap-2
                      ${isSelected 
                        ? `bg-gradient-to-br ${method.color} text-white border-0` 
                        : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                      }
                      transition-all duration-200
                    `}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{method.label}</span>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 absolute top-1 left-1" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Cash Payment Input */}
          {selectedMethod === 'cash' && (
            <div className="space-y-2">
              <Label htmlFor="cashReceived" className="text-slate-300">
                סכום מזומן שהתקבל:
              </Label>
              <Input
                id="cashReceived"
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder="0.00"
                className="bg-slate-800 border-slate-600 text-white text-lg"
                autoFocus
              />
              {change > 0 && (
                <div className="text-green-400 font-semibold text-lg">
                  עודף: ₪{change.toFixed(2)}
                </div>
              )}
              {cashReceived && parseFloat(cashReceived) < totalAmount && (
                <div className="text-red-400 text-sm">
                  חסר: ₪{(totalAmount - parseFloat(cashReceived)).toFixed(2)}
                </div>
              )}
            </div>
          )}

          {/* Payment Summary */}
          {selectedMethod && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400">אמצעי תשלום:</span>
                <span className="text-white font-semibold">
                  {paymentMethods.find(m => m.id === selectedMethod)?.label}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400">סכום:</span>
                <span className="text-white font-semibold">₪{totalAmount.toFixed(2)}</span>
              </div>
              {selectedMethod === 'cash' && change > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">עודף:</span>
                  <span className="text-green-400 font-semibold">₪{change.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <X className="w-4 h-4 ml-2" />
            ביטול
          </Button>
          <Button
            onClick={handlePayment}
            disabled={!selectedMethod || (selectedMethod === 'cash' && !isValidCashPayment) || isProcessing}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                מעבד...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 ml-2" />
                אישור תשלום
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

