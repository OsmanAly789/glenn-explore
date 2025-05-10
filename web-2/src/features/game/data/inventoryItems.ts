import React, { ReactNode } from 'react';
import { ViewInAr, RadioButtonUnchecked, ChangeHistory, Rotate90DegreesCcw, Rotate90DegreesCw, GridOn, GridOff, Inventory, Widgets, Home, Grass, Nature, Window, DoorFront, Chair, ExpandLess, ExpandMore, SportsEsports } from '@mui/icons-material';
import { InventoryCategory, BoxType } from '../types';

// Define inventory items with proper typing
const createInventoryItem = (type: BoxType, name: string, color: string, scale: number) => ({
  type,
  name,
  color,
  scale
});

// Export inventory categories with items
export const inventoryCategories: InventoryCategory[] = [
  {
    name: 'Basic Shapes',
    icon: React.createElement(Widgets),
    items: [
      createInventoryItem('cube', 'Cube', '#ffffff', 0.1),
      createInventoryItem('sphere', 'Sphere', '#e0e0e0', 0.1),
      createInventoryItem('cone', 'Cone', '#ffcc80', 0.1),
      createInventoryItem('cylinder', 'Cylinder', '#b3e5fc', 0.1)
    ]
  },
  {
    name: 'Buildings',
    icon: React.createElement(Home),
    items: [
      createInventoryItem('house', 'Cute House', '#e57373', 0.15),
      createInventoryItem('cottage', 'Cottage', '#a1887f', 0.15),
      createInventoryItem('skyscraper', 'Skyscraper', '#90caf9', 0.2)
    ]
  },
  {
    name: 'Building Parts',
    icon: React.createElement(ViewInAr),
    items: [
      createInventoryItem('wall', 'Wall', '#e0e0e0', 0.1),
      createInventoryItem('floor', 'Floor', '#a1887f', 0.1),
      createInventoryItem('window', 'Window', '#bbdefb', 0.1),
      createInventoryItem('door', 'Door', '#a1887f', 0.1)
    ]
  },
  {
    name: 'Furniture',
    icon: React.createElement(Chair),
    items: [
      createInventoryItem('chair', 'Chair', '#8d6e63', 0.1)
    ]
  },
  {
    name: 'Nature',
    icon: React.createElement(Nature),
    items: [
      createInventoryItem('tree', 'Tree', '#81c784', 0.1)
    ]
  }
]; 