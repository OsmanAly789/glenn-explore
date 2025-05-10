import React, { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';

interface FrameLimiterProps {
  fps?: number;
}

// Efficient frame limiter component from R3F maintainer
const FrameLimiter: React.FC<FrameLimiterProps> = ({ fps = 60 }) => {
  const { advance, set, frameloop: initFrameloop } = useThree();
  
  useLayoutEffect(() => {
    let elapsed = 0;
    let then = 0;
    let raf: number | null = null;
    const interval = 1000 / fps;

    function tick(t: number) {
      raf = requestAnimationFrame(tick);
      elapsed = t - then;
      if (elapsed > interval) {
        advance(0); // Fix: Add 0 as argument
        then = t - (elapsed % interval);
      }
    }

    // Set frameloop to never, it will shut down the default render loop
    set({ frameloop: 'never' });
    // Kick off custom render loop
    raf = requestAnimationFrame(tick);

    // Restore initial setting on cleanup
    return () => {
      if (raf) cancelAnimationFrame(raf);
      set({ frameloop: initFrameloop });
    };
  }, [fps, advance, set, initFrameloop]);

  return null;
};

export default FrameLimiter; 