import React from 'react';
import { Paper, Stack, Typography, Button, Slider } from '@mui/material';
import { Delete as DeleteIcon, Rotate90DegreesCcw, Rotate90DegreesCw } from '@mui/icons-material';
import { Sketch } from '@uiw/react-color';
import { PlacedPrimitive } from '../../types/primitives';

interface ControlPanelProps {
  selectedPrimitive: PlacedPrimitive;
  onColorChange: (color: { hex: string }) => void;
  onDimensionChange: (dimension: string, value: number) => void;
  onRotateY: (clockwise: boolean) => void;
  onRotateX: (clockwise: boolean) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedPrimitive,
  onColorChange,
  onDimensionChange,
  onRotateY,
  onRotateX,
  onDuplicate,
  onDelete
}) => {
  if (!selectedPrimitive) return null;

  const renderDimensionControl = (
    dimensionKey: 'width' | 'height' | 'depth' | 'radius',
    label: string
  ) => {
    const dimension = selectedPrimitive.config.dimensions[dimensionKey];
    if (!dimension) return null;

    return (
      <Stack spacing={1}>
        <Typography variant="body2">{label}</Typography>
        <Slider
          value={selectedPrimitive.currentDimensions[dimensionKey] || dimension.default}
          onChange={(_, value) => onDimensionChange(dimensionKey, value as number)}
          min={dimension.min}
          max={dimension.max}
          step={0.1}
          marks={[
            { value: dimension.min, label: `${dimension.min}` },
            { value: dimension.max, label: `${dimension.max}` }
          ]}
        />
      </Stack>
    );
  };

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        width: 300,
        p: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
      elevation={3}
    >
      <Stack spacing={3}>
        <Typography variant="h6">{selectedPrimitive.name} Controls</Typography>
        
        <Stack spacing={1}>
          <Typography variant="body2">Color</Typography>
          <Sketch
            style={{ width: '100%' }}
            color={selectedPrimitive.config.material.color}
            onChange={onColorChange}
          />
        </Stack>

        {/* Dimension Controls */}
        <Stack spacing={2}>
          <Typography variant="body2">Dimensions</Typography>
          {renderDimensionControl('width', 'Width')}
          {renderDimensionControl('height', 'Height')}
          {renderDimensionControl('depth', 'Depth')}
          {renderDimensionControl('radius', 'Radius')}
        </Stack>

        <Stack spacing={1}>
          <Typography variant="body2">Rotation</Typography>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button 
              variant="outlined"
              size="small"
              onClick={() => onRotateY(false)}
              startIcon={<Rotate90DegreesCcw />}
            >
              Y-Left
            </Button>
            <Button 
              variant="outlined"
              size="small"
              onClick={() => onRotateY(true)}
              startIcon={<Rotate90DegreesCw />}
            >
              Y-Right
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button 
              variant="outlined"
              size="small"
              onClick={() => onRotateX(false)}
              startIcon={<Rotate90DegreesCcw />}
            >
              X-Left
            </Button>
            <Button 
              variant="outlined"
              size="small"
              onClick={() => onRotateX(true)}
              startIcon={<Rotate90DegreesCw />}
            >
              X-Right
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button 
            variant="outlined" 
            onClick={onDuplicate}
          >
            Duplicate
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={onDelete}
          >
            Delete
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          Position: [{selectedPrimitive.position.join(', ')}]
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Type: {selectedPrimitive.type}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default ControlPanel; 