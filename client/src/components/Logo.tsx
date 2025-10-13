interface LogoProps {
  className?: string;
  showGlow?: boolean;
  showUnderline?: boolean;
  size?: 'small' | 'medium' | 'large' | 'header';
}

import logoImage from '@assets/747d9dd7-e351-4ae7-804f-3dc6fc6b94b0_1759166689888.png';

const SIZE_CLASSES = {
  small: 'h-12',
  medium: 'h-20',
  header: 'h-28',
  large: 'h-40 md:h-52 lg:h-64',
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
              ? 'brightness(1.3) contrast(1.2) saturate(1.5) drop-shadow(0 0 40px rgba(236, 72, 153, 0.4)) drop-shadow(0 0 80px rgba(147, 51, 234, 0.4)) drop-shadow(0 0 20px rgba(236, 72, 153, 0.5))' 
              : 'brightness(1.3) contrast(1.2) saturate(1.5)'
          }}
          data-testid="logo-image"
        />
      </div>
      {showUnderline && (
        <div 
          className="w-96 md:w-[30rem] h-0.5 -mt-4 md:-mt-3 rounded-full opacity-60"
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