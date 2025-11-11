import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Home, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const customerId = urlParams.get('customerId');
  const packageId = urlParams.get('packageId');

  useEffect(() => {
    const confettiDuration = 3000;
    const endTime = Date.now() + confettiDuration;

    const frame = () => {
      if (Date.now() < endTime) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <PageLayout showLogo={true} showHomeButton={true} showBackButton={false} maxWidth="max-w-2xl">
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full p-8 backdrop-blur-xl border-primary/30"
          style={{
            background: 'linear-gradient(135deg, rgba(69, 114, 182, 0.15) 0%, rgba(0, 0, 0, 0.8) 100%)',
            boxShadow: '0 0 60px rgba(69, 114, 182, 0.3), 0 0 120px rgba(69, 114, 182, 0.15)',
          }}
        >
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div 
                className="rounded-full p-4 animate-pulse"
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  boxShadow: '0 0 40px rgba(34, 197, 94, 0.5), 0 0 80px rgba(34, 197, 94, 0.3)',
                }}
              >
                <CheckCircle 
                  className="w-24 h-24 text-green-500"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.8)) drop-shadow(0 0 40px rgba(34, 197, 94, 0.4))',
                  }}
                />
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-3">
              <h1 
                className="text-4xl font-bold text-white font-hebrew"
                style={{
                  textShadow: '0 0 20px rgba(69, 114, 182, 0.6)',
                }}
                data-testid="text-success-title"
              >
                התשלום בוצע בהצלחה!
              </h1>
              <p className="text-xl text-gray-300 font-hebrew" data-testid="text-thank-you">
                תודה על הרכישה
              </p>
            </div>

            {/* Information */}
            <div 
              className="p-6 rounded-lg space-y-3"
              style={{
                background: 'rgba(69, 114, 182, 0.1)',
                border: '1px solid rgba(69, 114, 182, 0.3)',
              }}
            >
              <p className="text-gray-300 font-hebrew leading-relaxed" data-testid="text-package-activated">
                החבילה שלך הופעלה בהצלחה!
              </p>
              <p className="text-gray-400 text-sm font-hebrew leading-relaxed" data-testid="text-whatsapp-info">
                קיבלת הודעת אישור ב-WhatsApp עם קישורים להשלמת ההרשמה:
              </p>
              <ul className="text-gray-300 text-sm space-y-2 text-right">
                <li className="flex items-center justify-end gap-2">
                  <span>טופס בריאות</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </li>
                <li className="flex items-center justify-end gap-2">
                  <span>רישום זיהוי פנים</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                size="lg"
                onClick={() => setLocation('/')}
                className="w-full h-14 text-lg font-hebrew"
                data-testid="button-home"
                style={{
                  background: 'linear-gradient(135deg, rgba(69, 114, 182, 0.8) 0%, rgba(69, 114, 182, 0.6) 100%)',
                  boxShadow: '0 0 30px rgba(69, 114, 182, 0.5), 0 0 60px rgba(69, 114, 182, 0.3)',
                }}
              >
                <Home className="w-5 h-5 ml-2" />
                חזרה למסך הבית
              </Button>
            </div>

            {/* Additional Info */}
            <p className="text-xs text-gray-500 font-hebrew pt-4" data-testid="text-support-info">
              במידה ולא קיבלת הודעה ב-WhatsApp, אנא פנה אלינו
            </p>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
