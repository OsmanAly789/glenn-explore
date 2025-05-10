import { useEffect } from 'react';
import { PlacedPrimitive } from '../types/primitives';
import type { MapRef } from 'react-map-gl/mapbox';

interface UseKeyboardControlsProps {
  placedPrimitives: PlacedPrimitive[];
  setPlacedPrimitives: React.Dispatch<React.SetStateAction<PlacedPrimitive[]>>;
  selectedPrimitiveId: string | null;
  setSelectedPrimitiveId: React.Dispatch<React.SetStateAction<string | null>>;
  gridSize: number;
  setInventoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const useKeyboardControls = ({
  placedPrimitives,
  setPlacedPrimitives,
  selectedPrimitiveId,
  setSelectedPrimitiveId,
  gridSize,
  setInventoryOpen,
}: UseKeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'i' || event.key === 'I') {
        setInventoryOpen(prev => !prev);
      }

      if (!selectedPrimitiveId) return;

      const selectedPrimitive = placedPrimitives.find(p => p.id === selectedPrimitiveId);
      if (!selectedPrimitive) return;

      const [x, y, z] = selectedPrimitive.position;
      let dx = 0;
      let dz = 0;

      // Get current map bearing in radians
      const bearing = ((window as any).map?.getBearing() || 0) * Math.PI / 180;

      switch (event.key) {
        case 'Delete':
        case 'Backspace':
          setPlacedPrimitives(prev => prev.filter(p => p.id !== selectedPrimitiveId));
          setSelectedPrimitiveId(null);
          break;

        case 'w':
          dx = Math.sin(bearing) * gridSize;
          dz = -Math.cos(bearing) * gridSize;
          break;

        case 's':
          dx = -Math.sin(bearing) * gridSize;
          dz = Math.cos(bearing) * gridSize;
          break;

        case 'a':
          dx = -Math.cos(bearing) * gridSize;
          dz = -Math.sin(bearing) * gridSize;
          break;

        case 'd':
          dx = Math.cos(bearing) * gridSize;
          dz = Math.sin(bearing) * gridSize;
          break;

        case 'PageUp':
          setPlacedPrimitives(prev => prev.map(primitive =>
            primitive.id === selectedPrimitiveId
              ? { ...primitive, position: [x, y + gridSize, z] }
              : primitive
          ));
          break;

        case 'PageDown':
          setPlacedPrimitives(prev => prev.map(primitive =>
            primitive.id === selectedPrimitiveId
              ? { ...primitive, position: [x, y - gridSize, z] }
              : primitive
          ));
          break;
      }

      if (dx !== 0 || dz !== 0) {
        setPlacedPrimitives(prev => prev.map(primitive =>
          primitive.id === selectedPrimitiveId
            ? { ...primitive, position: [x + dx, y, z + dz] }
            : primitive
        ));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedPrimitiveId,
    placedPrimitives,
    setPlacedPrimitives,
    setSelectedPrimitiveId,
    gridSize,
    setInventoryOpen
  ]);
};

export default useKeyboardControls; 