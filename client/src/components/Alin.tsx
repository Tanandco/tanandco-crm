
interface AlinProps {
  className?: string;
  size?: number;
}

export default function Alin({ className = "", size = 20 }: AlinProps) {
  // If className contains width/height (including max), use it; otherwise use size prop
  const hasCustomSize = className.includes('w-[') || className.includes('h-[') || className.includes('max-w-[') || className.includes('max-h-[');
  
  return (
    <div className={`relative inline-block ${hasCustomSize ? className : ''}`} data-testid="alin-chatbot">
      <img 
        src={alinGif}
        alt="אלין הצ'טבוט"
        className={`object-contain ${hasCustomSize ? className : ''}`}
        style={{
          ...(!hasCustomSize && { width: `${size}px`, height: `${size}px` })
        }}
      />
    </div>
  );
}
