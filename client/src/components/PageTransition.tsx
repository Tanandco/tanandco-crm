import { useEffect, useState } from 'react';

interface PageTransitionProps {
  isTransitioning: boolean;
  targetPath?: string;
  onTransitionEnd?: () => void;
}

export default function PageTransition({ isTransitioning, targetPath, onTransitionEnd }: PageTransitionProps) {
  const [show, setShow] = useState(false);

  // בחירת סרטון לפי יעד
  const getTransitionVideo = () => {
    if (targetPath?.includes('/shop')) {
      return shopTransitionVideo;
    }
    return defaultTransitionVideo;
  };

  useEffect(() => {
    if (isTransitioning) {
      setShow(true);
      // אורך הסרטון - בערך 2-3 שניות
      const timer = setTimeout(() => {
        setShow(false);
        onTransitionEnd?.();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, onTransitionEnd]);

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      data-testid="page-transition"
    >
      <video
        src={getTransitionVideo()}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-contain"
        onEnded={() => {
          setShow(false);
          onTransitionEnd?.();
        }}
      />
    </div>
  );
}
