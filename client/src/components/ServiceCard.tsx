import { ReactNode } from 'react';

interface ServiceCardProps {
  title: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  borderColor?: 'pink' | 'blue';
}

export default function ServiceCard({ title, icon, onClick, disabled = false, className = "", borderColor = 'pink' }: ServiceCardProps) {
  const borderColors = {
    pink: {
      default: 'rgba(236, 72, 153, 0.6)',
      hover: 'rgba(236, 72, 153, 1)',
      shadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    },
    blue: {
      default: 'rgba(59, 130, 246, 0.6)',
      hover: 'rgba(59, 130, 246, 1)',
      shadow: '0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.4), 0 0 90px rgba(59, 130, 246, 0.3)'
    }
  };

  const colors = borderColors[borderColor];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative h-[140px] w-[130px] sm:h-[150px] sm:w-[140px] md:h-[160px] md:w-[150px]
        bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
        border hover:border-2
        rounded-md backdrop-blur-sm
        flex flex-col items-center justify-between pb-4
        transition-all duration-150 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        hover-elevate active-elevate-2
        ${className}
      `}
      style={{
        borderColor: colors.default,
        boxShadow: colors.shadow
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.hover}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.default}
      data-testid={`service-card-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="flex-1 flex items-center justify-center transition-all duration-150 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(236,72,153,0.9)]">
        {icon}
      </div>
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