import React from 'react';
import {
  Drawer,
  Grid,
  IconButton,
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Primitive } from '../../types/primitives';

interface InventoryDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  primitives: Primitive[];
  selectedPrimitive: Primitive | null;
  setSelectedPrimitive: (primitive: Primitive | null) => void;
}

const InventoryDrawer: React.FC<InventoryDrawerProps> = ({
  open,
  setOpen,
  primitives,
  selectedPrimitive,
  setSelectedPrimitive
}) => {
  const handleSelectPrimitive = (primitive: Primitive) => {
    setSelectedPrimitive(primitive);
    setOpen(false); // Close drawer after selection
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '70vh',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }
      }}
    >
      <Box sx={{ p: 2, pb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Primitives
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 2
        }}>
          {primitives.map((primitive) => (
            <Card 
              key={primitive.type}
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.2s',
                transform: selectedPrimitive?.type === primitive.type ? 'scale(1.02)' : 'none',
                border: selectedPrimitive?.type === primitive.type ? 2 : 1,
                borderColor: selectedPrimitive?.type === primitive.type ? 'primary.main' : 'divider',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3
                }
              }}
              onClick={() => handleSelectPrimitive(primitive)}
            >
              <CardContent>
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: 100, 
                    backgroundColor: primitive.config.material.color,
                    borderRadius: 1,
                    mb: 1
                  }} 
                />
                <Typography variant="body2" fontWeight="medium" align="center">
                  {primitive.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default InventoryDrawer; 