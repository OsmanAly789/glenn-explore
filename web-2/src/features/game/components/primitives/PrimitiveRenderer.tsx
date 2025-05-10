import React, { useRef, useState } from 'react';
import { Box } from "@react-three/drei";
import { ThreeEvent } from '@react-three/fiber';
import { PlacedPrimitive } from '../../types/primitives';
import * as THREE from 'three';

interface PrimitiveRendererProps {
  primitive: PlacedPrimitive;
  isSelected: boolean;
  onClick: (event: ThreeEvent<MouseEvent>, faceIndex: number | null, localPosition: [number, number, number] | null) => void;
  enableHighlight?: boolean;
}

interface FaceData {
  index: number;
  isValid: boolean;
  normal: THREE.Vector3;
  worldPosition: THREE.Vector3;
}

const PrimitiveRenderer: React.FC<PrimitiveRendererProps> = ({
  primitive,
  isSelected,
  onClick,
  enableHighlight = false
}) => {
  const { type, position, rotation, currentDimensions } = primitive;
  const meshRef = useRef<THREE.Mesh>(null);
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);
  const currentFaceData = useRef<FaceData | null>(null);
  const lastHighlightTime = useRef(0);

  // Shared function to validate faces
  const validateFace = (
    event: ThreeEvent<any>,
    rawFaceIndex: number
  ): FaceData | null => {
    if (!meshRef.current || !event.normal) return null;

    // Calculate actual face index based on normal vector
    const normal = event.normal.clone();
    meshRef.current.updateMatrixWorld();
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(meshRef.current.matrixWorld);
    normal.applyMatrix3(normalMatrix).normalize();

    // Determine face index based on the dominant normal direction
    let faceIndex: number;
    const absX = Math.abs(normal.x);
    const absY = Math.abs(normal.y);
    const absZ = Math.abs(normal.z);

    if (absX > absY && absX > absZ) {
      faceIndex = normal.x > 0 ? 0 : 1; // Right/Left
    } else if (absY > absX && absY > absZ) {
      faceIndex = normal.y > 0 ? 2 : 3; // Top/Bottom
    } else {
      faceIndex = normal.z > 0 ? 4 : 5; // Front/Back
    }

    // Get the camera position and hit point
    const cameraPosition = new THREE.Vector3();
    event.camera.getWorldPosition(cameraPosition);
    const hitPoint = event.point.clone();

    // Calculate vector from hit point to camera
    const toCameraVector = new THREE.Vector3().subVectors(cameraPosition, hitPoint).normalize();

    // Calculate dot product between face normal and camera vector
    const dotProduct = normal.dot(toCameraVector);

    // Face is valid if it's facing away from the camera (back face)
    const isValid = dotProduct > 0.2;

    console.log(`Face validation:`, {
      rawFaceIndex,
      calculatedFaceIndex: faceIndex,
      dotProduct,
      isValid,
      normal: normal.toArray(),
      cameraVector: toCameraVector.toArray()
    });

    return {
      index: faceIndex,
      isValid,
      normal,
      worldPosition: hitPoint
    };
  };
  
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    
    console.log('Click event:', {
      rawFaceIndex: event.faceIndex,
      hasNormal: !!event.normal,
      normal: event.normal?.toArray(),
      point: event.point?.toArray()
    });

    if (typeof event.faceIndex === 'number' && event.normal && meshRef.current) {
      const faceData = validateFace(event, event.faceIndex);
      
      if (faceData) {
        const localPosition = event.point ? getLocalPosition(event.point) : null;

        console.log('Face data after validation:', {
          originalIndex: faceData.index,
          isValid: faceData.isValid,
          finalFaceIndex: faceData.isValid ? faceData.index : null,
          localPosition
        });

        onClick(event, faceData.isValid ? faceData.index : null, localPosition);
        return;
      }
    }
    
    onClick(event, null, null);
  };

  const getLocalPosition = (worldPoint: THREE.Vector3): [number, number, number] | null => {
    if (!meshRef.current) return null;
    
    meshRef.current.updateMatrixWorld();
    const localPoint = worldPoint.clone().applyMatrix4(meshRef.current.matrixWorld.clone().invert());
    return [localPoint.x, localPoint.y, localPoint.z];
  };
  
  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!enableHighlight) return;
    event.stopPropagation();

    // Throttle highlight updates
    const now = Date.now();
    if (now - lastHighlightTime.current < 50) return;
    lastHighlightTime.current = now;

    console.log('Hover event:', {
      rawFaceIndex: event.faceIndex,
      normal: event.normal?.toArray()
    });

    if (typeof event.faceIndex === 'number' && event.normal) {
      const faceData = validateFace(event, event.faceIndex);
      
      if (faceData && faceData.isValid) {
        console.log('Setting hovered face:', faceData.index);
        setHoveredFace(faceData.index);
        currentFaceData.current = faceData;
      } else {
        console.log('Clearing hovered face');
        setHoveredFace(null);
        currentFaceData.current = null;
      }
    } else {
      setHoveredFace(null);
      currentFaceData.current = null;
    }
  };
  
  const handlePointerOut = () => {
    if (!enableHighlight) return;
    setHoveredFace(null);
    currentFaceData.current = null;
  };

  const commonProps = {
    position,
    rotation,
    ref: meshRef,
    onClick: handleClick,
    onPointerMove: handlePointerMove,
    onPointerOut: handlePointerOut
  };

  // Only handle box types
  if (type !== 'box' && type !== 'massivebox') {
    return null;
  }

  const width = currentDimensions.width || primitive.config.dimensions.width?.default || 1;
  const height = currentDimensions.height || primitive.config.dimensions.height?.default || 1;
  const depth = currentDimensions.depth || primitive.config.dimensions.depth?.default || 1;

  const renderHighlightedFaceOverlay = () => {
    if (!enableHighlight || hoveredFace === null) return null;

    console.log('Rendering highlight for face:', hoveredFace);

    const padding = 0.01; // Small padding to make highlight slightly larger than the face
    
    // Create a slightly larger face to overlay
    let faceGeometry: React.ReactNode | null = null;
    let highlightPosition: [number, number, number] = [0, 0, 0];
    let highlightRotation: [number, number, number] = [0, 0, 0];
    
    switch (hoveredFace) {
      case 0: // Right face (+X)
        faceGeometry = <planeGeometry args={[depth+padding*2, height+padding*2]} />;
        highlightPosition = [width/2 + 0.001, 0, 0];
        highlightRotation = [0, Math.PI/2, 0];
        break;
      case 1: // Left face (-X)
        faceGeometry = <planeGeometry args={[depth+padding*2, height+padding*2]} />;
        highlightPosition = [-width/2 - 0.001, 0, 0];
        highlightRotation = [0, -Math.PI/2, 0];
        break;
      case 2: // Top face (+Y)
        faceGeometry = <planeGeometry args={[width+padding*2, depth+padding*2]} />;
        highlightPosition = [0, height/2 + 0.001, 0];
        highlightRotation = [-Math.PI/2, 0, 0];
        break;
      case 3: // Bottom face (-Y)
        faceGeometry = <planeGeometry args={[width+padding*2, depth+padding*2]} />;
        highlightPosition = [0, -height/2 - 0.001, 0];
        highlightRotation = [Math.PI/2, 0, 0];
        break;
      case 4: // Front face (+Z)
        faceGeometry = <planeGeometry args={[width+padding*2, height+padding*2]} />;
        highlightPosition = [0, 0, depth/2 + 0.001];
        highlightRotation = [0, 0, 0];
        break;
      case 5: // Back face (-Z)
        faceGeometry = <planeGeometry args={[width+padding*2, height+padding*2]} />;
        highlightPosition = [0, 0, -depth/2 - 0.001];
        highlightRotation = [0, Math.PI, 0];
        break;
    }
    
    if (!faceGeometry) return null;
    
    return (
      <mesh 
        position={highlightPosition}
        rotation={highlightRotation}
      >
        {faceGeometry}
        <meshBasicMaterial 
          color="#00ff00" 
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.5}
          wireframe={true}
          depthTest={false}
        />
      </mesh>
    );
  };

  return (
    <group {...commonProps}>
      <Box args={[width, height, depth]}>
        <meshStandardMaterial 
          color={primitive.config.material.color}
          transparent={isSelected}
          opacity={isSelected ? 0.7 : 1}
        />
      </Box>
      {renderHighlightedFaceOverlay()}
    </group>
  );
};

export default PrimitiveRenderer; 