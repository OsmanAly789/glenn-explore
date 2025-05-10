import { ReactNode } from 'react';

export type BoxType = 'cube' | 'sphere' | 'cone' | 'cylinder' | 'wall' | 'floor' | 'window' | 'door' | 'tree' | 'chair' | 'house' | 'skyscraper' | 'cottage';

export interface GameBox {
  id: string;
  position: [number, number, number];
  color: string;
  scale: number;
  type: BoxType;
  rotation: [number, number, number];
  name?: string;
}

// Predefined inventory items organized by category
export interface InventoryCategory {
  name: string;
  icon: ReactNode;
  items: InventoryItem[];
}

export interface InventoryItem {
  type: BoxType;
  name: string;
  color: string;
  scale: number;
} 