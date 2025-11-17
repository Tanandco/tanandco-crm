
interface SolProps {
  className?: string;
  size?: number;
}

export default function Sol({ className = "", size = 20 }: SolProps) {
  // If className contains width/height (including max), use it; otherwise use size prop
  const hasCustomSize = className.includes('w-[') || className.includes('h-[') || className.includes('max-w-[') || className.includes('max-h-[');
  
  return (
    <div className={`relative inline-block ${hasCustomSize ? className : ''}`} data-testid="sol-chatbot">
      <img 
        src={blueAlinGif}
        alt="סול הצ'טבוט"
        className={`object-contain ${hasCustomSize ? className : ''}`}
        style={{
          filter: 'drop-shadow(0 0 20px rgb(59, 130, 246)) contrast(1.15) brightness(1.05)',
          ...(!hasCustomSize && { width: `${size}px`, height: `${size}px` })
        }}
      />
    </div>
  );
}
