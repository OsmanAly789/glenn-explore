import React from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import { GridOn, GridOff } from '@mui/icons-material';

interface GridControlsProps {
  gridEnabled: boolean;
  setGridEnabled: (enabled: boolean) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
}

const GridControls: React.FC<GridControlsProps> = ({
  gridEnabled,
  setGridEnabled,
  gridSize,
  setGridSize
}) => {
  const handleGridSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value > 0) {
      setGridSize(value);
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        p: 1,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}
    >
      <IconButton
        onClick={() => setGridEnabled(!gridEnabled)}
        color={gridEnabled ? "primary" : "default"}
      >
        {gridEnabled ? <GridOn /> : <GridOff />}
      </IconButton>
      
      <TextField
        label="Grid Size"
        type="number"
        size="small"
        value={gridSize}
        onChange={handleGridSizeChange}
        disabled={!gridEnabled}
        InputProps={{
          inputProps: { 
            min: 0.01,
            max: 1,
            step: 0.01
          }
        }}
        sx={{ width: 100 }}
      />
    </Box>
  );
};

export default GridControls; 