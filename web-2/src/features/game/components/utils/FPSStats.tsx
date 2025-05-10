import React, { useState, useEffect, useRef } from 'react';

// Efficient FPS Counter with mouse position
const FPSStats: React.FC = () => {
  const [fps, setFps] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ lng: number, lat: number }>({ lng: 0, lat: 0 });
  const frames = useRef<number>(0);
  const lastTime = useRef<number>(performance.now());
  const rafId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const updateFPS = () => {
      frames.current++;
      const time = performance.now();
      
      if (time >= lastTime.current + 1000) {
        setFps(Math.round((frames.current * 1000) / (time - lastTime.current)));
        frames.current = 0;
        lastTime.current = time;
      }
      
      rafId.current = requestAnimationFrame(updateFPS);
    };

    rafId.current = requestAnimationFrame(updateFPS);
    
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Using mapbox viewport calculations is complex from here
      // This is a simplified approximation - we'll get actual coordinates from the map in Game.tsx
      
      // For now, just record mouse position relative to window
      // We'll replace this with actual map coordinates when passed from parent
      const x = e.clientX;
      const y = e.clientY;
      
      // Placeholder values - these will be replaced with actual map coordinates
      setMousePos({ lng: x, lat: y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Update component to accept actual coordinates from map
  React.useEffect(() => {
    // This effect will be used when we pass actual coordinates from the parent
    const updateFromMap = (event: CustomEvent) => {
      if (event.detail && event.detail.lngLat) {
        setMousePos({
          lng: event.detail.lngLat.lng,
          lat: event.detail.lngLat.lat
        });
      }
    };

    // Listen for custom events from the map
    window.addEventListener('map-mousemove' as any, updateFromMap);
    return () => {
      window.removeEventListener('map-mousemove' as any, updateFromMap);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: '200px',
      left: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: '4px 8px',
      borderRadius: 4,
      zIndex: 1000,
      color: 'white',
      fontSize: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }}>
      <div>FPS: {fps}</div>
      <div>
        Position: {mousePos.lng.toFixed(6)}, {mousePos.lat.toFixed(6)}
      </div>
    </div>
  );
};

export default FPSStats; 