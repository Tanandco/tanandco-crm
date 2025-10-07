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
      className="min-h-screen bg-black text-white antialiased selection:bg-white/10"
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

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-glow-pulse,
          .fade-out {
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

      {/* NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-black/70 border-b border-[hsl(var(--border))]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <span className="text-[hsl(var(--primary))] font-semibold">Tan & Co</span>
          <ul className="mr-auto flex gap-4 text-sm">
            <li>
              <a href="#services" className="hover:text-[hsl(var(--primary))] transition-colors">
                שירותים
              </a>
            </li>
            <li>
              <a href="#hybrid" className="hover:text-[hsl(var(--primary))] transition-colors">
                Hybrid
              </a>
            </li>
            <li>
              <a href="#hours" className="hover:text-[hsl(var(--primary))] transition-colors">
                שעות
              </a>
            </li>
            <li>
              <a href="#bot" className="hover:text-[hsl(var(--primary))] transition-colors">
                אלין
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* CORNER BUTTONS */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <button
          onClick={() => navigate('/')}
          aria-label="Home"
          className="size-12 rounded-full backdrop-blur-xl bg-[hsla(var(--muted)/0.6)] border border-[hsla(var(--primary)/0.4)] hover:border-[hsl(var(--primary))] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,.3)] hover:scale-105 transition-all"
          data-testid="button-home"
        >
          <Home size={20} className="text-white" />
        </button>
        <button
          onClick={() => alert('Settings')}
          aria-label="Settings"
          className="size-12 rounded-full backdrop-blur-xl bg-[hsla(var(--muted)/0.6)] border border-[hsla(var(--primary)/0.4)] hover:border-[hsl(var(--primary))] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,.3)] hover:scale-105 transition-all"
          data-testid="button-settings"
        >
          <Settings size={20} className="text-white" />
        </button>
      </div>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-14">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-[hsla(var(--primary)/0.05)]" />
          <div className="relative max-w-6xl mx-auto px-6 text-right">
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
              ברוכים הבאים · Tan & Co · המודל ההיברידי של השיזוף
            </h2>
            <p className="mt-3 text-white/80 max-w-3xl mr-auto">
              בחרו שירות והתחילו — שירות עצמי 24/7 או ליווי מלא מצוות מקצועי, לפי מה שנוח לכם.
            </p>
          </div>
        </section>

        {/* SERVICE CARDS */}
        <section id="services" className="relative py-12">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/0 via-black/30 to-black/0" />
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-8 text-[hsl(var(--primary))]">
              בחרו את השירות המועדף עליכם
            </h3>
            <div className="flex gap-3 justify-center flex-wrap max-w-5xl mx-auto">
              {/* Sun Beds */}
              <button
                onClick={() => setSunBedsOpen(true)}
                className="h-[160px] w-[150px] rounded-2xl p-4 ripple bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] hover:border-[hsl(var(--primary))] text-[hsl(var(--cardText))] shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.3)] transition-all duration-300 ease-in-out hover:scale-105 active:scale-100 backdrop-blur-sm"
                onMouseMove={handleRippleMove}
                data-testid="card-sun-beds"
              >
                <div className="h-full w-full flex flex-col items-center justify-center text-center">
                  <img src={tanningBedIcon} alt="מיטות שיזוף" className="w-8 h-8 mb-2 neon-glow object-contain" />
                  <div className="text-[15px] font-bold tracking-tight">מיטות שיזוף</div>
                  <div className="text-xs text-white/70 mt-1">Self‑Service 24/7</div>
                </div>
              </button>

              {/* Spray Tan */}
              <button
                onClick={() => setSprayTanOpen(true)}
                className="h-[160px] w-[150px] rounded-2xl p-4 ripple bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] hover:border-[hsl(var(--primary))] text-[hsl(var(--cardText))] shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.3)] transition-all duration-300 ease-in-out hover:scale-105 active:scale-100 backdrop-blur-sm"
                onMouseMove={handleRippleMove}
                data-testid="card-spray-tan"
              >
                <div className="h-full w-full flex flex-col items-center justify-center text-center">
                  <img src={sprayTanIcon} alt="שיזוף בהתזה" className="w-8 h-8 mb-2 neon-glow object-contain" />
                  <div className="text-[15px] font-bold tracking-tight">שיזוף בהתזה</div>
                  <div className="text-xs text-white/70 mt-1">תוצאה טבעית ומהירה</div>
                </div>
              </button>

              {/* Hair Salon */}
              <button
                onClick={() => setHairSalonOpen(true)}
                className="h-[160px] w-[150px] rounded-2xl p-4 ripple bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] hover:border-[hsl(var(--primary))] text-[hsl(var(--cardText))] shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.3)] transition-all duration-300 ease-in-out hover:scale-105 active:scale-100 backdrop-blur-sm"
                onMouseMove={handleRippleMove}
                data-testid="card-hair-salon"
              >
                <div className="h-full w-full flex flex-col items-center justify-center text-center">
                  <img src={hairSalonIcon} alt="מספרה" className="w-8 h-8 mb-2 neon-glow object-contain" />
                  <div className="text-[15px] font-bold tracking-tight">מספרה</div>
                  <div className="text-xs text-white/70 mt-1">עיצוב · צבע · שיקום</div>
                </div>
              </button>

              {/* Cosmetics */}
              <button
                onClick={() => setCosmeticsOpen(true)}
                className="h-[160px] w-[150px] rounded-2xl p-4 ripple bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] hover:border-[hsl(var(--primary))] text-[hsl(var(--cardText))] shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.3)] transition-all duration-300 ease-in-out hover:scale-105 active:scale-100 backdrop-blur-sm"
                onMouseMove={handleRippleMove}
                data-testid="card-cosmetics"
              >
                <div className="h-full w-full flex flex-col items-center justify-center text-center">
                  <img src={cosmeticsIcon} alt="קוסמטיקה" className="w-8 h-8 mb-2 neon-glow object-contain" />
                  <div className="text-[15px] font-bold tracking-tight">קוסמטיקה</div>
                  <div className="text-xs text-white/70 mt-1">פנים · גבות · ציפורניים</div>
                </div>
              </button>

              {/* Store */}
              <a
                href="/shop"
                className="h-[160px] w-[150px] rounded-2xl p-4 ripple bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] hover:border-[hsl(var(--primary))] text-[hsl(var(--cardText))] shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.3)] transition-all duration-300 ease-in-out hover:scale-105 active:scale-100 backdrop-blur-sm flex items-center justify-center text-center"
                onMouseMove={handleRippleMove}
                data-testid="card-store"
              >
                <div>
                  <img src={storeIcon} alt="החנות שלכם" className="w-8 h-8 mb-2 neon-glow mx-auto object-contain" />
                  <div className="text-[15px] font-bold tracking-tight">החנות שלכם</div>
                  <div className="text-xs text-white/70 mt-1">מוצרי שיזוף וטיפוח</div>
                </div>
              </a>

              {/* AI TAN (Alin) */}
              <a
                href="https://wa.me/972557247033"
                target="_blank"
                rel="noopener noreferrer"
                className="h-[160px] w-[150px] rounded-2xl p-4 ripple bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] hover:border-[hsl(var(--primary))] text-[hsl(var(--cardText))] shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.3)] transition-all duration-300 ease-in-out hover:scale-105 active:scale-100 backdrop-blur-sm flex items-center justify-center text-center"
                onMouseMove={handleRippleMove}
                data-testid="card-ai-tan"
              >
                <div className="flex flex-col items-center">
                  <div className="relative rounded-full overflow-hidden w-[88px] h-[88px] neon-glow">
                    <Alin size={88} />
                  </div>
                  <div className="mt-2 text-[15px] font-bold tracking-tight">AI TAN (אלין)</div>
                  <div className="text-xs text-white/70">צ׳ט 24/7</div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* HYBRID SECTION */}
        <section id="hybrid" className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">מודל Hybrid: בוחרים חוויה</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6 bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">
              <h3 className="text-xl font-semibold mb-2">שירות עצמי חכם</h3>
              <ul className="space-y-1 text-white/80">
                <li>• הרשמה עצמאית בשעות הפעילות</li>
                <li>• צוות מקצועי זמין לסיוע</li>
                <li>• ללא תיאום מראש</li>
              </ul>
            </div>
            <div className="rounded-2xl p-6 bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">
              <h3 className="text-xl font-semibold mb-2">שירות מלא ומלווה</h3>
              <ul className="space-y-1 text-white/80">
                <li>• ליווי אישי מקצה לקצה</li>
                <li>• התאמת גוון ותהליך</li>
                <li>• תוצאה עקבית ומדויקת</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 24/7 AVAILABILITY */}
        <section className="max-w-6xl mx-auto px-6">
          <div className="rounded-2xl p-6 bg-[hsl(var(--accent))] border border-[hsla(var(--primary)/0.6)] shadow-[0_0_60px_rgba(236,72,153,.3)]">
            <h3 className="text-xl font-semibold">זמינות 24/7 ללקוחות הבוטיק</h3>
            <p className="text-white/80 mt-2">
              לאחר שעות הפעילות — כניסה למתחם באמצעות מערכת זיהוי פנים מתקדמת*. סביבה נקייה, בטוחה ומקצועית.
            </p>
            <p className="text-xs text-white/50 mt-2">*שירות עצמי לאחר שעות הפעילות.</p>
          </div>
        </section>

        {/* HOURS + BOT */}
        <section id="hours" className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
            <h4 className="text-lg font-semibold mb-2">שעות פעילות</h4>
            <p>א׳–ה׳ 10:00–19:00 · ו׳ 10:00–14:00 · שבת — סגור</p>
            <p className="text-xs text-white/60 mt-1">שירות עצמי לאחר שעות הפעילות.</p>
          </div>
          <div id="bot" className="rounded-2xl p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] flex items-center gap-4">
            <div className="relative rounded-full overflow-hidden w-[64px] h-[64px] neon-glow shrink-0">
              <Alin size={64} />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-[hsl(var(--primary))]">אלין — הצ׳טבוט החכם</h4>
              <p className="text-white/80 text-sm">AI TAN לשאלות, ייעוץ וקביעת תור — זמין/ה 24/7</p>
            </div>
            <a
              href="https://wa.me/972557247033"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[hsl(var(--primary))] text-black font-semibold hover:opacity-90 transition-opacity"
              data-testid="button-chat-with-alin"
            >
              דברו עם אלין
            </a>
          </div>
        </section>

        {/* CTA BUTTON */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="w-full flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="h-[80px] w-[280px] ripple relative overflow-hidden rounded-2xl border transition-all duration-300 ease-in-out border-[hsla(var(--primary)/0.6)] hover:border-[hsl(var(--primary))] bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,.4),0_0_60px_rgba(236,72,153,.30)] hover:scale-[1.02] active:scale-[0.99]"
              onMouseMove={handleRippleMove}
              data-testid="button-cta-self-service"
            >
              <div className="flex h-full items-center justify-center gap-3">
                <img src={selfServiceIcon} alt="Self Service" className="w-6 h-6 neon-glow object-contain" />
                <span className="text-xl font-bold tracking-tight">שירות עצמי 24/7</span>
              </div>
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[hsl(var(--border))] py-8 text-center text-white/60 text-sm">
        <div className="h-px w-72 mx-auto mb-4 bg-gradient-to-r from-transparent via-[rgba(236,72,153,.6)] via-[rgba(147,51,234,.5)] to-transparent" />
        © Tan & Co · עיצוב נאון · 24/7
      </footer>

      {/* DIALOGS */}
      <SunBedsDialog open={sunBedsOpen} onOpenChange={setSunBedsOpen} />
      <SprayTanDialog open={sprayTanOpen} onOpenChange={setSprayTanOpen} />
      <HairSalonDialog open={hairSalonOpen} onOpenChange={setHairSalonOpen} />
      <CosmeticsDialog open={cosmeticsOpen} onOpenChange={setCosmeticsOpen} />
    </div>
  );
}
