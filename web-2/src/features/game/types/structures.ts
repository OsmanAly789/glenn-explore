import { BoxType } from './index';

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface StructureComponent {
  type: BoxType;
  position: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  color?: string;
  children?: StructureComponent[];
  metadata?: {
    name?: string;
    description?: string;
    tags?: string[];
    [key: string]: any;
  };
}

export interface Structure {
  id: string;
  name: string;
  description?: string;
  author?: string;
  createdAt: string;
  tags?: string[];
  components: StructureComponent[];
  metadata?: {
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    size?: {
      width: number;
      height: number;
      depth: number;
    };
    [key: string]: any;
  };
}

// Example of how a tree structure would look:
export const EXAMPLE_TREE: Structure = {
  id: 'oak-tree-1',
  name: 'Oak Tree',
  description: 'A tall oak tree with a thick trunk and dense foliage',
  author: 'AI Generator',
  createdAt: new Date().toISOString(),
  tags: ['nature', 'tree', 'oak'],
  components: [
    {
      // Trunk
      type: 'cylinder',
      position: { x: 0, y: 0, z: 0 },
      scale: { x: 0.3, y: 2, z: 0.3 },
      color: '#8b4513',
      metadata: { name: 'trunk' }
    },
    {
      // Main foliage
      type: 'sphere',
      position: { x: 0, y: 2, z: 0 },
      scale: { x: 1.5, y: 1.5, z: 1.5 },
      color: '#2e7d32',
      metadata: { name: 'foliage' }
    },
    {
      // Additional foliage clusters
      type: 'sphere',
      position: { x: 0.5, y: 1.8, z: 0.5 },
      scale: { x: 1, y: 1, z: 1 },
      color: '#1b5e20',
      metadata: { name: 'foliage-detail' }
    }
  ],
  metadata: {
    category: 'nature',
    difficulty: 'easy',
    size: {
      width: 3,
      height: 4,
      depth: 3
    }
  }
}; 