import { LucideIcon } from 'lucide-react';
import Alin from './Alin';

interface ServiceCardProps {
  title: string;
  icon: LucideIcon | 'alin';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export default function ServiceCard({ title, icon, onClick, disabled = false, className = "" }: ServiceCardProps) {
  return (
    <button
      onClick={() => {
        console.log(`${title} service clicked`);
        onClick();
      }}
      disabled={disabled}
      className={`
        group relative h-[140px] w-[140px] sm:h-[160px] sm:w-[160px] md:h-[180px] md:w-[180px]
        bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
        border border-primary/60 hover:border-primary 
        rounded-md backdrop-blur-sm
        flex flex-col items-center justify-center gap-2
        transition-all duration-300 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        hover-elevate active-elevate-2
        ${className}
      `}
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}
      data-testid={`service-card-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {icon === 'alin' ? (
        <Alin size={104} />
      ) : (
        (() => {
          const Icon = icon as LucideIcon;
          return (
            <Icon 
              size={48}
              className="text-pink-400 group-hover:text-pink-300 transition-colors duration-300"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))'
              }}
            />
          );
        })()
      )}
      <span className="text-base md:text-lg font-medium text-white text-center font-hebrew px-2">
        {title}
      </span>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-md overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </button>
  );
}