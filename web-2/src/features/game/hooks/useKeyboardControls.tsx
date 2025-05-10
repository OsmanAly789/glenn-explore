import { useEffect } from 'react';
import { GameBox } from '../types';

interface UseKeyboardControlsProps {
  boxes: GameBox[];
  setBoxes: React.Dispatch<React.SetStateAction<GameBox[]>>;
  selectedBoxId: string | null;
  setSelectedBoxId: React.Dispatch<React.SetStateAction<string | null>>;
  gridEnabled: boolean;
  gridSize: number;
  setInventoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const useKeyboardControls = ({
  boxes,
  setBoxes,
  selectedBoxId,
  setSelectedBoxId,
  gridEnabled,
  gridSize,
  setInventoryOpen
}: UseKeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedBoxId) return;
      
      // Delete selected box with Delete key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        setBoxes(prev => prev.filter(box => box.id !== selectedBoxId));
        setSelectedBoxId(null);
        return;
      }

      // Toggle inventory with I key
      if (e.key.toLowerCase() === 'i') {
        setInventoryOpen(prev => !prev);
        return;
      }
      
      const moveAmount = gridEnabled ? gridSize : 0.01;
      
      setBoxes(prevBoxes => {
        return prevBoxes.map(box => {
          if (box.id !== selectedBoxId) return box;
          
          const [x, y, z] = box.position;
          let newPosition: [number, number, number] = [x, y, z];
          
          switch(e.key.toLowerCase()) {
            case 'w':
              newPosition = [x, y, z - moveAmount];
              break;
            case 's':
              newPosition = [x, y, z + moveAmount];
              break;
            case 'a':
              newPosition = [x - moveAmount, y, z];
              break;
            case 'd':
              newPosition = [x + moveAmount, y, z];
              break;
            case 'q': // Up
              newPosition = [x, y + moveAmount, z];
              break;
            case 'e': // Down
              newPosition = [x, y - moveAmount, z];
              break;
          }
          
          // Snap to grid if grid is enabled
          if (gridEnabled) {
            newPosition = newPosition.map(coord => 
              Math.round(coord / gridSize) * gridSize
            ) as [number, number, number];
          }
          
          return { ...box, position: newPosition };
        });
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedBoxId, gridEnabled, gridSize, setBoxes, setSelectedBoxId, setInventoryOpen]);
};

export default useKeyboardControls; 