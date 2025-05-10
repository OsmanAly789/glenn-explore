import React, { useEffect, useRef } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "react-map-gl/mapbox";
import { Canvas } from "react-three-map";
import FrameLimiter from './utils/FrameLimiter';
import { PlacedPrimitive, Primitive } from '../types/primitives';
import GameObjects from './GameObjects';
import { ThreeEvent } from '@react-three/fiber';

interface GameMapProps {
  primitives: PlacedPrimitive[];
  selectedPrimitiveId: string | null;
  onPrimitiveClick: (
    event: ThreeEvent<MouseEvent>, 
    primitiveId: string, 
    faceIndex: number | null, 
    localPosition: [number, number, number] | null
  ) => void;
  onMapClick: (event: any) => void;
  onMapMouseMove?: (event: any) => void;
  gridSize: number;
  inventoryOpen: boolean;
  selectedInventoryItem: Primitive | null;
  placementMode: 'map' | 'attach';
  children?: React.ReactNode;
}

const GameMap: React.FC<GameMapProps> = ({
  primitives,
  selectedPrimitiveId,
  onPrimitiveClick,
  onMapClick,
  onMapMouseMove,
  inventoryOpen,
  selectedInventoryItem,
  placementMode,
  children
}) => {
  const mapRef = useRef<any>(null);

  // Determine if we should enable face highlighting
  const enableHighlight = 
    placementMode === 'attach' && 
    !inventoryOpen && 
    selectedInventoryItem !== null;

  useEffect(() => {
    if(mapRef.current) {
      (window as any).map = mapRef.current
    }
  }, [mapRef.current]);

  const handleMouseMove = (event: any) => {
    if (onMapMouseMove) {
      onMapMouseMove(event);
    }
  };

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken='pk.eyJ1Ijoid2F2aCIsImEiOiJjbThuZmg3ODgwMDdwMnZzYWE3emc5dDBqIn0.kaSBvEA-Ul8FrHEndqUC0Q'
      antialias
      initialViewState={{
        latitude: 57.7060,
        longitude: 11.9874,
        zoom: 18,
        pitch: 60,
      }}
      projection="mercator"
      mapStyle="mapbox://styles/wavh/cma00p05j00d801sidut082jr"
      onClick={onMapClick}
      onMouseMove={handleMouseMove}
    >
      <Canvas latitude={0} longitude={0}>
        <FrameLimiter fps={60} />
        <hemisphereLight
          args={["#ffffff", "#60666C"]}
          position={[1, 4.5, 3]}
        />
        <object3D scale={1}>
          <GameObjects
            primitives={primitives}
            selectedPrimitiveId={selectedPrimitiveId}
            onPrimitiveClick={onPrimitiveClick}
            enableHighlight={enableHighlight}
          />
        </object3D>
        <axesHelper args={[5000000]} />
      </Canvas>
      {children}
    </Map>
  );
};

export default GameMap; 