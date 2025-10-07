import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Home, Settings } from 'lucide-react';
import Logo from '@/components/Logo';
import Alin from '@/components/Alin';
import SunBedsDialog from '@/components/SunBedsDialog';
import SprayTanDialog from '@/components/SprayTanDialog';
import HairSalonDialog from '@/components/HairSalonDialog';
import CosmeticsDialog from '@/components/CosmeticsDialog';
import tanningBedIcon from '@assets/עיצוב ללא שם (30)_1759413689481.png';
import sprayTanIcon from '@assets/freepik__spray-tan-variation-b-modern-flatbadge-3d-spray-gu__47717_1759413070782.png';
import hairSalonIcon from '@assets/freepik__3d-neon-pink-icon-of-a-hair-salon-symbol-stylized-__47719_1759413079154.png';
import cosmeticsIcon from '@assets/עיצוב ללא שם (31)_1759413948155.png';
import storeIcon from '@assets/freepik__online-store-shopping-bag-variation-a-3d-shopping-__47713_1759413103497.png';
import selfServiceIcon from '@assets/עיצוב ללא שם (32)_1759414540774.png';

export default function SelfService() {
  const [, navigate] = useLocation();
  const [splashVisible, setSplashVisible] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [sunBedsOpen, setSunBedsOpen] = useState(false);
  const [sprayTanOpen, setSprayTanOpen] = useState(false);
  const [hairSalonOpen, setHairSalonOpen] = useState(false);
  const [cosmeticsOpen, setCosmeticsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto-close splash after 2.4 seconds
    timeoutRef.current = setTimeout(() => {
      closeSplash();
    }, 2400);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const closeSplash = () => {
    if (splashFading) return;
    setSplashFading(true);
    setTimeout(() => {
      setSplashVisible(false);
    }, 600);
  };

  const handleSplashClick = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    closeSplash();
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
      className="h-screen overflow-hidden bg-black text-white antialiased selection:bg-white/10"
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

        /* Fade out animation */
        @keyframes fadeOut {
          to {
            opacity: 0;
            visibility: hidden;
          }
        }
        .fade-out {
          animation: fadeOut 0.6s ease forwards;
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

        /* Alin floating bubble animation */
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        /* Text bubble slide in animation */
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
        }

        /* Typing animation */
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: rgba(236, 72, 153, 0.8); }
        }
        .typing-effect {
          overflow: hidden;
          white-space: nowrap;
          border-left: 3px solid rgba(236, 72, 153, 0.8);
          animation: 
            typing 2.5s steps(50, end) forwards,
            blink-caret 0.75s step-end infinite;
          animation-delay: 0.3s;
          width: 0;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-glow-pulse,
          .fade-out,
          .animate-bounce-slow,
          .animate-slide-in-left {
            animation: none !important;
          }
        }
      `}</style>

      {/* SPLASH SCREEN */}
      {splashVisible && (
        <div
          onClick={handleSplashClick}
          className={`fixed inset-0 z-50 bg-black grid place-items-center cursor-pointer ${
            splashFading ? 'fade-out' : ''
          }`}
          data-testid="splash-screen"
        >
          <div className="text-center px-6">
            <Logo 
              className="mx-auto"
              size="large"
              showGlow={true}
              showUnderline={false}
            />
            
            {/* Neon line under logo */}
            <div className="mt-4 h-px w-64 mx-auto bg-gradient-to-r from-transparent via-[rgba(236,72,153,.6)] via-[rgba(147,51,234,.5)] to-transparent" />

            <h1 className="mt-6 text-3xl md:text-5xl font-extrabold">שירות עצמי 24/7</h1>
            <p className="mt-2 text-white/70">כניסה בזיהוי פנים · ללא תיאום מראש · צוות אנושי זמין</p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <a
                href="#services"
                className="px-6 py-3 rounded-2xl font-semibold bg-[hsl(var(--primary))] text-black hover:opacity-90 transition-opacity"
                data-testid="button-start-service"
              >
                להתחלת שימוש
              </a>
              <a
                href="https://wa.me/972557247033"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl border border-[hsla(var(--primary)/0.6)] hover:bg-white/10 transition-colors"
                data-testid="button-chat-alin"
              >
                צ׳אט עם אלין
              </a>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 h-screen flex flex-col">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-2">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-[hsla(var(--primary)/0.05)]" />
          <div className="relative max-w-6xl mx-auto px-3 text-center">
            <h2 className="text-base md:text-lg font-extrabold leading-tight">
              המודל ההיברידי של תעשיית השיזוף - העולם של המחר
            </h2>
          </div>
        </section>

        {/* SERVICE CARDS */}
        <section id="services" className="relative py-2 flex-shrink-0">
          <div className="max-w-6xl mx-auto px-3 text-center">
            <h3 className="text-base md:text-lg font-extrabold mb-2 text-[hsl(var(--primary))]">
              בחרו את השירות המועדף עליכם
            </h3>
            <div className="flex gap-2 justify-center flex-wrap max-w-5xl mx-auto">
              {/* Sun Beds */}
              <button
                onClick={() => setSunBedsOpen(true)}
                className="h-[140px] w-[130px] rounded-xl p-3 ripple bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] hover:border-[hsl(var(--primary))] text-[hsl(var(--cardText))] shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.3)] transition-all duration-150 ease-in-out hover:scale-105 active:scale-100 backdrop-blur-sm"
                onMouseMove={handleRippleMove}
                data-testid="card-sun-beds"
              >
                <div className="h-full w-full flex flex-col items-center justify-center text-center">
                  <img src={tanningBedIcon} alt="מיטות שיזוף" className="w-20 h-20 mb-2 neon-glow object-contain" />
                  <div className="text-sm font-bold tracking-tight">מיטות שיזוף</div>
                </div>
              </button>

              {/* Spray Tan */}
              <button
                onClick={() => setSprayTanOpen(true)}
                className="h-[140px] w-[130px] rounded-xl p-3 ripple bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] hover:border-[hsl(var(--primary))] text-[hsl(var(--cardText))] shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.3)] transition-all duration-150 ease-in-out hover:scale-105 active:scale-100 backdrop-blur-sm"
                onMouseMove={handleRippleMove}
                data-testid="card-spray-tan"
              >
                <div className="h-full w-full flex flex-col items-center justify-center text-center">
                  <img src={sprayTanIcon} alt="שיזוף בהתזה" className="w-20 h-20 mb-2 neon-glow object-contain" />
                  <div className="text-sm font-bold tracking-tight">שיזוף בהתזה</div>
                </div>
              </button>

              {/* Hair Salon */}
              <button
                onClick={() => setHairSalonOpen(true)}
                className="h-[140px] w-[130px] rounded-xl p-3 ripple bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] hover:border-[hsl(var(--primary))] text-[hsl(var(--cardText))] shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.3)] transition-all duration-150 ease-in-out hover:scale-105 active:scale-100 backdrop-blur-sm"
                onMouseMove={handleRippleMove}
                data-testid="card-hair-salon"
              >
                <div className="h-full w-full flex flex-col items-center justify-center text-center">
                  <img src={hairSalonIcon} alt="מספרה" className="w-20 h-20 mb-2 neon-glow object-contain" />
                  <div className="text-sm font-bold tracking-tight">מספרה</div>
                </div>
              </button>

              {/* Cosmetics */}
              <button
                onClick={() => setCosmeticsOpen(true)}
                className="h-[140px] w-[130px] rounded-xl p-3 ripple bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] hover:border-[hsl(var(--primary))] text-[hsl(var(--cardText))] shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.3)] transition-all duration-150 ease-in-out hover:scale-105 active:scale-100 backdrop-blur-sm"
                onMouseMove={handleRippleMove}
                data-testid="card-cosmetics"
              >
                <div className="h-full w-full flex flex-col items-center justify-center text-center">
                  <img src={cosmeticsIcon} alt="קוסמטיקה" className="w-20 h-20 mb-2 neon-glow object-contain" />
                  <div className="text-sm font-bold tracking-tight">קוסמטיקה</div>
                </div>
              </button>

              {/* Store */}
              <a
                href="/shop"
                className="h-[140px] w-[130px] rounded-xl p-3 ripple bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] hover:border-[hsl(var(--primary))] text-[hsl(var(--cardText))] shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.3)] transition-all duration-150 ease-in-out hover:scale-105 active:scale-100 backdrop-blur-sm flex items-center justify-center text-center"
                onMouseMove={handleRippleMove}
                data-testid="card-store"
              >
                <div className="flex flex-col items-center justify-center">
                  <img src={storeIcon} alt="החנות שלכם" className="w-16 h-16 mb-2 neon-glow object-contain" />
                  <div className="text-sm font-bold tracking-tight">החנות שלכם</div>
                </div>
              </a>

              {/* AI TAN (Alin) */}
              <a
                href="https://wa.me/972557247033"
                target="_blank"
                rel="noopener noreferrer"
                className="h-[140px] w-[130px] rounded-xl p-1 ripple bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] hover:border-[hsl(var(--primary))] text-[hsl(var(--cardText))] shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.3)] transition-all duration-150 ease-in-out hover:scale-105 active:scale-100 backdrop-blur-sm flex items-center justify-center text-center"
                onMouseMove={handleRippleMove}
                data-testid="card-ai-tan"
              >
                <div className="flex items-center justify-center w-full h-full">
                  <Alin size={136} />
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* WELCOME MESSAGE */}
        <section id="info" className="relative py-3 flex-1 min-h-0">
          <div className="max-w-4xl mx-auto px-4 h-full flex flex-col justify-center">
            <div className="text-center space-y-3">
              <p className="text-white/90 text-base leading-relaxed mb-3">
                אנחנו מובילים את מודל ה־Hybrid: חופש לבחור בין <span className="text-[hsl(var(--primary))] font-semibold">שירות עצמי חכם</span> לשירות מלא ע״י <span className="text-[hsl(var(--primary))] font-semibold">צוות מקצועי</span> — באותה רמת דיוק, בכל פעם.
              </p>

              <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] rounded-2xl p-4 backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,.4),0_0_60px_rgba(236,72,153,.2)] mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-[hsl(var(--primary))]/20 to-transparent border border-[hsl(var(--primary))]/30 rounded-lg p-3 backdrop-blur-sm">
                    <h3 className="text-[hsl(var(--primary))] font-bold text-base mb-1">חופש בחירה מלא</h3>
                    <p className="text-white/80 text-sm">הרשמה ופעולה עצמאית בשעות הפעילות, עם ליווי זמין של צוות מקצועי</p>
                  </div>

                  <div className="bg-gradient-to-br from-[hsl(var(--primary))]/20 to-transparent border border-[hsl(var(--primary))]/30 rounded-lg p-3 backdrop-blur-sm">
                    <h3 className="text-[hsl(var(--primary))] font-bold text-base mb-1">או שירות מלא</h3>
                    <p className="text-white/80 text-sm">איש/אשת צוות מנוסה מלווה אתכם מקצה לקצה</p>
                  </div>
                </div>

                <div className="bg-black/40 border border-[hsl(var(--primary))]/40 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-white/90 font-semibold text-base mb-2">ללא תיאום מראש. ללא תורים.</p>
                  
                  <div className="space-y-1.5 text-sm text-white/80">
                    <p><span className="text-[hsl(var(--primary))]">כניסה עצמאית בכל שעה</span> של היום ובלילה*</p>
                    <p>מיטות שיזוף זמינות <span className="text-[hsl(var(--primary))]">24/7</span> ללקוחות הבוטיק</p>
                    <p>לאחר שעות הפעילות — כניסה ע״י <span className="text-[hsl(var(--primary))]">מערכת זיהוי פנים</span> מתקדמת*</p>
                    <p>סביבה נקייה, בטוחה ומקצועית</p>
                    <p>שירות לקוחות זמין 24/7</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/20">
                    <p className="text-[hsl(var(--primary))] font-bold text-sm mb-1">שעות פעילות:</p>
                    <p className="text-white/70 text-xs">
                      א׳–ה׳ 10:00–19:00 · ו׳ 10:00–14:00 · שבת — סגור
                      <br />
                      <span className="text-white/50">* שירות עצמי לאחר שעות הפעילות</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER WITH ALIN */}
        <footer className="border-t border-[hsl(var(--border))] py-3 flex-shrink-0">
          <div className="max-w-6xl mx-auto px-3">
            <div className="flex items-center gap-4">
              {/* Alin Floating Bubble */}
              <a
                href="https://wa.me/972557247033"
                target="_blank"
                rel="noopener noreferrer"
                className="relative shrink-0 group"
                data-testid="button-chat-with-alin"
              >
                <div className="relative rounded-full overflow-hidden w-24 h-24 neon-glow border-2 border-[hsl(var(--primary))]/60 bg-gradient-to-br from-[hsl(var(--primary))]/20 to-transparent backdrop-blur-sm animate-bounce-slow hover:scale-110 transition-transform">
                  <Alin size={96} />
                </div>
              </a>
              
              {/* Flowing Text Bubble with Typing Effect */}
              <div className="relative flex-1 bg-gradient-to-r from-[hsl(var(--primary))]/20 to-transparent border border-[hsl(var(--primary))]/40 rounded-2xl rounded-tr-sm p-3 backdrop-blur-sm animate-slide-in-left">
                <p className="text-white/90 text-xs typing-effect">
                  היי, אני אלין! העוזרת הדיגיטלית שלכם זמינה 24/7 - לחצו עליי לשיחה בוואטסאפ
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* DIALOGS */}
      <SunBedsDialog open={sunBedsOpen} onOpenChange={setSunBedsOpen} />
      <SprayTanDialog open={sprayTanOpen} onOpenChange={setSprayTanOpen} />
      <HairSalonDialog open={hairSalonOpen} onOpenChange={setHairSalonOpen} />
      <CosmeticsDialog open={cosmeticsOpen} onOpenChange={setCosmeticsOpen} />
    </div>
  );
}
