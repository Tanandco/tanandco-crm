import { ReactNode } from 'react';

interface ReflectBackgroundProps {
  children: ReactNode;
  className?: string;
  reflectionOpacity?: number;
  reflectionHeight?: number;
  blur?: number;
}

export default function ReflectBackground({
  children,
  className = '',
  reflectionOpacity = 0.3,
  reflectionHeight = 100,
  blur = 10,
}: ReflectBackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Reflection Effect */}
      <div 
        className="absolute inset-x-0 pointer-events-none"
        style={{
          top: '100%',
          height: `${reflectionHeight}%`,
          overflow: 'hidden',
        }}
      >
        {/* Reflected Content */}
        <div
          className="relative"
          style={{
            transform: 'scaleY(-1)',
            opacity: reflectionOpacity,
            filter: `blur(${blur}px)`,
          }}
        >
          {children}
        </div>

        {/* Gradient Fade */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(2, 6, 23, 0.7) 50%, rgba(2, 6, 23, 1) 100%)',
          }}
        />
      </div>

      {/* Glossy Surface Line */}
      <div 
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500/20 to-transparent"
        style={{
          top: '100%',
        }}
      />
    </div>
  );
}
