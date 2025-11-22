import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, DoorOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function EmergencyDoorButton() {
  const { toast } = useToast();
  const [isOpening, setIsOpening] = useState(false);

  const handleEmergencyOpen = async () => {
    setIsOpening(true);
    try {
      const response = await fetch('/api/emergency/door/open', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.ok) {
        toast({
          title: '✅ הדלת נפתחה בהצלחה',
          description: 'פתיחת חירום בוצעה',
          variant: 'default',
        });
      } else {
        throw new Error(data.error || 'שגיאה בפתיחת הדלת');
      }
    } catch (error: any) {
      console.error('Emergency door open failed:', error);
      toast({
        title: '❌ שגיאה בפתיחת הדלת',
        description: error.message || 'לא ניתן לפתוח את הדלת. נסה שוב.',
        variant: 'destructive',
      });
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <Button
      onClick={handleEmergencyOpen}
      disabled={isOpening}
      size="lg"
      className="
        fixed bottom-6 left-6 z-50
        bg-gradient-to-r from-red-600 to-red-700 
        hover:from-red-700 hover:to-red-800
        text-white font-bold text-lg
        shadow-[0_0_30px_rgba(239,68,68,0.6)]
        hover:shadow-[0_0_40px_rgba(239,68,68,0.8)]
        border-2 border-red-500
        h-20 w-20 rounded-full
        flex items-center justify-center
        animate-pulse
      "
      style={{
        boxShadow: '0 0 40px rgba(239, 68, 68, 0.6), 0 0 80px rgba(239, 68, 68, 0.3)',
      }}
      title="פתיחת חירום - ללא תלות במערכות"
    >
      {isOpening ? (
        <Loader2 className="w-8 h-8 animate-spin" />
      ) : (
        <DoorOpen className="w-10 h-10" />
      )}
    </Button>
  );
}

