interface LogoProps {
  className?: string;
  showGlow?: boolean;
  showUnderline?: boolean;
  size?: 'small' | 'medium' | 'large' | 'header';
}

import logoImage from '@assets/747d9dd7-e351-4ae7-804f-3dc6fc6b94b0_1759166689888.png';

const SIZE_CLASSES = {
  small: 'h-8',
  medium: 'h-12',
  header: 'h-16',
  large: 'h-24 md:h-32 lg:h-40',
};

export default function Logo({ className = "", showGlow = true, showUnderline = true, size = 'large' }: LogoProps) {
  const heightClass = SIZE_CLASSES[size];
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${showGlow ? 'animate-glow-pulse' : ''}`}>
        <img 
          src={logoImage}
          alt="Tan&Co. 24|7"
          className={`${heightClass} object-contain`}
          style={{
            filter: showGlow 
              ? 'brightness(1.3) contrast(1.2) saturate(1.5) drop-shadow(0 0 40px rgba(236, 72, 153, 0.9)) drop-shadow(0 0 80px rgba(147, 51, 234, 0.6)) drop-shadow(0 0 20px rgba(255, 105, 180, 1))' 
              : 'brightness(1.3) contrast(1.2) saturate(1.5)'
          }}
          data-testid="logo-image"
        />
      </div>
      {showUnderline && (
        <div 
          className="w-64 md:w-80 h-0.5 mt-2 rounded-full opacity-60"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.5), transparent)',
            boxShadow: '0 0 10px rgba(236, 72, 153, 0.4), 0 0 20px rgba(147, 51, 234, 0.3)'
          }}
          data-testid="logo-underline"
        />
      )}
    </div>
  );
}