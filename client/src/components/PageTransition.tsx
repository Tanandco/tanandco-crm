import { useEffect, useState } from 'react';
import transitionVideo from '@assets/עיצוב ללא שם_1759880609921.mp4';

interface PageTransitionProps {
  isTransitioning: boolean;
  onTransitionEnd?: () => void;
}

export default function PageTransition({ isTransitioning, onTransitionEnd }: PageTransitionProps) {
  const [show, setShow] = useState(false);

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
        src={transitionVideo}
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
