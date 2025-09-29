import { useState } from 'react';
import { Home, Palette, Scissors, Store, Sun, Droplets, Star, Search, UserPlus, Sparkles, Settings } from 'lucide-react';
import Logo from './Logo';
import ServiceCard from './ServiceCard';
import StatusDisplay from './StatusDisplay';
import { Button } from '@/components/ui/button';

interface TouchInterfaceProps {
  onServiceSelect?: (service: string) => void;
  onNavigate?: (path: string) => void;
}

export default function TouchInterface({ onServiceSelect, onNavigate }: TouchInterfaceProps) {
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
    onServiceSelect?.(serviceId);
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
      <div className="relative z-10 px-6 py-4 flex flex-col items-center justify-center flex-1">
        {/* Top Buttons - Search and Registration */}
        <div className="flex gap-3 mb-4 w-full justify-center">
          <button
            className="
              group relative h-[60px] w-[120px]
              bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
              border-2 border-gray-500 hover:border-gray-400
              rounded-md backdrop-blur-sm
              flex items-center justify-center gap-2
              transition-all duration-300 ease-in-out
              hover:scale-105 active:scale-95
              hover-elevate active-elevate-2
              px-4 text-sm font-medium
            "
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
            }}
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
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
          
          <button
            className="
              group relative h-[60px] w-[120px]
              bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
              border-2 border-gray-500 hover:border-gray-400
              rounded-md backdrop-blur-sm
              flex items-center justify-center gap-2
              transition-all duration-300 ease-in-out
              hover:scale-105 active:scale-95
              hover-elevate active-elevate-2
              px-4 text-sm font-medium
            "
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
            }}
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
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
        </div>

        {/* Logo */}
        <Logo className="mb-6" showGlow={true} showUnderline={true} />

        {/* Service Cards - 6 in one row */}
        <div className="flex gap-3 mb-6 justify-center flex-wrap">
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
        <button
          className="
            group relative h-[80px] w-[280px]
            bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
            border-2 border-primary/60 hover:border-primary
            rounded-md backdrop-blur-sm
            flex items-center justify-center gap-4
            transition-all duration-300 ease-in-out
            hover:scale-105 active:scale-95
            hover-elevate active-elevate-2
            px-8 text-xl font-bold
            transform perspective-1000
          "
          style={{
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
            transform: 'rotateX(5deg) rotateY(-2deg)',
            transformStyle: 'preserve-3d'
          }}
          onClick={() => handleServiceClick('self-service')}
          data-testid="button-self-service"
        >
          <Star 
            className="text-pink-400 group-hover:text-pink-300 transition-colors duration-300" 
            size={32}
            style={{
              filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))'
            }}
          />
          <span className="text-white font-hebrew drop-shadow-lg">שירות עצמי 24/7</span>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* 3D highlight */}
          <div className="absolute inset-0 rounded-md border border-white/10 pointer-events-none" />
        </button>
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
            className="text-white group-hover:text-primary transition-colors duration-300" 
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
            className="text-white group-hover:text-primary transition-colors duration-300" 
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