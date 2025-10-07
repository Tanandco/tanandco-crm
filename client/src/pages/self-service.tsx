import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Home, Settings } from 'lucide-react';
import Logo from '@/components/Logo';
import Alin from '@/components/Alin';
import SunBedsDialog from '@/components/SunBedsDialog';
import SprayTanDialog from '@/components/SprayTanDialog';
import HairSalonDialog from '@/components/HairSalonDialog';
import CosmeticsDialog from '@/components/CosmeticsDialog';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import tanningBedIcon from '@assets/עיצוב ללא שם (30)_1759413689481.png';
import sprayTanIcon from '@assets/freepik__spray-tan-variation-b-modern-flatbadge-3d-spray-gu__47717_1759413070782.png';
import hairSalonIcon from '@assets/freepik__3d-neon-pink-icon-of-a-hair-salon-symbol-stylized-__47719_1759413079154.png';
import cosmeticsIcon from '@assets/עיצוב ללא שם (31)_1759413948155.png';
import storeIcon from '@assets/freepik__online-store-shopping-bag-variation-a-3d-shopping-__47713_1759413103497.png';
import selfServiceIcon from '@assets/עיצוב ללא שם (32)_1759414540774.png';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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

  const infoSlides = [
    {
      title: "מודל Hybrid",
      content: "שירות עצמי או ליווי מלא",
      icon: "🔄"
    },
    {
      title: "זמינות 24/7",
      content: "כניסה בזיהוי פנים",
      icon: "🕐"
    },
    {
      title: "שעות פעילות",
      content: "א׳–ה׳ 10:00–19:00",
      icon: "📅"
    },
    {
      title: "אלין - AI",
      content: "זמין/ה 24/7",
      icon: "🤖"
    },
    {
      title: "סביבה בטוחה",
      content: "מערכות מתקדמות",
      icon: "🔒"
    }
  ];

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

        /* 3D Carousel Styles */
        @keyframes flow-gradient {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 200%; }
        }

        .info-carousel .swiper-slide {
          width: 180px !important;
          height: 120px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          border-radius: 12px;
          background: linear-gradient(135deg, 
            rgba(236, 72, 153, 0.2) 0%,
            rgba(168, 85, 247, 0.15) 50%,
            rgba(236, 72, 153, 0.1) 100%);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(236, 72, 153, 0.6);
          box-shadow: 
            0 8px 16px rgba(0, 0, 0, 0.3),
            0 16px 32px rgba(236, 72, 153, 0.3),
            0 0 60px rgba(236, 72, 153, 0.1);
          position: relative;
          transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
          overflow: visible;
          transform: translateY(0) rotateX(0deg);
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .info-carousel .swiper-slide::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 12px;
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
          z-index: -1;
          animation: flow-gradient 4s linear infinite;
          opacity: 0.7;
        }

        .info-carousel .swiper-slide-active {
          background: linear-gradient(135deg, 
            rgba(236, 72, 153, 0.3) 0%,
            rgba(168, 85, 247, 0.2) 50%,
            rgba(236, 72, 153, 0.15) 100%);
          backdrop-filter: blur(16px);
          box-shadow: 
            0 16px 32px rgba(0, 0, 0, 0.5),
            0 24px 48px rgba(236, 72, 153, 0.5),
            0 0 80px rgba(236, 72, 153, 0.3);
          transform: translateY(-6px) scale(1.05) rotateX(2deg);
          border-color: rgba(236, 72, 153, 0.8);
        }

        .info-carousel .swiper-button-next,
        .info-carousel .swiper-button-prev {
          background: rgba(0, 0, 0, 0.4);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .info-carousel .swiper-button-next::after {
          content: '👈';
          font-size: 24px;
        }
        
        .info-carousel .swiper-button-prev::after {
          content: '👉';
          font-size: 24px;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-glow-pulse,
          .fade-out,
          .info-carousel .swiper-slide::before {
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
        <div className="max-w-6xl mx-auto px-3 py-1.5 flex items-center gap-2">
          <Logo size="small" showGlow={false} showUnderline={false} />
          <ul className="mr-auto flex gap-2 text-xs">
            <li>
              <a href="#services" className="hover:text-[hsl(var(--primary))] transition-colors">
                שירותים
              </a>
            </li>
            <li>
              <a href="#info" className="hover:text-[hsl(var(--primary))] transition-colors">
                מידע
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* CORNER BUTTONS */}
      <div className="fixed top-2 left-2 z-50 flex gap-1.5">
        <button
          onClick={() => navigate('/')}
          aria-label="Home"
          className="size-9 rounded-full backdrop-blur-xl bg-[hsla(var(--muted)/0.6)] border border-[hsla(var(--primary)/0.4)] hover:border-[hsl(var(--primary))] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,.3)] hover:scale-105 transition-all"
          data-testid="button-home"
        >
          <Home size={16} className="text-white" />
        </button>
        <button
          onClick={() => alert('Settings')}
          aria-label="Settings"
          className="size-9 rounded-full backdrop-blur-xl bg-[hsla(var(--muted)/0.6)] border border-[hsla(var(--primary)/0.4)] hover:border-[hsl(var(--primary))] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,.3)] hover:scale-105 transition-all"
          data-testid="button-settings"
        >
          <Settings size={16} className="text-white" />
        </button>
      </div>

      <main className="relative z-10 h-[calc(100vh-44px)] flex flex-col">
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
                  <img src={storeIcon} alt="החנות שלכם" className="w-20 h-20 mb-2 neon-glow object-contain" />
                  <div className="text-sm font-bold tracking-tight">החנות שלכם</div>
                </div>
              </a>

              {/* AI TAN (Alin) */}
              <a
                href="https://wa.me/972557247033"
                target="_blank"
                rel="noopener noreferrer"
                className="h-[140px] w-[130px] rounded-xl p-3 ripple bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-[hsla(var(--primary)/0.6)] hover:border-[hsl(var(--primary))] text-[hsl(var(--cardText))] shadow-[0_8px_20px_rgba(0,0,0,.4)] hover:shadow-[0_8px_20px_rgba(0,0,0,.45),0_0_60px_rgba(236,72,153,.3)] transition-all duration-150 ease-in-out hover:scale-105 active:scale-100 backdrop-blur-sm flex items-center justify-center text-center"
                onMouseMove={handleRippleMove}
                data-testid="card-ai-tan"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="relative rounded-full overflow-hidden w-20 h-20 mb-2 neon-glow">
                    <Alin size={80} />
                  </div>
                  <div className="text-sm font-bold tracking-tight">AI TAN</div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* 3D INFO CAROUSEL */}
        <section id="info" className="relative py-2 flex-1 min-h-0">
          <div className="max-w-6xl mx-auto px-3 h-full flex flex-col">
            <h2 className="text-base md:text-lg font-bold mb-2 text-center text-[hsl(var(--primary))]">
              מידע חשוב
            </h2>
            <div className="flex-1 min-h-0">
              <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                initialSlide={1}
                loop={true}
                coverflowEffect={{
                  rotate: 35,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                navigation={true}
                modules={[EffectCoverflow, Navigation]}
                className="info-carousel h-full"
                dir="rtl"
              >
                {infoSlides.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <div className="text-center">
                      <div className="text-2xl mb-1.5">{slide.icon}</div>
                      <h3 className="text-sm font-bold text-[hsl(var(--primary))] mb-1">
                        {slide.title}
                      </h3>
                      <p className="text-white/80 text-[10px]">
                        {slide.content}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>

        {/* FOOTER WITH ALIN */}
        <footer className="border-t border-[hsl(var(--border))] py-2 flex-shrink-0">
          <div className="max-w-6xl mx-auto px-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative rounded-full overflow-hidden w-9 h-9 neon-glow shrink-0">
                <Alin size={36} />
              </div>
              <div className="flex-1">
                <h4 className="text-[10px] font-semibold text-[hsl(var(--primary))]">אלין - AI</h4>
                <p className="text-white/80 text-[9px]">זמין/ה 24/7</p>
              </div>
            </div>
            <a
              href="https://wa.me/972557247033"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-[hsl(var(--primary))] text-black text-[10px] font-semibold hover:opacity-90 transition-opacity"
              data-testid="button-chat-with-alin"
            >
              דברו עם אלין
            </a>
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
