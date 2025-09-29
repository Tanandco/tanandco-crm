import { useState } from 'react';
import { Bot, Home, Palette, Scissors, Hand, MapPin, Star, Search, UserPlus } from 'lucide-react';
import Logo from './Logo';
import ServiceCard from './ServiceCard';
import StatusDisplay from './StatusDisplay';
import NavigationBar from './NavigationBar';
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
    { title: 'AI TAN', icon: Bot, id: 'ai-tan' },
    { title: 'בתים', icon: Home, id: 'home' },
    { title: 'קוסמטיקה', icon: Palette, id: 'cosmetics' },
    { title: 'מספרה', icon: Scissors, id: 'hair-salon' },
    { title: 'טיפולי גוף', icon: Hand, id: 'body-treatments' },
    { title: 'כלונות אלקטרו', icon: MapPin, id: 'electro-devices' },
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
      className="min-h-screen bg-black text-white font-hebrew relative overflow-hidden"
      data-testid="touch-interface"
    >
      {/* Main Content */}
      <div className="relative z-10 px-6 py-8 flex flex-col items-center">
        {/* Top Buttons - Search and Registration */}
        <div className="flex gap-4 mb-12 w-full justify-center">
          <Button 
            variant="outline"
            className="bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white px-8 py-6 text-lg"
            onClick={() => onNavigate?.('/search')}
            data-testid="button-search"
          >
            <Search className="ml-2" />
            חיפוש
          </Button>
          <Button 
            variant="outline"
            className="bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white px-8 py-6 text-lg"
            onClick={() => onNavigate?.('/register')}
            data-testid="button-register"
          >
            <UserPlus className="ml-2" />
            הרשמה
          </Button>
        </div>

        {/* Logo */}
        <Logo className="mb-16" showGlow={true} showUnderline={true} />

        {/* Service Cards - 6 in one row */}
        <div className="flex gap-6 mb-16 justify-center flex-wrap">
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
        <Button 
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-12 py-8 text-xl font-bold rounded-lg shadow-2xl border border-blue-400/30 relative overflow-hidden group"
          onClick={() => handleServiceClick('self-service')}
          data-testid="button-self-service"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-3">
            <Star className="w-8 h-8 text-cyan-300" />
            <span className="font-hebrew">שירות עצמי 24/7</span>
          </div>
        </Button>
      </div>

      {/* Navigation */}
      <NavigationBar 
        currentPath={currentPath}
        onNavigate={handleNavigation}
      />
    </div>
  );
}