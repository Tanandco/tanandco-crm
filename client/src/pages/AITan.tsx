import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Palette, Sparkles, Sun, Camera } from "lucide-react";
import { Link } from "wouter";

export default function AITan() {
  const [skinTone, setSkinTone] = useState("fair");
  const [desiredShade, setDesiredShade] = useState(6);
  const [selectedTanShade, setSelectedTanShade] = useState<{
    id: string;
    name: string;
    color: string;
    value: number;
  } | null>(null);

  // גוונות עור - צבעים ריאליסטיים מוארים
  const skinTones = [
    { id: "porcelain", name: "חרסינה", color: "#FFF0E5", description: "בהיר מאוד" },
    { id: "fair", name: "בהיר", color: "#FFE4CC", description: "בהיר" },
    { id: "ivory", name: "שנהב", color: "#F5D4B3", description: "בהיר חם" },
    { id: "cream", name: "בז'", color: "#E8C29A", description: "בז' בהיר" },
    { id: "lightbeige", name: "שקדים", color: "#D9A876", description: "בינוני בהיר" },
    { id: "beige", name: "קרמל", color: "#C89560", description: "בינוני" },
    { id: "almond", name: "ברונזה", color: "#B0824E", description: "בינוני כהה" },
    { id: "honey", name: "שוקולד", color: "#8B6F47", description: "כהה" },
  ];

  // גוונות שיזוף
  const tanShades = [
    { id: "light-tan", name: "שיזוף בהיר", color: "#E8C5A0", value: 6 },
    { id: "medium-beige", name: "בז׳ בינוני", color: "#DDB088", value: 7 },
    { id: "warm-sand", name: "חול חם", color: "#D29B70", value: 8 },
    { id: "golden-tan", name: "שיזוף זהוב", color: "#C78658", value: 9 },
    { id: "natural-bronze", name: "ברונזה טבעית", color: "#BC7140", value: 10 },
    { id: "warm-bronze", name: "ברונזה חמה", color: "#B15C28", value: 11 },
    { id: "deep-bronze", name: "ברונזה עמוקה", color: "#A64710", value: 12 },
    { id: "rich-bronze", name: "ברונזה עשירה", color: "#9B3200", value: 13 },
  ];

  // חיבור אוטומטי בין הסליידר לבחירת הצבע
  useEffect(() => {
    const matchingShade = tanShades.find((shade) => shade.value === desiredShade);
    if (matchingShade && matchingShade.id !== selectedTanShade?.id) {
      setSelectedTanShade(matchingShade);
    }
  }, [desiredShade]);

  // חישוב סשנים מומלצים
  const calculateRecommendedSessions = () => {
    const currentToneIndex = skinTones.findIndex((t) => t.id === skinTone) + 1;
    const difference = desiredShade - currentToneIndex;
    return Math.max(6, Math.min(12, 6 + difference));
  };

  const handleRippleMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--x', `${x}px`);
    e.currentTarget.style.setProperty('--y', `${y}px`);
  };

  return (
    <div
      dir="rtl"
      className="h-screen overflow-y-auto bg-black text-white antialiased selection:bg-white/10"
      style={{
        '--bg': '210 6% 8%',
        '--primary': '328 100% 70%',
        '--text': '210 15% 92%',
        '--border': '210 8% 18%',
        '--card': '210 6% 10%',
        '--cardText': '210 15% 90%',
        '--accent': '210 12% 14%',
        '--muted': '210 8% 12%',
      } as React.CSSProperties}
    >
      <style>{`
        /* Neon glow effect */
        .neon-glow {
          filter: drop-shadow(0 0 40px hsla(var(--primary)/0.40))
                  drop-shadow(0 0 80px rgba(147,51,234,0.40))
                  drop-shadow(0 0 20px rgba(255,105,180,0.50));
        }

        /* Glow pulse animation */
        @keyframes glowPulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
        .animate-glow-pulse {
          animation: glowPulse 1.8s ease-in-out infinite;
        }

        /* Ripple effect */
        .ripple {
          position: relative;
          overflow: hidden;
        }
        .ripple:hover {
          background-image: radial-gradient(
            circle at var(--x, 50%) var(--y, 50%),
            hsla(var(--primary)/0.18),
            transparent 40%
          );
        }

        /* Slide in animation */
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.5s ease-out forwards;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-glow-pulse,
          .animate-slide-in-up,
          .neon-glow {
            animation: none !important;
            filter: none !important;
          }
        }
      `}</style>

      <main className="relative z-10">
        {/* HEADER */}
        <section className="relative overflow-hidden py-4">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-[hsla(var(--primary)/0.05)]" />
          <div className="relative max-w-6xl mx-auto px-4">
            <Link href="/self-service">
              <Button
                variant="ghost"
                className="mb-4 gap-2 hover:bg-[hsl(var(--primary))]/10 transition-all duration-150"
                data-testid="button-back-to-service"
              >
                <ArrowRight className="w-5 h-5" />
                חזרה לשירות עצמי
              </Button>
            </Link>

            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-3 neon-glow">
                <Sparkles className="inline w-8 h-8 ml-2 mb-1 animate-glow-pulse" />
                AI TAN
              </h1>
              <p className="text-base md:text-lg text-white/90 animate-slide-in-up">
                התאמת שיזוף אישית עם בינה מלאכותית
              </p>
            </div>
          </div>
        </section>

        {/* בחירת גוון עור */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 justify-center text-[hsl(var(--primary))]">
            <Palette className="w-6 h-6" />
            בחר את גוון העור הנוכחי שלך
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {skinTones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => setSkinTone(tone.id)}
                onMouseMove={handleRippleMove}
                className={`
                  group ripple p-6 rounded-xl transition-all duration-300 ease-in-out overflow-visible
                  bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 
                  hover:from-transparent hover:via-transparent hover:to-transparent
                  ${skinTone === tone.id
                    ? "border-2 border-[hsl(var(--primary))] shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.4)]"
                    : "border border-[hsla(var(--primary)/0.6)] hover:border-transparent shadow-[0_8px_20px_rgba(0,0,0,.4)]"
                  }
                  hover:scale-105 active:scale-100 backdrop-blur-sm hover:backdrop-blur-none
                `}
                data-testid={`button-skintone-${tone.id}`}
              >
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-3 relative transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_60px_rgba(255,255,255,0.8),0_0_100px_rgba(236,72,153,0.6)]"
                  style={{ 
                    background: `
                      radial-gradient(circle at 30% 30%, 
                        rgba(255,255,255,0.4) 0%, 
                        transparent 50%
                      ),
                      linear-gradient(145deg, 
                        ${tone.color}ff 0%, 
                        ${tone.color}cc 40%,
                        ${tone.color}99 70%,
                        ${tone.color}66 100%
                      ),
                      repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 2px,
                        ${tone.color}22 2px,
                        ${tone.color}22 4px
                      )
                    `,
                    boxShadow: `
                      inset -4px -4px 12px rgba(0,0,0,0.5),
                      inset 4px 4px 12px rgba(255,255,255,0.3),
                      inset -1px -1px 3px rgba(0,0,0,0.8),
                      inset 1px 1px 3px rgba(255,255,255,0.5),
                      0 6px 16px rgba(0,0,0,0.6),
                      0 2px 4px rgba(255,255,255,0.3)
                    `
                  }}
                >
                  {/* Glass shine effect on hover */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `
                        linear-gradient(135deg,
                          rgba(255,255,255,0.9) 0%,
                          rgba(255,255,255,0.6) 20%,
                          transparent 40%,
                          rgba(236,72,153,0.3) 60%,
                          rgba(236,72,153,0.6) 100%
                        )
                      `,
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm text-[hsl(var(--cardText))]">{tone.name}</div>
                  <div className="text-xs text-white/60 mt-1">{tone.description}</div>
                </div>
                {skinTone === tone.id && (
                  <Sparkles className="absolute top-2 left-2 w-5 h-5 text-[hsl(var(--primary))] neon-glow" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* בחירת רמת שיזוף */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 justify-center text-[hsl(var(--primary))]">
            <Sun className="w-6 h-6" />
            בחר את רמת השיזוף הרצויה
          </h2>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* גרדיאנט אינטראקטיבי של רמות שיזוף */}
            <div className="space-y-6">
              <div className="flex justify-between text-sm text-white/60 px-2">
                <span>בהיר</span>
                <span>עמוק</span>
              </div>
              
              <div className="relative px-2">
                {/* נקודות מעל הפס */}
                <div className="flex items-center justify-around mb-3">
                  {tanShades.map((shade) => {
                    const currentToneIndex = skinTones.findIndex((t) => t.id === skinTone) + 1;
                    const minValue = Math.max(6, currentToneIndex);
                    const isDisabled = shade.value < minValue;
                    const isSelected = selectedTanShade?.id === shade.id;
                    
                    return (
                      <button
                        key={shade.id}
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedTanShade(shade);
                            setDesiredShade(shade.value);
                          }
                        }}
                        disabled={isDisabled}
                        className={`
                          group relative transition-all duration-150
                          ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-125'}
                          ${isSelected ? 'scale-150' : 'scale-100'}
                        `}
                        data-testid={`button-gradient-shade-${shade.id}`}
                      >
                        <div
                          className={`
                            w-10 h-10 rounded-full border-2 transition-all duration-150
                            ${isSelected 
                              ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.8),0_0_40px_rgba(236,72,153,0.6)]' 
                              : 'border-white/40 hover:border-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                            }
                          `}
                          style={{ backgroundColor: shade.color }}
                        />
                        {isSelected && (
                          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-white neon-glow" />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* פס גרדיאנט עדין */}
                <div 
                  className="h-1.5 rounded-full"
                  style={{
                    background: `linear-gradient(to left, ${tanShades.map(s => s.color).join(', ')})`,
                    opacity: 0.6
                  }}
                />
              </div>
              
              <div className="text-center text-xs text-white/50 px-2">
                גע על הנקודה להתאמת רמת השיזוף
              </div>
            </div>

            {/* תצוגת הצבע הנבחר */}
            {selectedTanShade && (
              <div className="group text-center py-8">
                {/* מעטפת לריחוף */}
                <div className="mb-4" style={{ animation: 'levitate 3s ease-in-out infinite' }}>
                  <div
                    className="w-40 h-40 rounded-full mx-auto relative transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_60px_rgba(255,255,255,0.8),0_0_100px_rgba(236,72,153,0.6)] [animation:slow-spin_20s_linear_infinite] group-hover:[animation-play-state:paused]"
                    style={{ 
                      background: `
                        radial-gradient(circle at 30% 30%, 
                          rgba(255,255,255,0.4) 0%, 
                          transparent 50%
                        ),
                        linear-gradient(145deg, 
                          ${selectedTanShade.color}ff 0%, 
                          ${selectedTanShade.color}cc 40%,
                          ${selectedTanShade.color}99 70%,
                          ${selectedTanShade.color}66 100%
                        ),
                        repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 2px,
                          ${selectedTanShade.color}22 2px,
                          ${selectedTanShade.color}22 4px
                        )
                      `,
                      boxShadow: `
                        inset -4px -4px 12px rgba(0,0,0,0.5),
                        inset 4px 4px 12px rgba(255,255,255,0.3),
                        inset -1px -1px 3px rgba(0,0,0,0.8),
                        inset 1px 1px 3px rgba(255,255,255,0.5),
                        0 6px 16px rgba(0,0,0,0.6),
                        0 2px 4px rgba(255,255,255,0.3)
                      `
                    }}
                  >
                    {/* Glass shine effect on hover */}
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `
                          linear-gradient(135deg,
                            rgba(255,255,255,0.9) 0%,
                            rgba(255,255,255,0.6) 20%,
                            transparent 40%,
                            rgba(236,72,153,0.3) 60%,
                            rgba(236,72,153,0.6) 100%
                          )
                        `,
                        backdropFilter: 'blur(8px)'
                      }}
                    />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[hsl(var(--cardText))] mb-1">{selectedTanShade.name}</div>
                <div className="text-sm text-white/60">רמת השיזוף שנבחרה</div>
              </div>
            )}
          </div>
        </section>

        {/* גוונות שיזוף */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 justify-center text-[hsl(var(--primary))]">
            <Palette className="w-6 h-6" />
            בחירת גוון שיזוף ישיר
          </h2>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-8">
            {tanShades.map((shade) => (
              <button
                key={shade.id}
                onClick={() => {
                  setSelectedTanShade(shade);
                  setDesiredShade(shade.value);
                }}
                onMouseMove={handleRippleMove}
                className={`
                  group ripple p-4 rounded-xl transition-all duration-300 ease-in-out overflow-visible
                  bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
                  hover:from-transparent hover:via-transparent hover:to-transparent
                  ${selectedTanShade?.id === shade.id
                    ? "border-2 border-[hsl(var(--primary))] shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.4)] scale-110"
                    : "border border-[hsla(var(--primary)/0.6)] hover:border-transparent shadow-[0_8px_20px_rgba(0,0,0,.4)]"
                  }
                  hover:scale-105 active:scale-100 backdrop-blur-sm hover:backdrop-blur-none
                `}
                data-testid={`button-tanshade-${shade.id}`}
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-2 relative transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_60px_rgba(255,255,255,0.8),0_0_100px_rgba(236,72,153,0.6)]"
                  style={{ 
                    background: `
                      radial-gradient(circle at 30% 30%, 
                        rgba(255,255,255,0.4) 0%, 
                        transparent 50%
                      ),
                      linear-gradient(145deg, 
                        ${shade.color}ff 0%, 
                        ${shade.color}cc 40%,
                        ${shade.color}99 70%,
                        ${shade.color}66 100%
                      ),
                      repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 2px,
                        ${shade.color}22 2px,
                        ${shade.color}22 4px
                      )
                    `,
                    boxShadow: `
                      inset -4px -4px 12px rgba(0,0,0,0.5),
                      inset 4px 4px 12px rgba(255,255,255,0.3),
                      inset -1px -1px 3px rgba(0,0,0,0.8),
                      inset 1px 1px 3px rgba(255,255,255,0.5),
                      0 6px 16px rgba(0,0,0,0.6),
                      0 2px 4px rgba(255,255,255,0.3)
                    `
                  }}
                >
                  {/* Glass shine effect on hover */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `
                        linear-gradient(135deg,
                          rgba(255,255,255,0.9) 0%,
                          rgba(255,255,255,0.6) 20%,
                          transparent 40%,
                          rgba(236,72,153,0.3) 60%,
                          rgba(236,72,153,0.6) 100%
                        )
                      `,
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                </div>
                <div className="text-xs text-center text-[hsl(var(--cardText))] font-semibold">
                  {shade.name}
                </div>
                {selectedTanShade?.id === shade.id && (
                  <Sparkles className="absolute top-1 left-1 w-4 h-4 text-[hsl(var(--primary))] neon-glow" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* המלצות */}
        <section className="max-w-6xl mx-auto px-4 py-6 pb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 justify-center text-[hsl(var(--primary))]">
            <Sparkles className="w-6 h-6" />
            ההמלצה שלנו
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* מספר סשנים */}
            <div className="text-center p-6 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] rounded-xl backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,.4)]">
              <div className="text-5xl font-bold text-[hsl(var(--primary))] mb-2 neon-glow">
                {calculateRecommendedSessions()}
              </div>
              <div className="text-lg font-semibold text-[hsl(var(--cardText))]">סשנים מומלצים</div>
              <div className="text-sm text-white/60 mt-2">להשגת הגוון המושלם</div>
            </div>

            {/* זמן משוער */}
            <div className="text-center p-6 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] rounded-xl backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,.4)]">
              <div className="text-5xl font-bold text-[hsl(var(--primary))] mb-2 neon-glow">
                8-12
              </div>
              <div className="text-lg font-semibold text-[hsl(var(--cardText))]">דקות לסשן</div>
              <div className="text-sm text-white/60 mt-2">זמן חשיפה מומלץ</div>
            </div>
          </div>

          {/* כפתור המשך */}
          <div className="text-center">
            <Button
              size="lg"
              className="ripple bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-black font-bold px-12 gap-2 shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.5)] transition-all duration-150 ease-in-out hover:scale-105 active:scale-100"
              onMouseMove={handleRippleMove}
              data-testid="button-continue-booking"
            >
              <Camera className="w-5 h-5" />
              המשך להזמנה
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
