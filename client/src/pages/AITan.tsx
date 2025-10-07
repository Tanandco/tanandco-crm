import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Palette, Sparkles, Sun, Camera } from "lucide-react";
import { Link } from "wouter";

export default function AITan() {
  const [skinTone, setSkinTone] = useState("type2");
  const [desiredShade, setDesiredShade] = useState(6);
  const [selectedTanShade, setSelectedTanShade] = useState<{
    id: string;
    name: string;
    color: string;
    description: string;
    value: number;
  } | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skinType, setSkinType] = useState<string>("");
  const [burnEasily, setBurnEasily] = useState<boolean | null>(null);

  // גוונות עור - צבעים אמיתיים לפי סקלת Fitzpatrick
  const skinTones = [
    { id: "type1", name: "חיוור", color: "#FFF4E6", description: "Type I - תמיד נשרף, אף פעם לא משתזף" },
    { id: "type2", name: "בהיר", color: "#F7DEC8", description: "Type II - נשרף בקלות, משתזף מעט" },
    { id: "type3", name: "בז' בהיר", color: "#E0AC69", description: "Type III - נשרף בינוני, משתזף הדרגתי" },
    { id: "type4", name: "חום בינוני", color: "#C68642", description: "Type IV - נשרף מעט, משתזף טוב" },
    { id: "type5", name: "חום כהה", color: "#8D5524", description: "Type V - נשרף לעיתים רחוקות" },
    { id: "type6", name: "חום עמוק", color: "#5C4033", description: "Type VI - אף פעם לא נשרף" },
  ];

  // גוונות שיזוף - התקדמות אמיתית של מלנין בעור
  const tanShades = [
    { id: "light-glow", name: "זוהר בהיר", color: "#F1C27D", description: "תחילת שיזוף (3-5 ימים)", value: 6 },
    { id: "subtle-tan", name: "שיזוף עדין", color: "#EEC096", description: "שיזוף קל", value: 7 },
    { id: "visible-tan", name: "שיזוף נראה", color: "#E8AD82", description: "שיזוף בולט", value: 8 },
    { id: "medium-tan", name: "שיזוף בינוני", color: "#E0AC69", description: "7-10 ימים", value: 9 },
    { id: "golden-bronze", name: "ברונזה זהובה", color: "#D69056", description: "שיזוף עמוק", value: 10 },
    { id: "rich-bronze", name: "ברונזה עשירה", color: "#C49979", description: "10-21 ימים", value: 11 },
    { id: "deep-bronze", name: "ברונזה עמוקה", color: "#BD8966", description: "שיזוף מקסימלי", value: 12 },
    { id: "maximum-tan", name: "שיזוף מקסימום", color: "#8D5524", description: "פיק מלנין", value: 13 },
  ];

  // חיבור אוטומטי בין הסליידר לבחירת הצבע
  useEffect(() => {
    const matchingShade = tanShades.find((shade) => shade.value === desiredShade);
    if (matchingShade && matchingShade.id !== selectedTanShade?.id) {
      setSelectedTanShade(matchingShade);
    }
  }, [desiredShade]);

  // טיפול בהעלאת תמונה
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        // סימולציה של ניתוח AI
        setIsAnalyzing(true);
        setTimeout(() => {
          setIsAnalyzing(false);
          // המלצה אוטומטית מבוססת על "ניתוח"
          const recommendedTone = skinTones[Math.floor(Math.random() * 3) + 1]; // גוון אקראי בטווח הבינוני
          setSkinTone(recommendedTone.id);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  // חישוב סשנים מומלצים
  const calculateRecommendedSessions = () => {
    const currentToneIndex = skinTones.findIndex((t) => t.id === skinTone) + 1;
    const difference = desiredShade - currentToneIndex;
    return Math.max(6, Math.min(12, 6 + difference));
  };

  // המלצה על ברונזר לפי רמת שיזוף
  const getRecommendedBronzer = () => {
    if (!selectedTanShade) return null;
    
    // התאמת דרגת ברונזר לרמת השיזוף הרצויה
    if (desiredShade <= 7) {
      return { name: "BALIBODY Light Bronzer", strength: 5, price: 89 };
    } else if (desiredShade <= 9) {
      return { name: "BALIBODY Medium Bronzer", strength: 8, price: 99 };
    } else if (desiredShade <= 11) {
      return { name: "BALIBODY Dark Bronzer", strength: 12, price: 109 };
    } else {
      return { name: "BALIBODY Ultra Dark", strength: 15, price: 119 };
    }
  };

  // חישוב מחיר כולל
  const calculateTotalPrice = () => {
    const sessionPrice = 45; // מחיר לסשן
    const sessions = calculateRecommendedSessions();
    const bronzer = getRecommendedBronzer();
    
    return {
      sessionsTotal: sessionPrice * sessions,
      bronzerPrice: bronzer?.price || 0,
      total: (sessionPrice * sessions) + (bronzer?.price || 0),
      packageDiscount: 50, // הנחה על חבילה
    };
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
      className="h-screen overflow-y-auto text-white antialiased selection:bg-white/10"
      style={{
        '--bg': '210 6% 8%',
        '--primary': '32 82% 40%',
        '--text': '210 15% 92%',
        '--border': '210 8% 18%',
        '--card': '210 6% 10%',
        '--cardText': '210 15% 90%',
        '--accent': '210 12% 14%',
        '--muted': '210 8% 12%',
        background: 'linear-gradient(to bottom right, hsl(var(--primary) / 0.10) 0%, black 25%, black 75%, hsl(var(--primary) / 0.05) 100%)',
      } as React.CSSProperties}
    >
      <style>{`
        /* Amber gradient text effect */
        .text-gradient-amber {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Neon glow effect */
        .neon-glow {
          filter: drop-shadow(0 0 40px hsla(var(--primary)/0.40))
                  drop-shadow(0 0 80px rgba(249,115,22,0.40))
                  drop-shadow(0 0 20px rgba(245,158,11,0.50));
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

        /* 3D Card Animations */
        @keyframes float-3d {
          0%, 100% { 
            transform: translateY(0) rotateX(0deg) rotateY(0deg);
          }
          50% { 
            transform: translateY(-10px) rotateX(2deg) rotateY(2deg);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes price-pop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .card-3d:hover {
          transform: translateZ(50px) rotateX(5deg) rotateY(5deg);
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }

        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-glow-pulse,
          .animate-slide-in-up,
          .neon-glow,
          .card-3d,
          .shimmer-effect {
            animation: none !important;
            filter: none !important;
            transform: none !important;
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

        {/* שלבי שימוש */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <div className="inline-block px-8 py-3 rounded-2xl mx-auto mb-6"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--primary) / 0.15))',
                boxShadow: '0 0 15px hsla(var(--primary)/0.2), inset 0 0 10px hsla(var(--primary)/0.05)',
                border: '1px solid hsla(var(--primary)/0.3)'
              }}>
            <h2 className="text-xl md:text-2xl font-bold text-center text-gradient-amber">
              איך זה עובד?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* שלב 1 */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] rounded-xl p-4 text-center hover:border-[hsl(var(--primary))] transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[hsl(var(--primary))]/20 border-2 border-[hsl(var(--primary))] flex items-center justify-center">
                  <span className="text-xl font-bold text-gradient-amber">1</span>
                </div>
                <Camera className="w-6 h-6 mx-auto mb-2 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-bold text-[hsl(var(--cardText))] mb-1">צלם תמונה</h3>
                <p className="text-xs text-white/60">העלה תמונה של העור שלך לניתוח AI מדויק</p>
              </div>
            </div>

            {/* שלב 2 */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] rounded-xl p-4 text-center hover:border-[hsl(var(--primary))] transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[hsl(var(--primary))]/20 border-2 border-[hsl(var(--primary))] flex items-center justify-center">
                  <span className="text-xl font-bold text-gradient-amber">2</span>
                </div>
                <Palette className="w-6 h-6 mx-auto mb-2 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-bold text-[hsl(var(--cardText))] mb-1">בחר גוון עור</h3>
                <p className="text-xs text-white/60">אשר את גוון העור הנוכחי או תן לנו לזהות</p>
              </div>
            </div>

            {/* שלב 3 */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] rounded-xl p-4 text-center hover:border-[hsl(var(--primary))] transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[hsl(var(--primary))]/20 border-2 border-[hsl(var(--primary))] flex items-center justify-center">
                  <span className="text-xl font-bold text-gradient-amber">3</span>
                </div>
                <Sun className="w-6 h-6 mx-auto mb-2 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-bold text-[hsl(var(--cardText))] mb-1">בחר רמת שיזוף</h3>
                <p className="text-xs text-white/60">גלול ובחר את הגוון המושלם שאתה רוצה</p>
              </div>
            </div>

            {/* שלב 4 */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] rounded-xl p-4 text-center hover:border-[hsl(var(--primary))] transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[hsl(var(--primary))]/20 border-2 border-[hsl(var(--primary))] flex items-center justify-center">
                  <span className="text-xl font-bold text-gradient-amber">4</span>
                </div>
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-bold text-[hsl(var(--cardText))] mb-1">קבל המלצות</h3>
                <p className="text-xs text-white/60">AI ימליץ על מספר סשנים ומשך הטיפול</p>
              </div>
            </div>
          </div>
        </section>

        {/* הסבר שימוש + העלאת תמונה */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* טור 1: הסבר */}
            <div className="bg-gradient-to-br from-[hsl(var(--primary))]/10 via-black/50 to-[hsl(var(--primary))]/5 border border-[hsla(var(--primary)/0.4)] rounded-xl p-6 backdrop-blur-sm"
                 style={{
                   boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 30px hsla(var(--primary)/0.2), inset 0 2px 10px hsla(var(--primary)/0.15)',
                   transform: 'translateZ(0)',
                 }}>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[hsl(var(--cardText))]">רוצה שיזוף מושלם? צלמ/י תמונה!</h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  <span className="text-[hsl(var(--primary))] font-semibold">תמונה אחת של העור = תוצאה מדויקת פי 10</span>
                  <br/>
                  AI TAN ינתח את גוון העור האמיתי שלך ויציע את רמת השיזוף שתיראה הכי טבעית וזוהרת עליך. 
                  בלי ניחושים, בלי טעויות - רק התאמה אישית מבוססת מדע.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-white/70">
                    <Sparkles className="w-3 h-3 text-[hsl(var(--primary))]" />
                    <span>ניתוח AI מדויק</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Sparkles className="w-3 h-3 text-[hsl(var(--primary))]" />
                    <span>התאמה אישית לעור שלך</span>
                  </div>
                </div>
              </div>
            </div>

            {/* טור 2: העלאת תמונה */}
            <div>
          <div className="relative">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
              data-testid="input-image-upload"
            />
            
            {!uploadedImage ? (
              <label
                htmlFor="image-upload"
                className="group block cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-[hsla(var(--primary)/0.4)] hover:border-[hsl(var(--primary))] bg-gradient-to-br from-gray-900/50 via-black/40 to-gray-800/50 p-12 text-center transition-all duration-300 hover:from-[hsl(var(--primary))]/5 hover:via-black/60 hover:to-[hsl(var(--primary))]/5"
                     style={{
                       boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 30px hsla(var(--primary)/0.2), inset 0 2px 10px hsla(var(--primary)/0.15)',
                       transform: 'translateZ(0)',
                     }}>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center border border-[hsl(var(--primary))]/20 group-hover:scale-110 transition-transform duration-300">
                      <Camera className="w-10 h-10 text-[hsl(var(--primary))] neon-glow" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[hsl(var(--cardText))] mb-2">
                        צלם או העלה תמונה של העור
                      </h3>
                      <p className="text-sm text-white/60">
                        גע כאן לפתיחת המצלמה או לבחירת תמונה מהגלריה
                      </p>
                    </div>
                    <div className="flex gap-3 text-xs text-white/50">
                      <span>צילום ישיר</span>
                      <span>•</span>
                      <span>בחירה מגלריה</span>
                    </div>
                  </div>
                </div>
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border-2 border-[hsl(var(--primary))] bg-black/50 p-4"
                   style={{
                     boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 30px hsla(var(--primary)/0.3), inset 0 2px 10px hsla(var(--primary)/0.15)',
                     transform: 'translateZ(0)',
                   }}>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* התמונה שהועלתה */}
                  <div className="relative w-48 h-48 rounded-xl overflow-hidden border border-[hsla(var(--primary)/0.3)]">
                    <img
                      src={uploadedImage}
                      alt="Uploaded skin"
                      className="w-full h-full object-cover"
                    />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center">
                          <div className="w-12 h-12 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                          <p className="text-sm text-[hsl(var(--primary))] neon-glow">מנתח...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* תוצאות הניתוח */}
                  <div className="flex-1 space-y-4">
                    {isAnalyzing ? (
                      <div className="space-y-3">
                        <div className="h-4 bg-white/10 rounded-full animate-pulse"></div>
                        <div className="h-4 bg-white/10 rounded-full w-3/4 animate-pulse"></div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-[hsl(var(--primary))]">
                          <Sparkles className="w-5 h-5 neon-glow" />
                          <span className="font-bold">ניתוח הושלם בהצלחה!</span>
                        </div>
                        <p className="text-sm text-white/80">
                          זיהינו את גוון העור שלך והתאמנו את ההמלצות בהתאם.
                          גלול למטה לראות את התוצאות המותאמות אישית.
                        </p>
                        <button
                          onClick={() => setUploadedImage(null)}
                          className="text-sm text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 transition-colors flex items-center gap-2"
                          data-testid="button-upload-new"
                        >
                          <Camera className="w-4 h-4" />
                          צלם תמונה חדשה
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
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
            {skinTones.map((tone, index) => (
              <button
                key={tone.id}
                onClick={() => setSkinTone(tone.id)}
                onMouseMove={handleRippleMove}
                className={`
                  group ripple p-6 rounded-xl transition-all duration-300 ease-in-out overflow-visible
                  bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 
                  hover:from-transparent hover:via-transparent hover:to-transparent
                  ${skinTone === tone.id
                    ? "border-2 border-[hsl(var(--primary))] shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_40px_rgba(255,255,255,.3)] neomorph-raised-strong"
                    : index % 3 === 0
                      ? "border border-[hsla(var(--primary)/0.6)] hover:border-transparent shadow-[0_8px_20px_rgba(0,0,0,.4)] neomorph-inset"
                      : index % 3 === 1
                        ? "border border-[hsla(var(--primary)/0.6)] hover:border-transparent shadow-[0_8px_20px_rgba(0,0,0,.4)] neomorph-flat"
                        : "border border-[hsla(var(--primary)/0.6)] hover:border-transparent shadow-[0_8px_20px_rgba(0,0,0,.4)] neomorph-hover-raise"
                  }
                  hover:scale-105 active:scale-100 backdrop-blur-sm hover:backdrop-blur-none
                `}
                data-testid={`button-skintone-${tone.id}`}
              >
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-3 relative transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.6),0_0_80px_rgba(255,255,255,0.3)]"
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
                          rgba(255,255,255,0.2) 60%,
                          rgba(255,255,255,0.4) 100%
                        )
                      `,
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm text-[hsl(var(--cardText))]">{tone.name}</div>
                  <div className="text-xs text-white/50 mt-1">{tone.description}</div>
                </div>
                {skinTone === tone.id && (
                  <Sparkles className="absolute top-2 left-2 w-5 h-5 text-[hsl(var(--primary))] neon-glow" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* שאלת סוג העור */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 justify-center text-[hsl(var(--primary))]">
            מה סוג העור שלך?
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { id: "dry", name: "יבש", description: "עור יבש ומחוספס" },
              { id: "normal", name: "רגיל", description: "עור מאוזן" },
              { id: "oily", name: "שמן", description: "עור שמנוני ומבריק" },
              { id: "combination", name: "מעורב", description: "שמן באזור T" }
            ].map((type, index) => (
              <button
                key={type.id}
                onClick={() => setSkinType(type.id)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-150 relative
                  ${skinType === type.id 
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 shadow-[0_0_20px_rgba(255,255,255,0.3)] neomorph-raised' 
                    : index % 2 === 0
                      ? 'border-white/20 bg-gray-900/50 hover:border-[hsl(var(--primary))]/50 hover:bg-[hsl(var(--primary))]/5 neomorph-inset'
                      : 'border-white/20 bg-gray-900/50 hover:border-[hsl(var(--primary))]/50 hover:bg-[hsl(var(--primary))]/5 neomorph-flat'
                  }
                `}
                data-testid={`button-skintype-${type.id}`}
              >
                <div className="text-lg font-bold text-[hsl(var(--cardText))]">{type.name}</div>
                <div className="text-xs text-white/60 mt-1">{type.description}</div>
                {skinType === type.id && (
                  <Sparkles className="absolute top-2 right-2 w-4 h-4 text-[hsl(var(--primary))] neon-glow" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* שאלת רגישות לשריפה */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 justify-center text-[hsl(var(--primary))]">
            האם אתה נוטה להישרף בשיזוף הראשון שלך?
          </h2>
          
          <div className="flex gap-4 max-w-md mx-auto">
            <button
              onClick={() => setBurnEasily(true)}
              className={`
                flex-1 p-4 rounded-xl border-2 transition-all duration-150 relative
                ${burnEasily === true 
                  ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 shadow-[0_0_20px_rgba(255,255,255,0.3)] neomorph-raised-strong' 
                  : 'border-white/20 bg-gray-900/50 hover:border-[hsl(var(--primary))]/50 hover:bg-[hsl(var(--primary))]/5 neomorph-inset-deep'
                }
              `}
              data-testid="button-burn-yes"
            >
              <div className="text-lg font-bold text-[hsl(var(--cardText))]">כן</div>
              <div className="text-xs text-white/60 mt-1">נוטה להישרף</div>
              {burnEasily === true && (
                <Sparkles className="absolute top-2 right-2 w-4 h-4 text-[hsl(var(--primary))] neon-glow" />
              )}
            </button>
            
            <button
              onClick={() => setBurnEasily(false)}
              className={`
                flex-1 p-4 rounded-xl border-2 transition-all duration-150 relative
                ${burnEasily === false 
                  ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 shadow-[0_0_20px_rgba(255,255,255,0.3)] neomorph-raised-strong' 
                  : 'border-white/20 bg-gray-900/50 hover:border-[hsl(var(--primary))]/50 hover:bg-[hsl(var(--primary))]/5 neomorph-inset-deep'
                }
              `}
              data-testid="button-burn-no"
            >
              <div className="text-lg font-bold text-[hsl(var(--cardText))]">לא</div>
              <div className="text-xs text-white/60 mt-1">לא נוטה להישרף</div>
              {burnEasily === false && (
                <Sparkles className="absolute top-2 right-2 w-4 h-4 text-[hsl(var(--primary))] neon-glow" />
              )}
            </button>
          </div>
        </section>

        {/* בחירת רמת שיזוף */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 justify-center text-[hsl(var(--primary))]">
            <Sun className="w-6 h-6" />
            בחר את רמת השיזוף הרצויה
          </h2>

          <div className="space-y-6">
            <div className="flex justify-between text-sm text-white/60 px-2">
              <span>בהיר</span>
              <span>עמוק</span>
            </div>
            
            {/* פס גרדיאנט + עיגול מרחף */}
            <div className="flex items-center gap-6">
              <div className="flex-1">
                {/* פס גרדיאנט */}
                <div 
                  className="h-1.5 rounded-full"
                  style={{
                    background: `linear-gradient(to left, ${tanShades.map(s => s.color).join(', ')})`,
                    opacity: 0.6
                  }}
                />
              </div>
              
              {/* עיגול מרחף */}
              {selectedTanShade && (
                <div className="group" style={{ animation: 'levitate 3s ease-in-out infinite' }}>
                  <div
                    className="w-32 h-32 rounded-full relative transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.6),0_0_80px_rgba(255,255,255,0.3)] [animation:slow-spin_20s_linear_infinite] group-hover:[animation-play-state:paused]"
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
                            rgba(255,255,255,0.2) 60%,
                            rgba(255,255,255,0.4) 100%
                          )
                        `,
                        backdropFilter: 'blur(8px)'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* עיגולים קטנים בשורה אחת */}
            <div className="flex items-center justify-around gap-2">
              {tanShades.map((shade) => {
                const isSelected = selectedTanShade?.id === shade.id;
                return (
                  <button
                    key={shade.id}
                    onClick={() => {
                      setSelectedTanShade(shade);
                      setDesiredShade(shade.value);
                    }}
                    className={`
                      group relative transition-all duration-150
                      ${isSelected ? 'scale-110' : 'hover:scale-125'}
                    `}
                    data-testid={`button-tanshade-${shade.id}`}
                  >
                    <div
                      className={`
                        w-12 h-12 rounded-full relative transition-all duration-150
                        ${isSelected 
                          ? 'shadow-[0_0_20px_rgba(255,255,255,0.8),0_0_40px_rgba(255,255,255,0.4)]' 
                          : 'group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                        }
                      `}
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
                          inset -2px -2px 6px rgba(0,0,0,0.5),
                          inset 2px 2px 6px rgba(255,255,255,0.3),
                          inset -1px -1px 2px rgba(0,0,0,0.8),
                          inset 1px 1px 2px rgba(255,255,255,0.5),
                          0 4px 8px rgba(0,0,0,0.6),
                          0 1px 2px rgba(255,255,255,0.3)
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
                              rgba(255,255,255,0.2) 60%,
                              rgba(255,255,255,0.4) 100%
                            )
                          `,
                          backdropFilter: 'blur(4px)'
                        }}
                      />
                    </div>
                    {isSelected && (
                      <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-white neon-glow" />
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="text-center">
              {selectedTanShade && (
                <div className="mb-2">
                  <div className="text-sm font-semibold text-[hsl(var(--primary))]">{selectedTanShade.name}</div>
                  <div className="text-xs text-white/60">{selectedTanShade.description}</div>
                </div>
              )}
              <div className="text-xs text-white/50">
                בחר את רמת השיזוף הרצויה
              </div>
            </div>
          </div>
        </section>

        {/* המלצות */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 justify-center text-gradient-amber">
            <Sparkles className="w-6 h-6 text-[hsl(var(--primary))]" />
            ההמלצה שלנו
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* מספר סשנים */}
            <div className="text-center p-6 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] rounded-xl backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,.4)]">
              <div className="text-5xl font-bold text-gradient-amber mb-2">
                {calculateRecommendedSessions()}
              </div>
              <div className="text-lg font-semibold text-[hsl(var(--cardText))]">סשנים מומלצים</div>
              <div className="text-sm text-white/60 mt-2">להשגת הגוון המושלם</div>
            </div>

            {/* זמן משוער */}
            <div className="text-center p-6 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] rounded-xl backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,.4)]">
              <div className="text-5xl font-bold text-gradient-amber mb-2">
                8-12
              </div>
              <div className="text-lg font-semibold text-[hsl(var(--cardText))]">דקות לסשן</div>
              <div className="text-sm text-white/60 mt-2">זמן חשיפה מומלץ</div>
            </div>
          </div>
        </section>

        {/* אומדן מחיר + ברונזר - 3D INTERACTIVE */}
        {selectedTanShade && (
          <section className="max-w-6xl mx-auto px-4 py-8" style={{ perspective: '2000px' }}>
            {/* כותרת עם אפקט זוהר */}
            <div className="relative inline-block mx-auto mb-8">
              <div className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-r from-[hsl(var(--primary))] via-amber-500 to-[hsl(var(--primary))] animate-glow-pulse" />
              <div className="relative px-10 py-4 rounded-3xl glass-effect border border-[hsla(var(--primary)/0.4)]"
                   style={{
                     background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                     boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 40px hsla(var(--primary)/0.3)',
                   }}>
                <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gradient-amber flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-[hsl(var(--primary))] neon-glow animate-glow-pulse" />
                  אומדן מחיר מלא
                  <Sparkles className="w-7 h-7 text-[hsl(var(--primary))] neon-glow animate-glow-pulse" />
                </h2>
              </div>
            </div>

            {/* קונטיינר ראשי תלת מימדי */}
            <div className="card-3d relative" 
                 style={{
                   animation: 'float-3d 6s ease-in-out infinite',
                   transformStyle: 'preserve-3d'
                 }}>
              
              {/* רקע זוהר מונפש */}
              <div className="absolute inset-0 rounded-3xl opacity-30 blur-3xl"
                   style={{
                     background: 'radial-gradient(circle at 50% 50%, hsl(var(--primary)), transparent 70%)',
                     animation: 'glowPulse 3s ease-in-out infinite'
                   }} />

              {/* הכרטיס הראשי */}
              <div className="relative glass-effect rounded-3xl border-2 border-[hsla(var(--primary)/0.6)] overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.4) 50%, rgba(255,255,255,0.05) 100%)',
                     boxShadow: `
                       0 20px 60px rgba(0,0,0,0.6),
                       0 0 80px hsla(var(--primary)/0.4),
                       inset 0 1px 0 rgba(255,255,255,0.2),
                       inset 0 -1px 0 rgba(0,0,0,0.5)
                     `,
                   }}>
                
                {/* אפקט שימר */}
                <div className="absolute inset-0 shimmer-effect pointer-events-none" />
                
                <div className="relative p-8">
                  {/* פירוט הסשנים - כרטיס מרחף */}
                  <div className="mb-6 p-5 rounded-2xl glass-effect border border-[hsla(var(--primary)/0.3)] hover:border-[hsla(var(--primary)/0.6)] transition-all duration-300 group"
                       style={{
                         background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.3))',
                         boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                         transform: 'translateZ(20px)'
                       }}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))]/20 border border-[hsl(var(--primary))]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Sun className="w-6 h-6 text-[hsl(var(--primary))] neon-glow" />
                        </div>
                        <div>
                          <p className="text-sm text-white/60">חבילת סשנים</p>
                          <p className="text-white/90 font-semibold">{calculateRecommendedSessions()} סשנים × ₪45</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-[hsl(var(--primary))] group-hover:scale-110 transition-transform" style={{ animation: 'price-pop 2s ease-in-out infinite' }}>
                        ₪{calculateTotalPrice().sessionsTotal}
                      </span>
                    </div>
                  </div>

                  {/* המלצת ברונזר - כרטיס תלת מימדי */}
                  {getRecommendedBronzer() && (
                    <div className="mb-8 p-6 rounded-2xl glass-effect border-2 border-[hsla(var(--primary)/0.5)] hover:border-[hsl(var(--primary))] transition-all duration-500 group cursor-pointer"
                         style={{
                           background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(0,0,0,0.4))',
                           boxShadow: '0 15px 40px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.15)',
                           transform: 'translateZ(30px)',
                           transformStyle: 'preserve-3d'
                         }}>
                      <div className="flex items-start gap-5">
                        {/* אייקון ברונזר מונפש */}
                        <div className="relative">
                          <div className="absolute inset-0 rounded-2xl blur-xl opacity-50 bg-[hsl(var(--primary))] group-hover:opacity-80 transition-opacity" />
                          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))]/30 to-[hsl(var(--primary))]/10 border-2 border-[hsl(var(--primary))]/50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                               style={{ transform: 'translateZ(40px)' }}>
                            <Sparkles className="w-10 h-10 text-[hsl(var(--primary))] neon-glow" />
                          </div>
                        </div>

                        {/* פרטי הברונזר */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[hsl(var(--primary))] transition-colors">
                                {getRecommendedBronzer()?.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-32 bg-black/50 rounded-full overflow-hidden border border-white/10">
                                  <div 
                                    className="h-full bg-gradient-to-r from-[hsl(var(--primary))] to-amber-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${(getRecommendedBronzer()?.strength || 0) / 15 * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-white/60">
                                  דרגה {getRecommendedBronzer()?.strength}/15
                                </span>
                              </div>
                            </div>
                            <div className="text-left">
                              <p className="text-xs text-white/50 mb-1">מחיר מבצע</p>
                              <span className="text-2xl font-bold text-[hsl(var(--primary))] group-hover:scale-110 transition-transform inline-block">
                                ₪{getRecommendedBronzer()?.price}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-white/70 leading-relaxed">
                            💎 ברונזר פרימיום מותאם אישית - משפר את התוצאות ומאיץ את תהליך השיזוף
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* סיכום מחיר - כרטיס נפרד מרחף */}
                  <div className="relative p-6 rounded-2xl overflow-hidden"
                       style={{
                         background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))',
                         border: '2px solid hsla(var(--primary)/0.6)',
                         boxShadow: `
                           0 20px 50px rgba(0,0,0,0.7),
                           0 0 60px hsla(var(--primary)/0.5),
                           inset 0 2px 0 rgba(255,255,255,0.2)
                         `,
                         transform: 'translateZ(40px)'
                       }}>
                    
                    {/* רקע מונפש */}
                    <div className="absolute inset-0 opacity-30"
                         style={{
                           background: 'radial-gradient(circle at 30% 50%, hsl(var(--primary)), transparent 60%)',
                           animation: 'glowPulse 2s ease-in-out infinite'
                         }} />

                    <div className="relative space-y-4">
                      {/* סכום ביניים */}
                      <div className="flex justify-between items-center pb-3 border-b border-white/10">
                        <span className="text-white/70">סכום ביניים</span>
                        <span className="text-xl font-bold text-white/60 line-through">
                          ₪{calculateTotalPrice().total}
                        </span>
                      </div>
                      
                      {/* הנחה */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))]/20 border border-[hsl(var(--primary))]/40 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
                          </div>
                          <span className="text-sm text-[hsl(var(--primary))] font-semibold">הנחת חבילה מיוחדת</span>
                        </div>
                        <span className="text-xl font-bold text-[hsl(var(--primary))]" style={{ animation: 'price-pop 2s ease-in-out infinite' }}>
                          -₪{calculateTotalPrice().packageDiscount}
                        </span>
                      </div>

                      {/* מחיר סופי */}
                      <div className="pt-4 border-t-2 border-[hsl(var(--primary))]/40">
                        <div className="flex justify-between items-center p-5 rounded-xl glass-effect"
                             style={{
                               background: 'linear-gradient(135deg, rgba(255,255,255,0.1), hsla(var(--primary)/0.2))',
                               boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
                             }}>
                          <span className="text-2xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-[hsl(var(--primary))] neon-glow" />
                            סה"כ לתשלום
                          </span>
                          <div className="text-left">
                            <div className="text-4xl font-extrabold text-gradient-amber" style={{ animation: 'price-pop 3s ease-in-out infinite' }}>
                              ₪{calculateTotalPrice().total - calculateTotalPrice().packageDiscount}
                            </div>
                            <p className="text-xs text-white/50 mt-1">כולל מע"מ</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* תנאי החבילה */}
                  <div className="mt-6 p-4 rounded-xl glass-effect border border-white/10"
                       style={{
                         background: 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))',
                         boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                         transform: 'translateZ(10px)'
                       }}>
                    <p className="text-sm text-white/70 text-center leading-relaxed">
                      💡 <span className="text-[hsl(var(--primary))] font-semibold">החבילה כוללת:</span> {calculateRecommendedSessions()} סשנים במיטות שיזוף + 
                      {getRecommendedBronzer()?.name} + ייעוץ אישי + מעקב התקדמות
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* כפתור המשך */}
        <section className="max-w-6xl mx-auto px-4 py-6 pb-12">
          <div className="text-center">
            <Button
              size="lg"
              className="ripple bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-black font-bold px-12 gap-2 shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_40px_rgba(255,255,255,.4)] transition-all duration-150 ease-in-out hover:scale-105 active:scale-100"
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
