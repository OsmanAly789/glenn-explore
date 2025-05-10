import React, { useState, useEffect, useRef } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { ThreeEvent } from '@react-three/fiber';
import { PlacedPrimitive, Primitive } from './types/primitives';
import { primitives } from './data/primitiveTemplates';
import GameMap from './components/GameMap';
import FPSStats from './components/utils/FPSStats';
import InstructionsPanel from './components/ui/InstructionsPanel';
import BottomBar from './components/ui/BottomBar';
import InventoryDrawer from './components/ui/InventoryDrawer';
import ControlPanel from './components/ui/ControlPanel';
import useKeyboardControls from './hooks/useKeyboardControls.ts';
import { coordsToVector1337 } from '../../utils/coordinates';
import { useControls } from 'leva';
import * as THREE from 'three';

const Game: React.FC = () => {
  const [placedPrimitives, setPlacedPrimitives] = useState<PlacedPrimitive[]>([]);
  const [selectedPrimitiveId, setSelectedPrimitiveId] = useState<string | null>(null);
  const [inventoryOpen, setInventoryOpen] = useState(true);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<Primitive | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [mousePosition, setMousePosition] = useState<{lng: number, lat: number}>({lng: 0, lat: 0});
  const [placementMode, setPlacementMode] = useState<'map' | 'attach'>('map');
  const [clickedFaceInfo, setClickedFaceInfo] = useState<{
    primitiveId: string;
    faceIndex: number | null;
    localPosition: [number, number, number] | null;
  } | null>(null);

  const selectedPrimitive = placedPrimitives.find(p => p.id === selectedPrimitiveId);
  const { scale, gridSize } = useControls({
    scale: { value: 90000, min: 1000, max: 500000, step: 1000 },
    gridSize: { value: 1, min: 0.1, max: 100, step: 1 }
  });
  
  useKeyboardControls({
    placedPrimitives: placedPrimitives,
    setPlacedPrimitives: setPlacedPrimitives,
    selectedPrimitiveId: selectedPrimitiveId,
    setSelectedPrimitiveId: setSelectedPrimitiveId,
    gridSize,
    setInventoryOpen: setInventoryOpen
  });

  useEffect(() => {
    if (mousePosition.lng !== 0 || mousePosition.lat !== 0) {
      const event = new CustomEvent('map-mousemove', { 
        detail: { lngLat: mousePosition } 
      });
      window.dispatchEvent(event);
    }
  }, [mousePosition]);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleMapClick = (event: any) => {
    if (inventoryOpen) return;
    
    if (!selectedInventoryItem) {
      showAlert('Select an item from inventory first (press I)');
      return;
    }
    
    // Only place on the map if in map placement mode
    if (placementMode !== 'map') {
      showAlert('Currently in attach mode. Press M to toggle placement mode.');
      return;
    }
    
    const x = event.lngLat.lng;
    const z = event.lngLat.lat;
    
    console.log("XZ:", x, z);
    const vector = coordsToVector1337({longitude: x, latitude: z}, {longitude: 0, latitude: 0}, scale);
    console.log("Vector:", vector);
    const newPrimitive: PlacedPrimitive = {
      ...selectedInventoryItem,
      id: Math.random().toString(36).substring(7),
      position: [vector[0], 0, vector[2]],
      rotation: [0, 0, 0],
      currentDimensions: {}
    };
    
    setPlacedPrimitives(prev => [...prev, newPrimitive]);
    setSelectedPrimitiveId(newPrimitive.id);
    setSelectedInventoryItem(null);
  };

  const handleMapMouseMove = (event: any) => {
    if (event.lngLat) {
      setMousePosition({
        lng: event.lngLat.lng,
        lat: event.lngLat.lat
      });
    }
  };

  const handlePrimitiveClick = (
    event: ThreeEvent<MouseEvent>, 
    primitiveId: string, 
    faceIndex: number | null, 
    localPosition: [number, number, number] | null
  ) => {
    event.stopPropagation();
    
    // If we have a selected inventory item and in attach mode, we want to place it
    if (selectedInventoryItem && !inventoryOpen && placementMode === 'attach') {
      console.log(`Clicked primitive: ${primitiveId}, face: ${faceIndex}, local position:`, localPosition);
      
      if (faceIndex === null || localPosition === null) {
        showAlert('Could not detect face or position');
        return;
      }
      
      const parentPrimitive = placedPrimitives.find(p => p.id === primitiveId);
      if (!parentPrimitive) {
        showAlert('Parent primitive not found');
        return;
      }
      
      // Place the primitive on the face of the clicked primitive
      placePrimitiveOnFace(parentPrimitive, faceIndex, localPosition, selectedInventoryItem);
      return;
    }
    
    // If no inventory item is selected, just select/deselect the primitive as before
    setSelectedPrimitiveId(primitiveId === selectedPrimitiveId ? null : primitiveId);
  };

  // Function to place a primitive on the face of another primitive
  const placePrimitiveOnFace = (
    parentPrimitive: PlacedPrimitive, 
    faceIndex: number, 
    localPosition: [number, number, number],
    primitiveToPlace: Primitive
  ) => {
    // Get the parent primitive's dimensions
    const parentWidth = parentPrimitive.currentDimensions.width || 
                        parentPrimitive.config.dimensions.width?.default || 1;
    const parentHeight = parentPrimitive.currentDimensions.height || 
                         parentPrimitive.config.dimensions.height?.default || 1;
    const parentDepth = parentPrimitive.currentDimensions.depth || 
                        parentPrimitive.config.dimensions.depth?.default || 1;
    
    // Get parent position and rotation
    const [px, py, pz] = parentPrimitive.position;
    const [prx, pry, prz] = parentPrimitive.rotation;
    
    // Calculate the position offset based on the face index
    // Face indices:
    // 0: Right face (+X)
    // 1: Left face (-X)
    // 2: Top face (+Y)
    // 3: Bottom face (-Y)
    // 4: Front face (+Z)
    // 5: Back face (-Z)
    let positionOffset: [number, number, number] = [0, 0, 0];
    let rotationOffset: [number, number, number] = [0, 0, 0];
    
    // Get the child primitive's dimensions
    const childWidth = primitiveToPlace.config.dimensions.width?.default || 1;
    const childHeight = primitiveToPlace.config.dimensions.height?.default || 1;
    const childDepth = primitiveToPlace.config.dimensions.depth?.default || 1;
    
    // Special case: if placing a window or door on a wall
    const isWindowOrDoor = primitiveToPlace.type === 'window' || primitiveToPlace.type === 'door';
    const isWall = parentPrimitive.type === 'wall';
    
    switch (faceIndex) {
      case 0: // Right face (+X)
        positionOffset = [parentWidth / 2 + childDepth / 2, 0, 0];
        if (isWindowOrDoor && isWall) {
          rotationOffset = [0, Math.PI / 2, 0];
        }
        break;
      case 1: // Left face (-X)
        positionOffset = [-parentWidth / 2 - childDepth / 2, 0, 0];
        if (isWindowOrDoor && isWall) {
          rotationOffset = [0, -Math.PI / 2, 0];
        }
        break;
      case 2: // Top face (+Y)
        positionOffset = [0, parentHeight / 2 + childHeight / 2, 0];
        if (isWindowOrDoor) {
          rotationOffset = [Math.PI / 2, 0, 0];
        }
        break;
      case 3: // Bottom face (-Y)
        positionOffset = [0, -parentHeight / 2 - childHeight / 2, 0];
        if (isWindowOrDoor) {
          rotationOffset = [-Math.PI / 2, 0, 0];
        }
        break;
      case 4: // Front face (+Z)
        positionOffset = [0, 0, parentDepth / 2 + childDepth / 2];
        if (isWindowOrDoor && isWall) {
          positionOffset = [0, 0, parentDepth / 2 + childDepth / 2];
        }
        break;
      case 5: // Back face (-Z)
        positionOffset = [0, 0, -parentDepth / 2 - childDepth / 2];
        if (isWindowOrDoor && isWall) {
          rotationOffset = [0, Math.PI, 0];
        }
        break;
    }
    
    // Create the new primitive
    const newPrimitive: PlacedPrimitive = {
      ...primitiveToPlace,
      id: Math.random().toString(36).substring(7),
      // Apply parent rotation to our position offset
      position: applyRotationToOffset(
        [px, py, pz],
        positionOffset,
        [prx, pry, prz]
      ),
      // Combine parent rotation with our face rotation
      rotation: [
        prx + rotationOffset[0],
        pry + rotationOffset[1],
        prz + rotationOffset[2]
      ],
      currentDimensions: {}
    };
    
    // Add the new primitive to the scene
    setPlacedPrimitives(prev => [...prev, newPrimitive]);
    setSelectedPrimitiveId(newPrimitive.id);
    setSelectedInventoryItem(null);
    
    showAlert(`Placed ${primitiveToPlace.name} on ${parentPrimitive.name}`);
  };
  
  // Helper function to apply rotation to an offset vector
  const applyRotationToOffset = (
    parentPosition: [number, number, number],
    offset: [number, number, number],
    rotation: [number, number, number]
  ): [number, number, number] => {
    // Create a rotation matrix from the rotation Euler angles
    const rotMatrix = new THREE.Matrix4().makeRotationFromEuler(
      new THREE.Euler(rotation[0], rotation[1], rotation[2])
    );
    
    // Create a vector from the offset
    const offsetVector = new THREE.Vector3(offset[0], offset[1], offset[2]);
    
    // Apply rotation to the offset vector
    offsetVector.applyMatrix4(rotMatrix);
    
    // Return the rotated offset added to the parent position
    return [
      parentPosition[0] + offsetVector.x,
      parentPosition[1] + offsetVector.y,
      parentPosition[2] + offsetVector.z
    ];
  };

  const handleColorChange = (color: { hex: string }) => {
    if (!selectedPrimitiveId) return;
    setPlacedPrimitives(prev => prev.map(primitive => 
      primitive.id === selectedPrimitiveId 
        ? { 
            ...primitive, 
            config: { 
              ...primitive.config, 
              material: { ...primitive.config.material, color: color.hex } 
            } 
          } 
        : primitive
    ));
  };

  const handleDimensionChange = (dimension: string, value: number) => {
    if (!selectedPrimitiveId) return;
    setPlacedPrimitives(prev => prev.map(primitive => 
      primitive.id === selectedPrimitiveId 
        ? { 
            ...primitive, 
            currentDimensions: { 
              ...primitive.currentDimensions, 
              [dimension]: value 
            } 
          } 
        : primitive
    ));
  };

  const handleRotateY = (clockwise: boolean) => {
    if (!selectedPrimitiveId) return;
    const rotationAmount = (Math.PI / 4) * (clockwise ? 1 : -1);
    
    setPlacedPrimitives(prev => prev.map(primitive => {
      if (primitive.id !== selectedPrimitiveId) return primitive;
      
      const [rx, ry, rz] = primitive.rotation;
      return { 
        ...primitive, 
        rotation: [rx, ry + rotationAmount, rz] 
      };
    }));
  };

  const handleRotateX = (clockwise: boolean) => {
    if (!selectedPrimitiveId) return;
    const rotationAmount = (Math.PI / 4) * (clockwise ? 1 : -1);
    
    setPlacedPrimitives(prev => prev.map(primitive => {
      if (primitive.id !== selectedPrimitiveId) return primitive;
      
      const [rx, ry, rz] = primitive.rotation;
      return { 
        ...primitive, 
        rotation: [rx + rotationAmount, ry, rz] 
      };
    }));
  };

  const handleDeletePrimitive = () => {
    if (!selectedPrimitiveId) return;
    setPlacedPrimitives(prev => prev.filter(p => p.id !== selectedPrimitiveId));
    setSelectedPrimitiveId(null);
  };

  const duplicateSelectedPrimitive = () => {
    if (!selectedPrimitive) return;
    
    const [x, y, z] = selectedPrimitive.position;
    const newPosition: [number, number, number] = [x + 0.01, y, z];
    
    const newPrimitive: PlacedPrimitive = {
      ...selectedPrimitive,
      id: Math.random().toString(36).substring(7),
      position: newPosition
    };
    
    setPlacedPrimitives(prev => [...prev, newPrimitive]);
  };

  // Add a toggle for placement mode
  const togglePlacementMode = () => {
    const newMode = placementMode === 'map' ? 'attach' : 'map';
    setPlacementMode(newMode);
    showAlert(`Placement mode: ${newMode === 'map' ? 'Place on map' : 'Attach to faces'}`);
  };

  // Add this to your useKeyboardControls hook or create a direct event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm') {
        togglePlacementMode();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [placementMode]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FPSStats />
      
      <GameMap
        primitives={placedPrimitives}
        selectedPrimitiveId={selectedPrimitiveId}
        onPrimitiveClick={handlePrimitiveClick}
        onMapClick={handleMapClick}
        onMapMouseMove={handleMapMouseMove}
        gridSize={gridSize}
        inventoryOpen={inventoryOpen}
        selectedInventoryItem={selectedInventoryItem}
        placementMode={placementMode}
      />

      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" variant="filled" onClose={() => setAlertOpen(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <InstructionsPanel />
      
      <BottomBar 
        selectedPrimitive={selectedInventoryItem}
        setSelectedPrimitive={setSelectedInventoryItem}
        setInventoryOpen={setInventoryOpen}
      />
      
      <InventoryDrawer 
        open={inventoryOpen}
        setOpen={setInventoryOpen}
        primitives={primitives}
        selectedPrimitive={selectedInventoryItem}
        setSelectedPrimitive={setSelectedInventoryItem}
      />
      
      {selectedPrimitive && (
        <ControlPanel 
          selectedPrimitive={selectedPrimitive}
          onColorChange={handleColorChange}
          onDimensionChange={handleDimensionChange}
          onRotateY={handleRotateY}
          onRotateX={handleRotateX}
          onDuplicate={duplicateSelectedPrimitive}
          onDelete={handleDeletePrimitive}
        />
      )}
    </div>
  );
};

export default Game; 