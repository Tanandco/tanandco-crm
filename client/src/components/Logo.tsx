interface LogoProps {
  className?: string;
  showGlow?: boolean;
  showUnderline?: boolean;
}

export default function Logo({ className = "", showGlow = true, showUnderline = true }: LogoProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${showGlow ? 'animate-glow-pulse' : ''}`}>
        <div className="flex items-center gap-2">
          <h1 
            className="text-6xl md:text-8xl font-bold text-white font-hebrew"
            style={{
              filter: showGlow ? 'drop-shadow(0 0 40px rgba(236, 72, 153, 0.9)) drop-shadow(0 0 80px rgba(147, 51, 234, 0.6))' : 'none'
            }}
            data-testid="logo-text"
          >
            Tan&Co.
          </h1>
          <div 
            className="bg-white text-black px-3 py-2 rounded font-bold text-2xl md:text-4xl"
            style={{
              filter: showGlow ? 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' : 'none'
            }}
            data-testid="logo-24-7"
          >
            24|7
          </div>
        </div>
      </div>
      {showUnderline && (
        <div 
          className="w-72 h-1 mt-4 rounded-full opacity-90"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(236, 72, 153, 0.9), rgba(147, 51, 234, 0.7), transparent)'
          }}
          data-testid="logo-underline"
        />
      )}
    </div>
  );
}