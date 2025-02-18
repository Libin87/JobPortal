import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfileWarning = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        p: 3,
        bgcolor: '#fff3e0',
        borderRadius: 2,
        m: 4
      }}
    >
      <Typography variant="h5" color="warning.dark" gutterBottom>
        Company Profile Required
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Please create your company profile before accessing this feature.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/employerprofile')}
        sx={{
          bgcolor: '#360275',
          '&:hover': { bgcolor: '#2c0261' }
        }}
      >
        Create Profile
      </Button>
    </Box>
  );
};

export default ProfileWarning; 