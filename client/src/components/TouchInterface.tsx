import { useState } from 'react';
import { useLocation } from 'wouter';
import { Home, Star, Search, Sparkles, Settings, Users, Package, Smartphone, Fingerprint, Hand, Menu, DoorOpen, ShoppingCart, MessageCircle, BarChart3, UserPlus } from 'lucide-react';
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
import newCustomerIcon from '@assets/עיצוב ללא שם (4)_1760090011932.png';
import { SelfServiceButton3D } from './SelfServiceButton3D';

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
  const [menuOpen, setMenuOpen] = useState(false);

  const services = [
    { 
      title: 'מיטות שיזוף', 
      icon: <img src={tanningBedIcon} alt="מיטות שיזוף" className="max-w-[70px] max-h-[70px] md:max-w-[115px] md:max-h-[115px] object-contain" style={{ filter: 'drop-shadow(0 0 15px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'sun-beds' 
    },
    { 
      title: 'שיזוף בהתזה', 
      icon: <img src={sprayTanIcon} alt="שיזוף בהתזה" className="max-w-[70px] max-h-[70px] md:max-w-[115px] md:max-h-[115px] object-contain" style={{ filter: 'drop-shadow(0 0 15px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'spray-tan' 
    },
    { 
      title: 'מספרה', 
      icon: <img src={hairSalonIcon} alt="מספרה" className="max-w-[70px] max-h-[70px] md:max-w-[115px] md:max-h-[115px] object-contain" style={{ filter: 'drop-shadow(0 0 15px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'hair-salon' 
    },
    { 
      title: 'קוסמטיקה', 
      icon: <img src={cosmeticsIcon} alt="קוסמטיקה" className="max-w-[70px] max-h-[70px] md:max-w-[115px] md:max-h-[115px] object-contain" style={{ filter: 'drop-shadow(0 0 15px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'cosmetics' 
    },
    { 
      title: 'החנות שלכם', 
      icon: <img src={storeIcon} alt="החנות שלכם" className="max-w-[70px] max-h-[70px] md:max-w-[115px] md:max-h-[115px] object-contain" style={{ filter: 'drop-shadow(0 0 15px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'your-store' 
    },
    { 
      title: 'AI TAN', 
      icon: <Alin size={95} className="max-w-[95px] max-h-[95px] md:max-w-[125px] md:max-h-[125px]" />, 
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
      className="h-screen bg-black text-white font-hebrew relative overflow-hidden flex pt-12"
      data-testid="touch-interface"
    >
      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-[1280px] w-full px-2 md:px-6 py-0 md:py-0.5 flex flex-col items-center flex-1 overflow-y-auto">

        {/* Action Buttons - Above Logo */}
        <div className="transform -translate-y-4 md:translate-y-0">
          <div className="flex gap-2 md:gap-3 mt-3 md:mt-8 mb-0 justify-center">
          <button
            className="
              group relative w-9 h-9 md:w-10 md:h-10
              bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
              border
              rounded-md backdrop-blur-sm
              flex items-center justify-center
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
                filter: 'drop-shadow(0 0 12px rgba(236, 72, 153, 0.8))'
              }}
            />
          </button>

          <button
            className="
              group relative w-9 h-9 md:w-10 md:h-10
              bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
              border
              rounded-md backdrop-blur-sm
              flex items-center justify-center
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
                filter: 'drop-shadow(0 0 12px rgba(236, 72, 153, 0.8))'
              }}
            />
          </button>
          
          <button
            className="
              group relative w-9 h-9 md:w-10 md:h-10
              bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
              border
              rounded-md backdrop-blur-sm
              flex items-center justify-center
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
                filter: 'drop-shadow(0 0 12px rgba(236, 72, 153, 0.8))'
              }}
            />
          </button>
        </div>
        </div>

        {/* Logo */}
        <div className="transform -translate-y-12 md:-translate-y-4 -mb-10 md:-mb-2">
          <Logo className="scale-[0.6] md:scale-90" showGlow={true} showUnderline={true} />
        </div>

        {/* Service Cards - 3 in mobile (2 rows), 6 in desktop */}
        <div className="grid grid-cols-3 md:flex gap-1.5 md:gap-3 justify-center md:flex-wrap max-w-5xl w-full md:w-auto">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              icon={service.icon}
              onClick={() => handleServiceClick(service.id)}
              borderColor="pink"
            />
          ))}
        </div>

        {/* Self Service Button */}
        <SelfServiceButton3D onClick={() => navigate('/self-service')} />
        
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
              filter: drop-shadow(0 0 15px rgba(236, 72, 153, 0.6));
            }
            50% { 
              opacity: 1;
              filter: drop-shadow(0 0 25px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 40px rgba(236, 72, 153, 0.5));
            }
          }
        `}</style>
      </div>

      {/* Hamburger Menu Overlay */}
      {menuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
            data-testid="menu-overlay"
          />
          <div 
            className="fixed left-0 top-0 h-screen w-64 backdrop-blur-lg border-r z-50 flex flex-col py-6 gap-3"
            style={{
              background: 'linear-gradient(to bottom right, rgba(17, 24, 39, 0.95), rgba(0, 0, 0, 0.90), rgba(31, 41, 55, 0.95))',
              borderColor: 'rgba(59, 130, 246, 0.4)',
              boxShadow: `
                0 0 30px rgba(59, 130, 246, 0.6),
                0 0 60px rgba(59, 130, 246, 0.4),
                inset 0 1px 2px rgba(59, 130, 246, 0.1)
              `
            }}
          >
            <button
              onClick={() => {
                navigate('/');
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-6 py-3 hover-elevate active-elevate-2 transition-all"
              data-testid="menu-home"
            >
              <Home className="w-4 h-4 text-blue-400" />
              <span className="text-white font-hebrew">בית</span>
            </button>

            <button
              onClick={() => {
                navigate('/pos');
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-6 py-3 hover-elevate active-elevate-2 transition-all"
              data-testid="menu-pos"
            >
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              <span className="text-white font-hebrew">קופה</span>
            </button>

            <button
              onClick={() => {
                navigate('/face-registration');
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-6 py-3 hover-elevate active-elevate-2 transition-all"
              data-testid="menu-registration"
            >
              <UserPlus className="w-4 h-4 text-pink-400" />
              <span className="text-white font-hebrew">הרשמה</span>
            </button>

            <button
              onClick={() => {
                navigate('/chat');
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-6 py-3 hover-elevate active-elevate-2 transition-all"
              data-testid="menu-whatsapp"
            >
              <MessageCircle className="w-4 h-4 text-green-400" />
              <span className="text-white font-hebrew">WhatsApp</span>
            </button>

            <button
              onClick={() => {
                navigate('/remote-door');
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-6 py-3 hover-elevate active-elevate-2 transition-all"
              data-testid="menu-door"
            >
              <DoorOpen className="w-4 h-4 text-blue-400" />
              <span className="text-white font-hebrew">פתיחת דלת</span>
            </button>

            <button
              onClick={() => {
                navigate('/automation-dashboard');
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-6 py-3 hover-elevate active-elevate-2 transition-all"
              data-testid="menu-automation"
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className="text-white font-hebrew">אוטומציה</span>
            </button>

            <button
              onClick={() => {
                navigate('/biostar-test');
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-6 py-3 hover-elevate active-elevate-2 transition-all"
              data-testid="menu-biostar"
            >
              <Fingerprint className="w-4 h-4 text-pink-400" />
              <span className="text-white font-hebrew">BioStar</span>
            </button>

            <button
              onClick={() => {
                navigate('/products');
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-6 py-3 hover-elevate active-elevate-2 transition-all"
              data-testid="menu-settings"
            >
              <Settings className="w-4 h-4 text-blue-400" />
              <span className="text-white font-hebrew">הגדרות</span>
            </button>
          </div>
        </>
      )}

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