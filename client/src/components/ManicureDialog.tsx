import { useState } from 'react';
import { ArrowLeft, Sparkles, Calendar, User } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ManicureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ManicureDialog({ open, onOpenChange }: ManicureDialogProps) {
  if (!open) return null;

  const manicureServices = [
    {
      title: "מניקור ג'ל קלאסי",
      price: "₪120",
      duration: "45 דקות"
    },
    {
      title: "מניקור ג'ל + עיצוב",
      price: "₪150",
      duration: "60 דקות"
    },
    {
      title: "מניקור ספא מלא",
      price: "₪180",
      duration: "75 דקות"
    },
    {
      title: "הסרת ג'ל + מניקור חדש",
      price: "₪140",
      duration: "60 דקות"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Pink/Purple Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-pink-500/20 to-black opacity-90 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-pink-500/10" />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 right-6 z-30">
        <Button
          onClick={() => onOpenChange(false)}
          variant="outline"
          size="icon"
          className="bg-white/10 border-white/20 text-white backdrop-blur-sm h-10 w-10"
          data-testid="button-back-manicure"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Content - Split into two sections */}
      <div className="relative w-full h-[90vh] max-w-7xl flex flex-col md:flex-row gap-4">
        
        {/* Right Section - שי לניאדו */}
        <button
          onClick={() => console.log('Selected: שי לניאדו')}
          className="w-full md:w-1/2 h-1/2 md:h-full bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2 border-pink-500/60 rounded-lg p-8 flex flex-col items-center justify-center transition-all duration-150 hover-elevate active-elevate-2"
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.6)'}
          data-testid="manicurist-shay"
        >
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-12 h-12 text-pink-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 1))' }} />
              <h2 className="text-3xl md:text-5xl font-bold text-white font-varela">
                שי לניאדו
              </h2>
            </div>
            <p className="text-xl md:text-2xl text-pink-400 font-semibold">
              מניקוריסטית מקצועית
            </p>
          </div>
        </button>

        {/* Left Section - רבקה סולטן */}
        <button
          onClick={() => console.log('Selected: רבקה סולטן')}
          className="w-full md:w-1/2 h-1/2 md:h-full bg-gradient-to-br from-pink-900/30 via-black/80 to-gray-800/90 border-2 border-pink-500/60 rounded-lg p-8 flex flex-col items-center justify-center transition-all duration-150 hover-elevate active-elevate-2"
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.6)'}
          data-testid="manicurist-rivka"
        >
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-12 h-12 text-pink-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 1))' }} />
              <h2 className="text-3xl md:text-5xl font-bold text-white font-varela">
                רבקה סולטן
              </h2>
            </div>
            <p className="text-xl md:text-2xl text-pink-400 font-semibold">
              מניקוריסטית מקצועית
            </p>
          </div>
        </button>

      </div>
    </div>
  );
}
