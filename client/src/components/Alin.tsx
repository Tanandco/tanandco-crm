import alinImage from '@assets/עיצוב ללא שם (1)_1759411870414.gif';

interface AlinProps {
  className?: string;
  size?: number;
}

export default function Alin({ className = "", size = 20 }: AlinProps) {
  return (
    <div className={`relative inline-block ${className}`} data-testid="alin-chatbot">
      {/* White elliptical background - behind head only */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 bg-white rounded-full"
        style={{
          width: `${size * 0.5}px`,
          height: `${size * 0.5}px`,
          top: `${size * 0.15}px`,
          zIndex: 0
        }}
      />
      {/* Alin image */}
      <img 
        src={alinImage}
        alt="אלין הצ'טבוט"
        className="object-contain relative z-10"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          filter: 'drop-shadow(0 0 15px rgba(236, 72, 153, 0.8))'
        }}
      />
    </div>
  );
}