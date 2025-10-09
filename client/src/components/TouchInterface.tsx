import { useState } from 'react';
import { useLocation } from 'wouter';
import { Home, Star, Search, Sparkles, Settings, Users, Package, Smartphone, Fingerprint, Hand } from 'lucide-react';
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
import selfServiceButtonIcon from '@assets/ללא שם (300 x 300 פיקסל)_1759994496500.gif';

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
      icon: <img src={tanningBedIcon} alt="מיטות שיזוף" className="w-28 md:w-48 h-28 md:h-48 object-contain -mt-2 md:-mt-6" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'sun-beds' 
    },
    { 
      title: 'שיזוף בהתזה', 
      icon: <img src={sprayTanIcon} alt="שיזוף בהתזה" className="w-20 md:w-32 h-20 md:h-32 object-contain" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'spray-tan' 
    },
    { 
      title: 'מספרה', 
      icon: <img src={hairSalonIcon} alt="מספרה" className="w-24 md:w-40 h-24 md:h-40 object-contain" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'hair-salon' 
    },
    { 
      title: 'קוסמטיקה', 
      icon: <img src={cosmeticsIcon} alt="קוסמטיקה" className="w-24 md:w-40 h-24 md:h-40 object-contain mt-2 md:mt-4" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'cosmetics' 
    },
    { 
      title: 'החנות שלכם', 
      icon: <img src={storeIcon} alt="החנות שלכם" className="w-20 md:w-32 h-20 md:h-32 object-contain" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'your-store' 
    },
    { 
      title: 'AI TAN', 
      icon: <div className="-mt-6 md:-mt-14 -mb-6 md:-mb-12 scale-100 md:scale-150"><Alin size={140} className="md:w-[204px] md:h-[204px]" /></div>, 
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
      <div className="relative z-10 mx-auto max-w-[1280px] w-full px-3 md:px-6 py-3 md:py-6 flex flex-col items-center flex-1">
        {/* Top Buttons - Management */}
        <div className="flex gap-2 md:gap-4 mb-3 md:mb-4 w-full justify-center flex-wrap">
          <button
            className="
              group relative h-10 md:h-12 px-3 md:px-6
              bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
              border hover:border-2
              rounded-md backdrop-blur-sm
              flex items-center justify-center gap-1 md:gap-2
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
              size={16}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))'
              }}
            />
            <span className="text-white font-hebrew text-sm md:text-base">לקוחות</span>
            
            <div className="absolute inset-0 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>

          <button
            className="
              group relative h-10 md:h-12 px-3 md:px-6
              bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
              border hover:border-2
              rounded-md backdrop-blur-sm
              flex items-center justify-center gap-1 md:gap-2
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
              size={16}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))'
              }}
            />
            <span className="text-white font-hebrew text-sm md:text-base">חיפוש</span>
            
            <div className="absolute inset-0 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
          
          <button
            className="
              group relative h-10 md:h-12 px-3 md:px-6
              bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
              border hover:border-2
              rounded-md backdrop-blur-sm
              flex items-center justify-center gap-1 md:gap-2
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
              className="w-4 h-4 md:w-5 md:h-5 object-contain transition-all duration-300"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))'
              }}
            />
            <span className="text-white font-hebrew text-sm md:text-base">הרשמה</span>
            
            <div className="absolute inset-0 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
        </div>


        {/* Logo */}
        <Logo className="mb-4 md:mb-8 scale-75 md:scale-100" showGlow={true} showUnderline={true} />

        {/* Service Cards - 2 in mobile, 6 in desktop */}
        <div className="grid grid-cols-2 md:flex gap-2 md:gap-3 justify-center md:flex-wrap max-w-5xl w-full md:w-auto">
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
        <div className="mt-8 md:mt-24">
        <button
          data-testid="button-ai-tan-face-recognition"
          className="
            group relative
            flex flex-col items-center justify-center
            text-xl font-bold
          "
          style={{
            filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.3))'
          }}
          onClick={() => navigate('/self-service')}
        >
          {/* Neon Touch Button Icon */}
          <div className="relative overflow-visible">
            {/* Background glow effect */}
            <div className="absolute inset-0 -m-4"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.15) 40%, transparent 70%)',
                animation: 'pulse-bg 3s ease-in-out infinite',
                filter: 'blur(12px)'
              }}
            />
            
            <img 
              src={selfServiceButtonIcon} 
              alt="Self Service" 
              className="w-16 h-16 md:w-20 md:h-20 object-contain transition-all duration-300 group-hover:scale-110 relative z-10"
              style={{
                opacity: 0.9,
                filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))',
                animation: 'shine 3s ease-in-out infinite'
              }}
            />
          </div>
          
          <div className="text-center mt-1" style={{ fontFamily: 'Varela Round, sans-serif' }}>
            <div className="text-base md:text-lg font-semibold text-white group-hover:text-blue-100 transition-colors">מעבר לשירות עצמי</div>
            <div className="text-base md:text-lg font-semibold text-white group-hover:text-blue-100 transition-colors">24/7</div>
          </div>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-md overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </button>
        </div>
        
        {/* Add floating and smooth animations */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          
          @keyframes pulse-bg {
            0%, 100% { 
              opacity: 0.7;
              transform: scale(1);
            }
            50% { 
              opacity: 1;
              transform: scale(1.15);
            }
          }
          
          @keyframes shine {
            0%, 100% { 
              opacity: 0.85;
              filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.5));
            }
            50% { 
              opacity: 1;
              filter: drop-shadow(0 0 25px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.4));
            }
          }
        `}</style>
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