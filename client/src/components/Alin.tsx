import alinImage from '@assets/עיצוב ללא שם (1)_1759411870414.gif';

interface AlinProps {
  className?: string;
  size?: number;
}

export default function Alin({ className = "", size = 20 }: AlinProps) {
  return (
    <div className={`relative inline-block ${className}`} data-testid="alin-chatbot">
      <img 
        src={alinImage}
        alt="אלין הצ'טבוט"
        className="object-contain"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          filter: 'drop-shadow(0 0 15px rgba(236, 72, 153, 0.8))'
        }}
      />
    </div>
  );
}