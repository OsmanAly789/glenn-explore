export interface PrimitiveDimension {
  min: number;
  max: number;
  default: number;
}

export interface PrimitiveConfig {
  dimensions: {
    width?: PrimitiveDimension;
    height?: PrimitiveDimension;
    depth?: PrimitiveDimension;
    radius?: PrimitiveDimension;
  };
  material: {
    color: string;
  };
}

export type PrimitiveType = 'box' | 'cone' | 'wall' | 'floor' | 'massivebox' | 'window' | 'door';

export interface Primitive {
  type: PrimitiveType;
  name: string;
  config: PrimitiveConfig;
}

export interface PlacedPrimitive extends Primitive {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  currentDimensions: {
    width?: number;
    height?: number;
    depth?: number;
    radius?: number;
  };
} 