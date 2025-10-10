import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SprayTanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SprayTanDialog({ open, onOpenChange }: SprayTanDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 bg-black border border-pink-500/50 rounded-lg p-8">
        
        {/* כפתור חזרה */}
        <Button 
          onClick={() => onOpenChange(false)} 
          variant="outline" 
          size="icon" 
          className="absolute top-4 right-4 border-pink-500/60 hover:border-pink-500"
          data-testid="button-back-spray-tan"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* כותרת */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            התזה
          </h1>
        </div>

        {/* תוכן זמני */}
        <div className="text-center text-gray-400">
          <p>עמוד ההתזה - מתחילים מחדש</p>
        </div>

      </div>
    </div>
  );
}
