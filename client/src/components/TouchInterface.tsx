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
import NewCustomerDialog from './NewCustomerDialog';
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
  const [newCustomerDialogOpen, setNewCustomerDialogOpen] = useState(false);

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
      icon: <div className="-mt-14 -mb-12"><Alin size={204} /></div>, 
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
    } else if (serviceId === 'hair-salon') {
      // Navigate to Hair Studio page
      navigate('/hair-studio');
    } else if (serviceId === 'sun-beds') {
      // Open sun beds dialog
      setSunBedsDialogOpen(true);
    } else if (serviceId === 'spray-tan') {
      // Open spray tan dialog
      setSprayTanDialogOpen(true);
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
            onClick={() => navigate('/quick-search')}
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
            onClick={() => setNewCustomerDialogOpen(true)}
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
              borderColor={service.id === 'ai-tan' ? 'blue' : 'pink'}
            />
          ))}
        </div>

        {/* Self Service Button */}
        <div className="mt-24">
        <button
          data-testid="button-ai-tan-face-recognition"
          className="
            group relative h-[120px] w-[120px]
            bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
            border-2
            rounded-md backdrop-blur-sm
            flex items-center justify-center
            transition-all duration-300 ease-in-out
            hover-elevate active-elevate-2
            text-xl font-bold
            hover:scale-105
          "
          style={{
            borderColor: 'rgba(236, 72, 153, 0.6)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5), 0 0 60px rgba(236, 72, 153, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
            transform: 'perspective(1000px) rotateX(2deg)',
            transformStyle: 'preserve-3d'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)';
            e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.6)';
            e.currentTarget.style.transform = 'perspective(1000px) rotateX(2deg)';
          }}
          onClick={() => navigate('/self-service')}
        >
          {/* Blue Neon Star with 3D Effect */}
          <div className="relative" style={{ perspective: '1000px', transformStyle: 'preserve-3d', width: '80px', height: '80px' }}>
            {/* Glowing Background - Back Layer */}
            <div 
              className="absolute rounded-full blur-3xl transition-all duration-500 group-hover:blur-2xl group-hover:scale-110"
              style={{
                width: '100px',
                height: '100px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(1.5) translateZ(-20px)',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.3) 40%, transparent 70%)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                transformStyle: 'preserve-3d'
              }}
            />
            
            {/* Shadow Layer - Middle */}
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none"
              className="absolute inset-0 z-0 opacity-40"
              style={{
                transform: 'translateZ(-10px) translateY(4px) translateX(2px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="rgba(0, 0, 0, 0.5)"
                filter="url(#glow)"
              />
            </svg>
            
            {/* Main Star - Front Layer */}
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none"
              className="relative z-10 transition-all duration-300 group-hover:scale-125"
              style={{
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                transform: 'translateZ(20px)',
                transformStyle: 'preserve-3d'
              }}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <linearGradient id="star3DGradient" x1="12" y1="2" x2="12" y2="22">
                  <stop offset="0%" stopColor="#93c5fd" />
                  <stop offset="50%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="url(#star3DGradient)"
                stroke="rgba(147, 197, 253, 1)"
                strokeWidth="1.5"
                filter="url(#glow)"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 1)) drop-shadow(0 0 60px rgba(59, 130, 246, 1)) drop-shadow(0 0 90px rgba(59, 130, 246, 0.8)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.5))'
                }}
              />
            </svg>
          </div>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-md overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* 3D Depth effect */}
          <div className="absolute inset-0 rounded-md border border-pink-400/20 pointer-events-none" style={{ transform: 'translateZ(10px)' }} />
        </button>
        </div>
        
        {/* Add floating animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
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
          onClick={() => navigate('/')}
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
          onClick={() => navigate('/products')}
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

      {/* New Customer Dialog */}
      <NewCustomerDialog 
        open={newCustomerDialogOpen} 
        onOpenChange={setNewCustomerDialogOpen}
      />
    </div>
  );
}