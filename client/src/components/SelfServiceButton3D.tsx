interface SelfServiceButton3DProps {
  onClick: () => void;
  className?: string;
}

export const SelfServiceButton3D = ({ 
  onClick, 
  className = "" 
}: SelfServiceButton3DProps) => {
  return (
    <div className={`w-full max-w-[180px] mx-auto mt-10 md:mt-16 ${className}`}>
      <button
        onClick={onClick}
        className="relative w-full h-10 md:h-12 rounded-md bg-black/80 backdrop-blur-sm touch-target transition-all duration-300 active:scale-95 hover:scale-105 group overflow-hidden"
        data-testid="button-self-service-3d"
        style={{
          border: '3px solid transparent',
          backgroundImage: 'linear-gradient(black, black), linear-gradient(90deg, rgb(59, 130, 246) 0%, rgb(59, 130, 246) 50%, #ec4899 50%, #ec4899 100%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box'
        }}
      >
        {/* תוכן הכפתור */}
        <div className="relative h-full flex items-center justify-center px-3">
          <h2 className="text-xs md:text-sm font-bold text-white" 
              style={{ fontFamily: 'Varela Round, sans-serif' }}>
            מעבר לשירות עצמי
          </h2>
        </div>
      </button>

      {/* הודעת מצב מתחת לכפתור */}
      <div className="mt-1 flex items-center justify-center gap-1 text-white/50 text-[8px] md:text-[10px]" style={{ fontFamily: 'Varela Round, sans-serif' }}>
        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
        <span>24/7</span>
      </div>
    </div>
  );
};

export default SelfServiceButton3D;
