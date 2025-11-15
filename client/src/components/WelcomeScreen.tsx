import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Logo from './Logo';
import { Sparkles, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue?: () => void;
}

export default function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const [, navigate] = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      handleContinue();
    }, 3000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onContinue) {
        onContinue();
      } else {
        navigate('/');
      }
    }, 500);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      dir="rtl"
    >
      <div className="text-center px-6 animate-fade-in">
        {/* Logo */}
        <div className="mb-8 animate-bounce-slow">
          <Logo size="large" showGlow={true} showUnderline={false} />
        </div>

        {/* Welcome Message */}
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-gradient-flow">
            ברוכים הבאים!
          </h1>
          <p className="text-xl md:text-2xl text-white/80 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" />
            <span>Tan & Co CRM</span>
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
          </p>
          <p className="text-lg text-white/60 mt-4">
            מערכת ניהול לקוחות מתקדמת
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex items-center justify-center gap-2 text-pink-400 mb-8">
          <Heart className="w-5 h-5 animate-pulse" />
          <span className="text-sm">נבנה באהבה</span>
          <Heart className="w-5 h-5 animate-pulse" />
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center gap-2 text-white/40">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Click to skip */}
        <button
          onClick={handleContinue}
          className="mt-8 text-white/40 hover:text-white/60 text-sm transition-colors"
        >
          לחץ לדילוג
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        @keyframes gradient-flow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-flow {
          background-size: 200% auto;
          animation: gradient-flow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

