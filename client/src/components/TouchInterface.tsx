import { useState } from 'react';
import { useLocation } from 'wouter';
import { Home, Palette, Scissors, Store, Sun, Droplets, Star, Search, UserPlus, Sparkles, Settings, Users } from 'lucide-react';
import Logo from './Logo';
import ServiceCard from './ServiceCard';
import StatusDisplay from './StatusDisplay';
import { Button } from '@/components/ui/button';

interface TouchInterfaceProps {
  onServiceSelect?: (service: string) => void;
  onNavigate?: (path: string) => void;
}

export default function TouchInterface({ onServiceSelect, onNavigate }: TouchInterfaceProps) {
  const [, navigate] = useLocation();
  // todo: remove mock functionality
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [currentPath, setCurrentPath] = useState('/');

  const services = [
    { title: 'מיטות שיזוף', icon: Sun, id: 'sun-beds' },
    { title: 'שיזוף בהתזה', icon: Droplets, id: 'spray-tan' },
    { title: 'מספרה', icon: Scissors, id: 'hair-salon' },
    { title: 'קוסמטיקה', icon: Palette, id: 'cosmetics' },
    { title: 'החנות שלכם', icon: Store, id: 'your-store' },
    { title: 'AI TAN', icon: 'alin' as const, id: 'ai-tan' },
  ];

  const handleServiceClick = (serviceId: string) => {
    console.log(`Service selected: ${serviceId}`);
    
    if (serviceId === 'ai-tan') {
      // Open AI TAN external link in new tab
      window.open('https://preview--radiant-booth-studio.lovable.app/', '_blank');
    } else if (serviceId === 'your-store') {
      // Navigate to shop page
      navigate('/shop');
    } else {
      onServiceSelect?.(serviceId);
    }
  };

  const handleNavigation = (path: string) => {
    setCurrentPath(path);
    onNavigate?.(path);
  };

  const handleCustomerIdentification = () => {
    // todo: remove mock functionality - simulate customer login
    setCurrentCustomer({
      name: 'דוד',
      balance: 8,
      lastVisit: '15/1/2025'
    });
  };

  return (
    <div 
      className="h-screen bg-black text-white font-hebrew relative overflow-hidden flex"
      data-testid="touch-interface"
    >
      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-[1280px] w-full px-6 py-6 flex flex-col items-center flex-1">
        {/* Top Buttons - Search and Registration */}
        <div className="flex gap-4 mb-8 w-full justify-center">
          <button
            className="
              group relative h-[48px] px-6
              bg-gradient-to-br from-pink-900/90 via-pink-800/80 to-purple-800/90
              border hover:border-2
              rounded-md backdrop-blur-sm
              flex items-center justify-center gap-2
              transition-all duration-300 ease-in-out
              hover-elevate active-elevate-2
              text-sm font-medium
            "
            style={{
              borderColor: 'rgba(236, 72, 153, 0.8)',
              boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.8)'}
            onClick={() => navigate('/customers')}
            data-testid="button-customer-management"
          >
            <Users 
              className="text-transparent bg-gradient-to-r from-pink-200 to-white bg-clip-text group-hover:from-pink-100 group-hover:to-gray-100 transition-all duration-300" 
              size={18}
              style={{
                filter: 'drop-shadow(2px 2px 4px rgba(236, 72, 153, 0.8)) drop-shadow(-1px -1px 2px rgba(255, 255, 255, 0.1))'
              }}
            />
            <span className="text-transparent bg-gradient-to-r from-pink-200 to-white bg-clip-text font-hebrew group-hover:from-pink-100 group-hover:to-gray-100 transition-all duration-300" style={{
              textShadow: '2px 2px 4px rgba(236, 72, 153, 0.8), -1px -1px 2px rgba(255, 255, 255, 0.1)'
            }}>לקוחות</span>
            
            <div className="absolute inset-0 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>

          <button
            className="
              group relative h-[48px] px-6
              bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
              border hover:border-2
              rounded-md backdrop-blur-sm
              flex items-center justify-center gap-2
              transition-all duration-300 ease-in-out
              hover-elevate active-elevate-2
              text-sm font-medium
            "
            style={{
              borderColor: 'rgba(236, 72, 153, 0.6)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.6)'}
            onClick={() => onNavigate?.('/search')}
            data-testid="button-search"
          >
            <Search 
              className="text-transparent bg-gradient-to-r from-gray-200 to-white bg-clip-text group-hover:from-gray-300 group-hover:to-gray-100 transition-all duration-300" 
              size={18}
              style={{
                filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8)) drop-shadow(-1px -1px 2px rgba(255, 255, 255, 0.1))'
              }}
            />
            <span className="text-transparent bg-gradient-to-r from-gray-200 to-white bg-clip-text font-hebrew group-hover:from-gray-300 group-hover:to-gray-100 transition-all duration-300" style={{
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(255, 255, 255, 0.1)'
            }}>חיפוש</span>
            
            <div className="absolute inset-0 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
          
          <button
            className="
              group relative h-[48px] px-6
              bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
              border hover:border-2
              rounded-md backdrop-blur-sm
              flex items-center justify-center gap-2
              transition-all duration-300 ease-in-out
              hover-elevate active-elevate-2
              text-sm font-medium
            "
            style={{
              borderColor: 'rgba(236, 72, 153, 0.6)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.6)'}
            onClick={() => onNavigate?.('/register')}
            data-testid="button-register"
          >
            <UserPlus 
              className="text-transparent bg-gradient-to-r from-gray-200 to-white bg-clip-text group-hover:from-gray-300 group-hover:to-gray-100 transition-all duration-300" 
              size={18}
              style={{
                filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8)) drop-shadow(-1px -1px 2px rgba(255, 255, 255, 0.1))'
              }}
            />
            <span className="text-transparent bg-gradient-to-r from-gray-200 to-white bg-clip-text font-hebrew group-hover:from-gray-300 group-hover:to-gray-100 transition-all duration-300" style={{
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(255, 255, 255, 0.1)'
            }}>הרשמה</span>
            
            <div className="absolute inset-0 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
        </div>

        {/* Logo */}
        <Logo className="mb-8" showGlow={true} showUnderline={true} />

        {/* Service Cards - 6 in one row */}
        <div className="flex gap-3 justify-center flex-wrap flex-1 max-w-5xl">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              icon={service.icon}
              onClick={() => handleServiceClick(service.id)}
            />
          ))}
        </div>

        {/* Self Service Button */}
        <div className="mt-auto">
        <button
          data-testid="button-ai-tan-face-recognition"
          className="
            group relative h-[80px] w-[280px]
            bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
            border-2
            rounded-md backdrop-blur-sm
            flex items-center justify-center gap-4
            transition-all duration-300 ease-in-out
            hover-elevate active-elevate-2
            px-8 text-xl font-bold
            transform perspective-1000
          "
          style={{
            borderColor: 'rgba(236, 72, 153, 0.6)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
            transform: 'rotateX(5deg) rotateY(-2deg)',
            transformStyle: 'preserve-3d'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.6)'}
          onClick={() => handleServiceClick('ai-tan')}
        >
          <div className="relative group/star">
            {/* Multiple rotating background rings */}
            <div 
              className="absolute inset-0 opacity-40 group-hover/star:opacity-70"
              style={{
                background: 'conic-gradient(from 0deg, #ff0080, #ff8000, #ffff00, #80ff00, #00ff80, #0080ff, #8000ff, #ff0080)',
                borderRadius: '50%',
                animation: 'spin 4s linear infinite',
                filter: 'blur(15px)',
                transform: 'scale(2.5)'
              }}
            />
            <div 
              className="absolute inset-0 opacity-30 group-hover/star:opacity-60"
              style={{
                background: 'conic-gradient(from 180deg, transparent, rgba(255, 0, 128, 0.8), transparent, rgba(128, 0, 255, 0.8), transparent)',
                borderRadius: '50%',
                animation: 'spin 2s linear infinite reverse',
                filter: 'blur(10px)',
                transform: 'scale(2)'
              }}
            />
            
            {/* Floating particles */}
            <div 
              className="absolute inset-0 opacity-60 group-hover/star:opacity-90"
              style={{
                background: `
                  radial-gradient(2px 2px at 20px 30px, #ff0080, transparent),
                  radial-gradient(2px 2px at 40px 70px, #00ff80, transparent),
                  radial-gradient(1px 1px at 90px 40px, #ffff00, transparent),
                  radial-gradient(1px 1px at 130px 80px, #8000ff, transparent),
                  radial-gradient(2px 2px at 160px 30px, #ff8000, transparent)
                `,
                animation: 'float 3s ease-in-out infinite',
                transform: 'scale(1.8)'
              }}
            />
            
            {/* Holographic effect */}
            <div 
              className="absolute inset-0 opacity-20 group-hover/star:opacity-40"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
                animation: 'holographic 2s ease-in-out infinite',
                borderRadius: '50%',
                transform: 'scale(1.5)'
              }}
            />
            
            {/* Main star with enhanced effects */}
            <Star 
              className="relative z-10 text-transparent animate-pulse group-hover/star:animate-bounce" 
              size={40}
              style={{
                background: 'linear-gradient(45deg, #ffff00, #ff8000, #ff0080, #8000ff, #0080ff, #00ff80, #ffff00)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                filter: `
                  drop-shadow(0 0 30px rgba(255, 255, 0, 1))
                  drop-shadow(0 0 60px rgba(255, 0, 128, 0.8))
                  drop-shadow(0 0 90px rgba(128, 0, 255, 0.6))
                  drop-shadow(3px 3px 8px rgba(0, 0, 0, 0.9))
                `,
                transform: 'rotateX(20deg) rotateY(-10deg) rotateZ(0deg)',
                transformStyle: 'preserve-3d',
                animation: 'rainbow 3s ease-in-out infinite, rotate3d 6s linear infinite'
              }}
            />
            
            {/* Energy burst effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover/star:opacity-100 transition-opacity duration-500"
              style={{
                background: `
                  conic-gradient(from 0deg, transparent, rgba(255, 255, 0, 0.8), transparent, rgba(255, 0, 128, 0.8), transparent),
                  radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)
                `,
                borderRadius: '50%',
                animation: 'energyBurst 0.8s ease-out infinite',
                transform: 'scale(3)',
                filter: 'blur(5px)'
              }}
            />
            
            {/* Sparkle effects */}
            <div 
              className="absolute inset-0 opacity-50 group-hover/star:opacity-80"
              style={{
                background: `
                  radial-gradient(1px 1px at 15px 25px, white, transparent),
                  radial-gradient(1px 1px at 35px 65px, white, transparent),
                  radial-gradient(1px 1px at 85px 35px, white, transparent),
                  radial-gradient(1px 1px at 125px 75px, white, transparent)
                `,
                animation: 'sparkle 1.5s ease-in-out infinite',
                transform: 'scale(2)'
              }}
            />
          </div>
          <span className="text-white font-hebrew drop-shadow-lg">שירות עצמי 24/7</span>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* 3D highlight */}
          <div className="absolute inset-0 rounded-md border border-white/10 pointer-events-none" />
        </button>
        </div>
      </div>

      {/* Corner Icons */}
      <div className="fixed top-4 right-4 z-50 flex gap-3">
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
          data-testid="button-home"
        >
          <Home 
            className="text-white group-hover:text-pink-400 transition-colors duration-300" 
            size={20}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
            }}
          />
        </button>
        
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
          onClick={() => handleNavigation('/settings')}
          data-testid="button-settings"
        >
          <Settings 
            className="text-white group-hover:text-pink-400 transition-colors duration-300" 
            size={20}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
            }}
          />
        </button>
      </div>
    </div>
  );
}