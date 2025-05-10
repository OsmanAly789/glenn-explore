import { Primitive } from '../types/primitives';

export const primitives: Primitive[] = [
  {
    type: 'box',
    name: 'Box',
    config: {
      dimensions: {
        width: { min: 0.1, max: 1000, default: 1 },
        height: { min: 0.1, max: 1000, default: 1 },
        depth: { min: 0.1, max: 1000, default: 1 }
      },
      material: { color: '#ffffff' }
    }
  },
  {
    type: 'massivebox',
    name: 'Massive Box',
    config: {
      dimensions: {
        width: { min: 0.1, max: 1000, default: 10000 },
        height: { min: 0.1, max: 1000, default: 10000 },
        depth: { min: 0.1, max: 1000, default: 10000 }
      },
      material: { color: '#ffffff' }
    }
  },
  {
    type: 'cone',
    name: 'Cone',
    config: {
      dimensions: {
        radius: { min: 0.1, max: 5, default: 1 },
        height: { min: 0.1, max: 10, default: 2 }
      },
      material: { color: '#ffcc80' }
    }
  },
  {
    type: 'wall',
    name: 'Wall',
    config: {
      dimensions: {
        width: { min: 0.1, max: 20, default: 4 },
        height: { min: 0.1, max: 10, default: 2.5 },
        depth: { min: 0.1, max: 2, default: 0.2 }
      },
      material: { color: '#e0e0e0' }
    }
  },
  {
    type: 'floor',
    name: 'Floor',
    config: {
      dimensions: {
        width: { min: 0.1, max: 20, default: 4 },
        depth: { min: 0.1, max: 20, default: 4 }
      },
      material: { color: '#a1887f' }
    }
  },
  {
    type: 'window',
    name: 'Window',
    config: {
      dimensions: {
        width: { min: 0.1, max: 4, default: 1.2 },
        height: { min: 0.1, max: 3, default: 1.0 },
        depth: { min: 0.05, max: 0.5, default: 0.1 }
      },
      material: { color: '#90caf9' }
    }
  },
  {
    type: 'door',
    name: 'Door',
    config: {
      dimensions: {
        width: { min: 0.1, max: 2, default: 1.0 },
        height: { min: 0.1, max: 3, default: 2.0 },
        depth: { min: 0.05, max: 0.5, default: 0.1 }
      },
      material: { color: '#8d6e63' }
    }
  }
]; 