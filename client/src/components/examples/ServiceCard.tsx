import { Sun, Droplets, CreditCard } from 'lucide-react';
import ServiceCard from '../ServiceCard';

export default function ServiceCardExample() {
  const handleClick = (title: string) => {
    console.log(`${title} clicked in example`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center p-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <ServiceCard 
          title="מיטות שיזוף UV"
          icon={Sun}
          onClick={() => handleClick('UV Beds')}
        />
        <ServiceCard 
          title="שיזוף בהתזה"
          icon={Droplets}
          onClick={() => handleClick('Spray Tan')}
        />
        <ServiceCard 
          title="רכישת כרטיסיה"
          icon={CreditCard}
          onClick={() => handleClick('Buy Package')}
          disabled={true}
        />
      </div>
    </div>
  );
}