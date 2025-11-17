import { User, Phone, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomerStatus {
  name?: string;
  balance?: number;
  lastVisit?: string;
}

interface StatusDisplayProps {
  customer?: CustomerStatus;
  onIdentify?: () => void;
  onScanQR?: () => void;
  onPhoneLogin?: () => void;
}

export default function StatusDisplay({ customer, onIdentify, onScanQR, onPhoneLogin }: StatusDisplayProps) {
  if (customer) {
    return (
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-4 mb-6" data-testid="customer-status">
        <div className="flex items-center gap-3">
          <User className="text-primary" size={32} style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary)/0.8))' }} />
          <div className="text-right">
            <h3 className="text-lg font-bold text-white font-hebrew">שלום {customer.name}</h3>
            {customer.balance && (
              <p className="text-sm text-gray-300 font-hebrew">
                יתרה: {customer.balance} כניסות
              </p>
            )}
            {customer.lastVisit && (
              <p className="text-xs text-gray-400 font-hebrew">
                ביקור אחרון: {customer.lastVisit}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-lg p-6 mb-6" data-testid="identification-prompt">
      <h2 className="text-xl font-bold text-center text-white mb-4 font-hebrew">
        זיהוי לקוח
      </h2>
      <div className="flex flex-col gap-3">
        <Button 
          className="flex items-center gap-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-hebrew"
          onClick={() => {
            onScanQR?.();
          }}
          data-testid="button-scan-qr"
        >
          <QrCode size={20} />
          סרוק QR Code
        </Button>
        <Button 
          variant="outline"
          className="flex items-center gap-3 h-12 border-primary/50 text-white hover:bg-primary/10 font-hebrew"
          onClick={() => {
            onPhoneLogin?.();
          }}
          data-testid="button-phone-login"
        >
          <Phone size={20} />
          הזדהה לפי טלפון
        </Button>
      </div>
    </div>
  );
}
