import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import axios from 'axios';

const JobSuggestions = ({ resumeText, skills, experience }) => {
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleGetSuggestions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/jobs/suggest-jobs', {
        resumeText,
        skills,
        experience
      });
      setSuggestedJobs(response.data);
      setOpen(true);
    } catch (err) {
      setError('Failed to get job suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGetSuggestions}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Get Job Suggestions'}
      </Button>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#4B647D', 
          color: 'white',
          textAlign: 'center'
        }}>
          Suggested Jobs Based on Your Profile
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            {suggestedJobs.map((job) => (
              <Grid item xs={12} key={job._id}>
                <Card 
                  sx={{ 
                    '&:hover': { 
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease-in-out'
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="div" color="primary" gutterBottom>
                      {job.jobTitle}
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={4}>
                        <Box display="flex" alignItems="center">
                          <BusinessIcon sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            {job.companyName}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box display="flex" alignItems="center">
                          <LocationOnIcon sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            {job.location}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box display="flex" alignItems="center">
                          <WorkIcon sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            {job.jobType}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {job.description}
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Required Skills:
                      </Typography>
                      {job.skills.split(',').map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill.trim()}
                          sx={{ m: 0.5 }}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary"
                      variant="contained"
                      href={`/job-details/${job._id}`}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobSuggestions; 