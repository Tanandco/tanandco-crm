import { useState } from 'react';
import { ArrowLeft, Sparkles, Calendar, User, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import useEmblaCarousel from 'embla-carousel-react';

interface ManicureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ManicureDialog({ open, onOpenChange }: ManicureDialogProps) {
  const [emblaRef1, emblaApi1] = useEmblaCarousel({ loop: true });
  const [emblaRef2, emblaApi2] = useEmblaCarousel({ loop: true });

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
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2 border-pink-500/60 rounded-lg p-4 flex flex-col">
          <div className="space-y-3 flex-1 flex flex-col">
            {/* Header with Instagram */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 1))' }} />
                <h2 className="text-xl md:text-3xl font-bold text-white font-varela">
                  שי לניאדו
                </h2>
              </div>
              <a 
                href="https://instagram.com/shay.nails" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors text-xs"
              >
                <Instagram className="w-4 h-4" />
                <span>@shay.nails</span>
              </a>
            </div>

            {/* Bio */}
            <div className="bg-black/40 rounded-lg p-2 border border-pink-500/30">
              <p className="text-gray-300 text-xs md:text-sm text-center leading-relaxed">
                מומחית למניקור ג'ל מושלם • 8 שנות ניסיון • עיצובים ייחודיים
              </p>
            </div>

            {/* מחירון */}
            <div className="space-y-2">
              <h3 className="text-base md:text-lg font-bold text-white text-center">מחירון</h3>
              <div className="space-y-1">
                <div className="flex justify-between items-center bg-black/40 rounded-lg p-2 border border-pink-500/20">
                  <span className="text-white text-xs">מניקור ג'ל קלאסי</span>
                  <span className="text-pink-400 font-bold text-sm">₪120</span>
                </div>
                <div className="flex justify-between items-center bg-black/40 rounded-lg p-2 border border-pink-500/20">
                  <span className="text-white text-xs">מניקור + עיצוב</span>
                  <span className="text-pink-400 font-bold text-sm">₪150</span>
                </div>
                <div className="flex justify-between items-center bg-black/40 rounded-lg p-2 border border-pink-500/20">
                  <span className="text-white text-xs">הסרה + מניקור חדש</span>
                  <span className="text-pink-400 font-bold text-sm">₪140</span>
                </div>
              </div>
            </div>

            {/* גלריית תמונות - Carousel */}
            <div className="space-y-2 flex-1">
              <h3 className="text-base md:text-lg font-bold text-white text-center">גלריה</h3>
              <div className="relative">
                <div className="overflow-hidden" ref={emblaRef1}>
                  <div className="flex gap-2">
                    <div className="flex-[0_0_33%] min-w-0">
                      <img 
                        src="/attached_assets/4_1760265219421.png" 
                        alt="עיצוב ציפורניים 1"
                        className="aspect-square object-cover rounded-lg border border-pink-500/30"
                      />
                    </div>
                    <div className="flex-[0_0_33%] min-w-0">
                      <img 
                        src="/attached_assets/3_1760265240401.png" 
                        alt="עיצוב ציפורניים 2"
                        className="aspect-square object-cover rounded-lg border border-pink-500/30"
                      />
                    </div>
                    <div className="flex-[0_0_33%] min-w-0">
                      <img 
                        src="/attached_assets/2_1760265240402.png" 
                        alt="עיצוב ציפורניים 3"
                        className="aspect-square object-cover rounded-lg border border-pink-500/30"
                      />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => emblaApi1?.scrollPrev()}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-pink-400 p-1 rounded-full hover:bg-black/70"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => emblaApi1?.scrollNext()}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-pink-400 p-1 rounded-full hover:bg-black/70"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* כפתור הזמנה */}
            <button
              onClick={() => console.log('Book with שי לניאדו')}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-bold transition-colors text-sm"
              data-testid="book-shay"
            >
              קביעת תור עם שי
            </button>
          </div>
        </div>

        {/* Left Section - רבקה סולטן */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-gradient-to-br from-pink-900/30 via-black/80 to-gray-800/90 border-2 border-pink-500/60 rounded-lg p-4 flex flex-col">
          <div className="space-y-3 flex-1 flex flex-col">
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
            <div className="bg-black/40 rounded-lg p-2 border border-pink-500/30">
              <p className="text-gray-300 text-xs md:text-sm text-center leading-relaxed">
                מעצבת ציפורניים מובילה • עיצובים מיוחדים • 10 שנות ניסיון
              </p>
            </div>

            {/* מחירון */}
            <div className="space-y-2">
              <h3 className="text-base md:text-lg font-bold text-white text-center">מחירון</h3>
              <div className="space-y-1">
                <div className="flex justify-between items-center bg-black/40 rounded-lg p-2 border border-pink-500/20">
                  <span className="text-white text-xs">מניקור ג'ל קלאסי</span>
                  <span className="text-pink-400 font-bold text-sm">₪130</span>
                </div>
                <div className="flex justify-between items-center bg-black/40 rounded-lg p-2 border border-pink-500/20">
                  <span className="text-white text-xs">מניקור + עיצוב מיוחד</span>
                  <span className="text-pink-400 font-bold text-sm">₪160</span>
                </div>
                <div className="flex justify-between items-center bg-black/40 rounded-lg p-2 border border-pink-500/20">
                  <span className="text-white text-xs">טיפול SPA מלא</span>
                  <span className="text-pink-400 font-bold text-sm">₪180</span>
                </div>
              </div>
            </div>

            {/* גלריית תמונות - Carousel */}
            <div className="space-y-2 flex-1">
              <h3 className="text-base md:text-lg font-bold text-white text-center">גלריה</h3>
              <div className="relative">
                <div className="overflow-hidden" ref={emblaRef2}>
                  <div className="flex gap-2">
                    <div className="flex-[0_0_33%] min-w-0">
                      <img 
                        src="/attached_assets/1_1760265240402.png" 
                        alt="עיצוב ציפורניים 4"
                        className="aspect-square object-cover rounded-lg border border-pink-500/30"
                      />
                    </div>
                    <div className="flex-[0_0_33%] min-w-0">
                      <img 
                        src="/attached_assets/4_1760265240402.png" 
                        alt="עיצוב ציפורניים 5"
                        className="aspect-square object-cover rounded-lg border border-pink-500/30"
                      />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => emblaApi2?.scrollPrev()}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-pink-400 p-1 rounded-full hover:bg-black/70"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => emblaApi2?.scrollNext()}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-pink-400 p-1 rounded-full hover:bg-black/70"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* כפתור הזמנה */}
            <button
              onClick={() => console.log('Book with רבקה סולטן')}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-bold transition-colors text-sm"
              data-testid="book-rivka"
            >
              קביעת תור עם רבקה
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
