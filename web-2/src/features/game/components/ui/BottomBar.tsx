import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Inventory } from '@mui/icons-material';
import { Primitive } from '../../types/primitives';

interface BottomBarProps {
  selectedPrimitive: Primitive | null;
  setSelectedPrimitive: (primitive: Primitive | null) => void;
  setInventoryOpen: (open: boolean) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  selectedPrimitive,
  setSelectedPrimitive,
  setInventoryOpen
}) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
    >
      {selectedPrimitive ? (
        <>
          <Box
            sx={{
              width: 40,
              height: 40,
              backgroundColor: selectedPrimitive.config.material.color,
              borderRadius: 1,
            }}
          />
          <Typography variant="body1">
            {selectedPrimitive.name}
          </Typography>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={() => setSelectedPrimitive(null)}
          >
            Clear Selection
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          startIcon={<Inventory />}
          onClick={() => setInventoryOpen(true)}
        >
          Open Inventory (I)
        </Button>
      )}
    </Box>
  );
};

export default BottomBar; 