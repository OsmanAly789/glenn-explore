import React from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { PlacedPrimitive } from '../../types/primitives';

interface PrimitiveControlsProps {
  primitive: PlacedPrimitive;
  onDimensionChange: (dimension: string, value: number) => void;
}

const PrimitiveControls: React.FC<PrimitiveControlsProps> = ({
  primitive,
  onDimensionChange
}) => {
  const { config, currentDimensions } = primitive;

  const renderDimensionControl = (
    dimensionKey: 'width' | 'height' | 'depth' | 'radius',
    label: string
  ) => {
    const dimension = config.dimensions[dimensionKey];
    if (!dimension) return null;

    return (
      <Box key={dimensionKey} sx={{ mb: 2 }}>
        <Typography gutterBottom>
          {label}
        </Typography>
        <Slider
          value={currentDimensions[dimensionKey] || dimension.default}
          min={dimension.min}
          max={dimension.max}
          step={0.1}
          onChange={(_, value) => onDimensionChange(dimensionKey, value as number)}
          valueLabelDisplay="auto"
        />
      </Box>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Dimensions
      </Typography>
      {renderDimensionControl('width', 'Width')}
      {renderDimensionControl('height', 'Height')}
      {renderDimensionControl('depth', 'Depth')}
      {renderDimensionControl('radius', 'Radius')}
    </Box>
  );
};

export default PrimitiveControls; 