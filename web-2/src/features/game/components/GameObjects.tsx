import React from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { PlacedPrimitive } from '../types/primitives';
import PrimitiveRenderer from './primitives/PrimitiveRenderer';

interface GameObjectsProps {
  primitives: PlacedPrimitive[];
  selectedPrimitiveId: string | null;
  onPrimitiveClick: (
    event: ThreeEvent<MouseEvent>, 
    primitiveId: string, 
    faceIndex: number | null, 
    localPosition: [number, number, number] | null
  ) => void;
  enableHighlight?: boolean;
}

const GameObjects: React.FC<GameObjectsProps> = ({
  primitives,
  selectedPrimitiveId,
  onPrimitiveClick,
  enableHighlight = false
}) => {
  return (
    <>
      {primitives.map(primitive => (
        <PrimitiveRenderer
          key={primitive.id}
          primitive={primitive}
          isSelected={primitive.id === selectedPrimitiveId}
          onClick={(event, faceIndex, localPosition) => 
            onPrimitiveClick(event, primitive.id, faceIndex, localPosition)
          }
          enableHighlight={enableHighlight}
        />
      ))}
    </>
  );
};

export default GameObjects; 