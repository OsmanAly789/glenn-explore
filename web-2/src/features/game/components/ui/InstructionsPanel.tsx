import React from 'react';
import { Box, Typography } from '@mui/material';

const InstructionsPanel: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: 2,
        borderRadius: 1,
        fontSize: '14px'
      }}
    >
      <Typography variant="body2">
        Click + to open inventory<br />
        Select an item first<br />
        Click on map to place object<br />
        Click an object to select it<br />
        Use WASD to move horizontally<br />
        Use Q/E to move up/down<br />
        Delete key removes selected object
      </Typography>
    </Box>
  );
};

export default InstructionsPanel; 