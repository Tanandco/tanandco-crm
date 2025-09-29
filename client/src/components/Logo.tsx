interface LogoProps {
  className?: string;
  showGlow?: boolean;
  showUnderline?: boolean;
}

import logoImage from '@assets/747d9dd7-e351-4ae7-804f-3dc6fc6b94b0_1759166689888.png';

export default function Logo({ className = "", showGlow = true, showUnderline = true }: LogoProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${showGlow ? 'animate-glow-pulse' : ''}`}>
        <img 
          src={logoImage}
          alt="Tan&Co. 24|7"
          className="h-24 md:h-32 lg:h-40 object-contain"
          style={{
            filter: showGlow ? 'drop-shadow(0 0 40px rgba(236, 72, 153, 0.9)) drop-shadow(0 0 80px rgba(147, 51, 234, 0.6))' : 'none'
          }}
          data-testid="logo-image"
        />
      </div>
      {showUnderline && (
        <div 
          className="w-64 md:w-80 h-1 mt-4 rounded-full opacity-90"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(236, 72, 153, 0.9), rgba(147, 51, 234, 0.7), transparent)'
          }}
          data-testid="logo-underline"
        />
      )}
    </div>
  );
}