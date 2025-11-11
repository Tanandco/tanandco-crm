import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { XCircle, Home, RefreshCw } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

export default function PaymentError() {
  const [, setLocation] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const customerId = urlParams.get('customerId');

  const handleRetry = () => {
    // Navigate back to home to retry purchase
    setLocation('/');
  };

  return (
    <PageLayout showLogo={true} showHomeButton={true} showBackButton={false} maxWidth="max-w-2xl">
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full p-8 backdrop-blur-xl border-red-500/30"
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(0, 0, 0, 0.8) 100%)',
            boxShadow: '0 0 60px rgba(239, 68, 68, 0.3), 0 0 120px rgba(239, 68, 68, 0.15)',
          }}
        >
          <div className="text-center space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div 
                className="rounded-full p-4 animate-pulse"
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  boxShadow: '0 0 40px rgba(239, 68, 68, 0.5), 0 0 80px rgba(239, 68, 68, 0.3)',
                }}
              >
                <XCircle 
                  className="w-24 h-24 text-red-500"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.8)) drop-shadow(0 0 40px rgba(239, 68, 68, 0.4))',
                  }}
                />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h1 
                className="text-4xl font-bold text-white font-hebrew"
                style={{
                  textShadow: '0 0 20px rgba(239, 68, 68, 0.6)',
                }}
                data-testid="text-error-title"
              >
                התשלום לא הושלם
              </h1>
              <p className="text-xl text-gray-300 font-hebrew" data-testid="text-error-subtitle">
                משהו השתבש בתהליך התשלום
              </p>
            </div>

            {/* Information */}
            <div 
              className="p-6 rounded-lg space-y-3"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <p className="text-gray-300 font-hebrew leading-relaxed" data-testid="text-payment-cancelled">
                התשלום בוטל או נכשל. לא חויבת בתשלום.
              </p>
              <p className="text-gray-400 text-sm font-hebrew leading-relaxed" data-testid="text-possible-reasons">
                ייתכן ש:
              </p>
              <ul className="text-gray-300 text-sm space-y-2 text-right list-disc list-inside">
                <li>ביטלת את התשלום</li>
                <li>פרטי האשראי שגויים</li>
                <li>אין מספיק יתרה בכרטיס</li>
                <li>הייתה תקלה זמנית</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                size="lg"
                onClick={handleRetry}
                className="w-full h-14 text-lg font-hebrew"
                data-testid="button-retry"
                style={{
                  background: 'linear-gradient(135deg, rgba(69, 114, 182, 0.8) 0%, rgba(69, 114, 182, 0.6) 100%)',
                  boxShadow: '0 0 30px rgba(69, 114, 182, 0.5), 0 0 60px rgba(69, 114, 182, 0.3)',
                }}
              >
                <RefreshCw className="w-5 h-5 ml-2" />
                נסה שוב
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation('/')}
                className="w-full h-14 text-lg font-hebrew border-primary/30 hover:bg-primary/10"
                data-testid="button-home"
              >
                <Home className="w-5 h-5 ml-2" />
                חזרה למסך הבית
              </Button>
            </div>

            {/* Support Info */}
            <p className="text-sm text-gray-400 font-hebrew pt-4" data-testid="text-support-help">
              זקוק לעזרה? פנה אלינו ב-WhatsApp או בטלפון
            </p>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
