import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor:'#B0903D',
        color: '#ffffff', // dark gold text
        py: 2,
        mt: 4,
        textAlign: 'center',
        boxShadow: 1,
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Murang'a County Government. All rights reserved.
      </Typography>
      <Typography variant="caption" display="block">
        This platform ensures anonymous feedback submission. Your privacy is our priority.
      </Typography>
    </Box>
  );
}