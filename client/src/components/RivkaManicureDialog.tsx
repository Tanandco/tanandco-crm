import { useState } from 'react';
import { ArrowLeft, Sparkles, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import useEmblaCarousel from 'embla-carousel-react';

interface RivkaManicureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RivkaManicureDialog({ open, onOpenChange }: RivkaManicureDialogProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <style>{`
        @keyframes flow-gradient-border {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 200% 200%;
          }
        }
        
        .flowing-border {
          position: relative;
        }
        
        .flowing-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 0.5rem;
          padding: 2px;
          background: linear-gradient(
            135deg,
            rgba(236, 72, 153, 0.8),
            rgba(168, 85, 247, 0.6),
            rgba(139, 92, 246, 0.8),
            rgba(236, 72, 153, 0.6),
            rgba(168, 85, 247, 0.8)
          );
          background-size: 200% 200%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: flow-gradient-border 3s linear infinite;
          pointer-events: none;
        }
      `}</style>
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
          data-testid="button-back-rivka"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Content - New layout: Header -> Services/Gallery -> Book Button */}
      <div className="relative w-full h-[90vh] max-w-7xl flex flex-col gap-4 overflow-y-auto">
        
        {/* Header Section - Name & Bio */}
        <div className="w-full bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-pink-500/60 rounded-lg p-4 flowing-border">
          <div className="space-y-3">
            {/* Header with Instagram */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 1))' }} />
                <h2 className="text-xl md:text-3xl font-bold text-white font-varela">
                  רבקה סולטן
                </h2>
              </div>
              <a 
                href="https://instagram.com/rivka.nails" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors text-xs"
              >
                <Instagram className="w-4 h-4" />
                <span>@rivka.nails</span>
              </a>
            </div>

            {/* Bio */}
            <div className="bg-black/40 rounded-lg p-3 border border-pink-500/30">
              <p className="text-gray-300 text-xs md:text-sm text-center leading-relaxed">
                מעצבת ציפורניים מובילה • עיצובים מיוחדים • 10 שנות ניסיון • מניקור ופדיקור גל
              </p>
            </div>
          </div>
        </div>

        {/* Services & Gallery Section */}
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          
          {/* מחירון */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-pink-900/30 via-black/80 to-gray-800/90 border border-pink-500/60 rounded-lg p-4 flowing-border">
            <div className="space-y-2">
              <h3 className="text-base md:text-lg font-bold text-white text-center">מחירון</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2 bg-black/40 rounded-lg p-2 border border-pink-500/20">
                  <span className="text-white text-xs flex-1">לק ג'ל / מבנה אנטומי</span>
                  <span className="text-pink-400 font-bold text-sm">₪150</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 rounded-lg p-2 border border-pink-500/20">
                  <span className="text-white text-xs flex-1">בנייה (ג'ל / אקריל / פוליג'ל)</span>
                  <span className="text-pink-400 font-bold text-sm">₪350</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 rounded-lg p-2 border border-pink-500/20">
                  <span className="text-white text-xs flex-1">מילוי</span>
                  <span className="text-pink-400 font-bold text-sm">₪220</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 rounded-lg p-2 border border-pink-500/20">
                  <span className="text-white text-xs flex-1">פדיקור ג'ל</span>
                  <span className="text-pink-400 font-bold text-sm">₪150</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 rounded-lg p-2 border border-pink-500/20">
                  <span className="text-white text-xs flex-1">תוספת: פרנץ', אבקה, קישוט</span>
                  <span className="text-pink-400 font-bold text-sm">₪20</span>
                </div>
              </div>
            </div>
          </div>

          {/* גלריה */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-pink-900/30 via-black/80 to-gray-800/90 border border-pink-500/60 rounded-lg p-4 flowing-border">
            <div className="space-y-2 h-full flex flex-col">
              <h3 className="text-base md:text-lg font-bold text-white text-center">גלריה</h3>
              <div className="relative flex-1">
                <div className="overflow-hidden h-full" ref={emblaRef}>
                  <div className="flex gap-2 h-full">
                    <div className="flex-[0_0_33%] min-w-0">
                      <img 
                        src="/attached_assets/1_1760265240402.png" 
                        alt="עיצוב ציפורניים 1"
                        className="aspect-square object-cover rounded-lg border border-pink-500/30"
                      />
                    </div>
                    <div className="flex-[0_0_33%] min-w-0">
                      <img 
                        src="/attached_assets/4_1760265240402.png" 
                        alt="עיצוב ציפורניים 2"
                        className="aspect-square object-cover rounded-lg border border-pink-500/30"
                      />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => emblaApi?.scrollPrev()}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-pink-400 p-1 rounded-full hover:bg-black/70"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => emblaApi?.scrollNext()}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-pink-400 p-1 rounded-full hover:bg-black/70"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Book Button - Bottom */}
        <button
          onClick={() => console.log('Book with רבקה סולטן')}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-bold transition-colors text-base"
          data-testid="book-rivka"
        >
          קביעת תור עם רבקה
        </button>

      </div>
    </div>
  );
}
