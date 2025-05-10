import React from 'react';
import { Box, Sphere, Cone, Cylinder } from '@react-three/drei';
import type { Structure as StructureType, StructureComponent, Vector3 } from '../types/structures';

interface StructureProps {
  structure: StructureType;
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
}

const renderComponent = (component: StructureComponent) => {
  const commonProps = {
    position: [component.position.x, component.position.y, component.position.z] as [number, number, number],
    rotation: component.rotation ? [component.rotation.x, component.rotation.y, component.rotation.z] as [number, number, number] : [0, 0, 0] as [number, number, number],
    scale: component.scale ? [component.scale.x, component.scale.y, component.scale.z] as [number, number, number] : [1, 1, 1] as [number, number, number]
  };

  const material = <meshStandardMaterial color={component.color || '#ffffff'} />;

  switch (component.type) {
    case 'cube':
      return <Box {...commonProps}>{material}</Box>;
    case 'sphere':
      return <Sphere {...commonProps}>{material}</Sphere>;
    case 'cone':
      return <Cone {...commonProps}>{material}</Cone>;
    case 'cylinder':
      return <Cylinder {...commonProps}>{material}</Cylinder>;
    default:
      return null;
  }
};

const Structure: React.FC<StructureProps> = ({ 
  structure, 
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0 },
  scale = { x: 1, y: 1, z: 1 }
}) => {
  return (
    <group
      position={[position.x, position.y, position.z] as [number, number, number]}
      rotation={[rotation.x, rotation.y, rotation.z] as [number, number, number]}
      scale={[scale.x, scale.y, scale.z] as [number, number, number]}
    >
      {structure.components.map((component, index) => (
        <React.Fragment key={`${structure.id}-component-${index}`}>
          {renderComponent(component)}
        </React.Fragment>
      ))}
    </group>
  );
};

export default Structure; 