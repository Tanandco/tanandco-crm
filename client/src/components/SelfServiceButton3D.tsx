interface SelfServiceButton3DProps {
  onClick: () => void;
  className?: string;
}

export const SelfServiceButton3D = ({ 
  onClick, 
  className = "" 
}: SelfServiceButton3DProps) => {
  return (
    <div className={`w-full max-w-[200px] mx-auto mt-10 md:mt-16 ${className}`}>
      <button
        onClick={onClick}
        className="relative w-full h-11 md:h-12 rounded-md bg-black/90 backdrop-blur-sm touch-target transition-all duration-200 active:scale-95 group"
        data-testid="button-self-service-3d"
      >
        {/* מסגרת גרדיאנט זורמת מסביב */}
        <div 
          className="absolute -inset-[1.5px] rounded-md"
          style={{
            background: 'linear-gradient(45deg, rgb(59, 130, 246), #ec4899, rgb(59, 130, 246), #ec4899)',
            backgroundSize: '300% 300%',
            animation: 'gradientFlow 4s ease infinite',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(236, 72, 153, 0.4)'
          }}
        />
        
        {/* רקע שחור פנימי */}
        <div className="absolute inset-0 bg-black/90 rounded-md" />

        {/* תוכן הכפתור */}
        <div className="relative h-full flex flex-col items-center justify-center px-3">
          <h2 className="text-xs md:text-sm font-bold text-white" 
              style={{ fontFamily: 'Varela Round, sans-serif' }}>
            מעבר לשירות עצמי
          </h2>
          <span className="text-[9px] md:text-[10px] text-white/60 font-bold">24/7</span>
        </div>
      </button>
    </div>
  );
};

export default SelfServiceButton3D;
