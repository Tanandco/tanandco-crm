import { Home, Settings, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import Logo from './Logo';

interface PageLayoutProps {
  children: React.ReactNode;
  showLogo?: boolean;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showSettingsButton?: boolean;
  logoSize?: 'small' | 'medium' | 'large';
  maxWidth?: string;
  className?: string;
}

export default function PageLayout({
  children,
  showLogo = true,
  showBackButton = false,
  showHomeButton = true,
  showSettingsButton = true,
  logoSize = 'small',
  maxWidth = 'max-w-6xl',
  className = '',
}: PageLayoutProps) {
  const [, navigate] = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div 
      className={`min-h-screen bg-black text-white font-hebrew relative ${className}`}
      dir="rtl"
    >
      {/* Main Content */}
      <div className={`relative z-10 mx-auto ${maxWidth} w-full px-6 py-6`}>
        {/* Logo */}
        {showLogo && (
          <div className="mb-6">
            <Logo size={logoSize} showGlow={true} showUnderline={false} />
          </div>
        )}

        {/* Page Content */}
        {children}
      </div>

      {/* Fixed Corner Navigation Buttons */}
      <div className="fixed top-4 left-4 z-50 flex gap-3">
        {showBackButton && (
          <button
            className="
              group relative w-12 h-12
              bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
              border border-gray-500/60 hover:border-gray-400/80
              rounded-lg backdrop-blur-sm
              flex items-center justify-center
              transition-all duration-300 ease-in-out
              hover:scale-105 active:scale-95
              hover-elevate active-elevate-2
            "
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => window.history.back()}
            data-testid="button-back-nav"
          >
            <ArrowRight 
              className="text-white group-hover:text-pink-400 transition-colors duration-300" 
              size={20}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
              }}
            />
          </button>
        )}
      </div>

      <div className="fixed top-4 right-4 z-50 flex gap-3">
        {showHomeButton && (
          <button
            className="
              group relative w-12 h-12
              bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
              border border-gray-500/60 hover:border-gray-400/80
              rounded-lg backdrop-blur-sm
              flex items-center justify-center
              transition-all duration-300 ease-in-out
              hover:scale-105 active:scale-95
              hover-elevate active-elevate-2
            "
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => handleNavigation('/')}
            data-testid="button-home-nav"
          >
            <Home 
              className="text-white group-hover:text-pink-400 transition-colors duration-300" 
              size={20}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
              }}
            />
          </button>
        )}
        
        {/* Settings button hidden until /settings route is implemented */}
      </div>
    </div>
  );
}
