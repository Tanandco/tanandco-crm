import { useState } from 'react';
import { useLocation } from 'wouter';
import { Home, Star, Search, Sparkles, Settings, Users, Package } from 'lucide-react';
import Logo from './Logo';
import ServiceCard from './ServiceCard';
import StatusDisplay from './StatusDisplay';
import SunBedsDialog from './SunBedsDialog';
import SprayTanDialog from './SprayTanDialog';
import HairSalonDialog from './HairSalonDialog';
import CosmeticsDialog from './CosmeticsDialog';
import Alin from './Alin';
import tanningBedIcon from '@assets/עיצוב ללא שם (30)_1759413689481.png';
import sprayTanIcon from '@assets/freepik__spray-tan-variation-b-modern-flatbadge-3d-spray-gu__47717_1759413070782.png';
import hairSalonIcon from '@assets/freepik__3d-neon-pink-icon-of-a-hair-salon-symbol-stylized-__47719_1759413079154.png';
import cosmeticsIcon from '@assets/עיצוב ללא שם (31)_1759413948155.png';
import storeIcon from '@assets/freepik__online-store-shopping-bag-variation-a-3d-shopping-__47713_1759413103497.png';
import selfServiceIcon from '@assets/עיצוב ללא שם (32)_1759414540774.png';
import newCustomerIcon from '@assets/Dהורדותfreepik__spray-tan-variation-b-modern-flatbadge-3d-spray-gu__47717.png_1759805942437.png';

interface TouchInterfaceProps {
  onServiceSelect?: (service: string) => void;
  onNavigate?: (path: string) => void;
}

export default function TouchInterface({ onServiceSelect, onNavigate }: TouchInterfaceProps) {
  const [, navigate] = useLocation();
  // todo: remove mock functionality
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [currentPath, setCurrentPath] = useState('/');
  const [sunBedsDialogOpen, setSunBedsDialogOpen] = useState(false);
  const [sprayTanDialogOpen, setSprayTanDialogOpen] = useState(false);
  const [hairSalonDialogOpen, setHairSalonDialogOpen] = useState(false);
  const [cosmeticsDialogOpen, setCosmeticsDialogOpen] = useState(false);

  const services = [
    { 
      title: 'מיטות שיזוף', 
      icon: <img src={tanningBedIcon} alt="מיטות שיזוף" className="w-24 h-24 object-contain" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'sun-beds' 
    },
    { 
      title: 'שיזוף בהתזה', 
      icon: <img src={sprayTanIcon} alt="שיזוף בהתזה" className="w-24 h-24 object-contain" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'spray-tan' 
    },
    { 
      title: 'מספרה', 
      icon: <img src={hairSalonIcon} alt="מספרה" className="w-28 h-28 object-contain" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'hair-salon' 
    },
    { 
      title: 'קוסמטיקה', 
      icon: <img src={cosmeticsIcon} alt="קוסמטיקה" className="w-28 h-28 object-contain" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'cosmetics' 
    },
    { 
      title: 'החנות שלכם', 
      icon: <img src={storeIcon} alt="החנות שלכם" className="w-24 h-24 object-contain" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'your-store' 
    },
    { 
      title: 'AI TAN', 
      icon: <div className="-mt-12 -mb-10"><Alin size={204} /></div>, 
      id: 'ai-tan' 
    },
  ];

  const handleServiceClick = (serviceId: string) => {
    if (serviceId === 'ai-tan') {
      // Navigate to AI TAN internal page
      navigate('/ai-tan');
    } else if (serviceId === 'your-store') {
      // Navigate to shop page
      navigate('/shop');
    } else if (serviceId === 'sun-beds') {
      // Open sun beds dialog
      setSunBedsDialogOpen(true);
    } else if (serviceId === 'spray-tan') {
      // Open spray tan dialog
      setSprayTanDialogOpen(true);
    } else if (serviceId === 'hair-salon') {
      // Open hair salon dialog
      setHairSalonDialogOpen(true);
    } else if (serviceId === 'cosmetics') {
      // Open cosmetics dialog
      setCosmeticsDialogOpen(true);
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
        {/* Top Buttons - Management */}
        <div className="flex gap-4 mb-4 w-full justify-center">
          <button
            className="
              group relative h-[48px] px-6
              bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
              border hover:border-2
              rounded-md backdrop-blur-sm
              flex items-center justify-center gap-2
              transition-all duration-300 ease-in-out
              hover-elevate active-elevate-2
            "
            style={{
              borderColor: 'rgba(236, 72, 153, 0.6)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.6)'}
            onClick={() => navigate('/customers')}
            data-testid="button-customer-management"
          >
            <Users 
              className="text-pink-400 group-hover:text-pink-300 transition-colors duration-300"
              size={20}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))'
              }}
            />
            <span className="text-white font-hebrew">לקוחות</span>
            
            <div className="absolute inset-0 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
            "
            style={{
              borderColor: 'rgba(236, 72, 153, 0.6)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.6)'}
            onClick={() => onNavigate?.('/search')}
            data-testid="button-search"
          >
            <Search 
              className="text-pink-400 group-hover:text-pink-300 transition-colors duration-300"
              size={20}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))'
              }}
            />
            <span className="text-white font-hebrew">חיפוש</span>
            
            <div className="absolute inset-0 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
            "
            style={{
              borderColor: 'rgba(236, 72, 153, 0.6)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.6)'}
            onClick={() => onNavigate?.('/register')}
            data-testid="button-register"
          >
            <img 
              src={newCustomerIcon} 
              alt="לקוח חדש" 
              className="w-5 h-5 object-contain transition-all duration-300"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))'
              }}
            />
            <span className="text-white font-hebrew">הרשמה</span>
            
            <div className="absolute inset-0 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
        </div>


        {/* Logo */}
        <Logo className="mb-8" showGlow={true} showUnderline={true} />

        {/* Service Cards - 6 in one row */}
        <div className="flex gap-3 justify-center flex-wrap max-w-5xl">
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
        <div className="mt-24">
        <button
          data-testid="button-ai-tan-face-recognition"
          className="
            group relative h-[80px] w-[280px]
            bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
            border-2
            rounded-md backdrop-blur-sm
            flex items-center justify-between gap-2
            transition-all duration-150 ease-in-out
            hover-elevate active-elevate-2
            pr-3 pl-6 text-xl font-bold
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
          onClick={() => navigate('/self-service')}
        >
          <img 
            src={selfServiceIcon} 
            alt="שירות עצמי" 
            className="w-28 h-28 object-contain transition-all duration-150 group-hover:scale-110 group-hover:drop-shadow-[0_0_30px_rgba(236,72,153,1)]"
            style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }}
          />
          <div className="flex items-center">
            <span className="text-sm font-medium text-white text-center font-hebrew">שירות עצמי 24/7</span>
          </div>
          
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

      {/* Sun Beds Dialog */}
      <SunBedsDialog 
        open={sunBedsDialogOpen} 
        onOpenChange={setSunBedsDialogOpen}
      />

      {/* Spray Tan Dialog */}
      <SprayTanDialog 
        open={sprayTanDialogOpen} 
        onOpenChange={setSprayTanDialogOpen}
      />

      {/* Hair Salon Dialog */}
      <HairSalonDialog 
        open={hairSalonDialogOpen} 
        onOpenChange={setHairSalonDialogOpen}
      />

      {/* Cosmetics Dialog */}
      <CosmeticsDialog 
        open={cosmeticsDialogOpen} 
        onOpenChange={setCosmeticsDialogOpen}
      />
    </div>
  );
}