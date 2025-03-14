import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease-in-out',
  },
}));

const JobSuggestions = () => {
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfileAndJobs();
  }, []);

  const fetchUserProfileAndJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get userId from session storage
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        setError('Please log in to see job suggestions');
        setLoading(false);
        return;
      }

      // Fetch user profile first
      const profileResponse = await axios.get(`/Employeeprofile/profile/${userId}`);
      const profile = profileResponse.data;
      console.log('Fetched user profile:', profile);
      setUserProfile(profile);

      if (!profile) {
        setError('Please complete your profile to see job suggestions');
        setLoading(false);
        return;
      }

      if (!profile.skills || profile.skills.length === 0) {
        setError('Please add skills to your profile to get job suggestions');
        setLoading(false);
        return;
      }

      // Prepare profile data for job matching
      const profileData = {
        resumeText: profile.resumeText || '',
        skills: Array.isArray(profile.skills) ? profile.skills : profile.skills.split(','),
        experience: {
          years: parseInt(profile.experienceYears) || 0,
          months: parseInt(profile.experienceMonths) || 0
        },
        jobPreferences: Array.isArray(profile.jobPreferences) ? profile.jobPreferences : profile.jobPreferences?.split(',') || []
      };

      console.log('Sending profile data for job matching:', profileData);

      // Get job suggestions using profile data
      const response = await axios.post('/jobs/suggest-jobs', profileData);
      console.log('Received job suggestions:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setSuggestedJobs(response.data);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid response from server');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error in job suggestion process:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch job suggestions. Please try again later.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleUpdateProfile = () => {
    navigate('/employee-profile'); // Navigate to profile update page
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ margin: 2 }}>
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
          Update Profile
        </Button>
      </Box>
    );
  }

  if (!userProfile) {
    return (
      <Box sx={{ margin: 2 }}>
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          Please complete your profile to see job suggestions. Make sure to add your skills, experience, and job preferences.
        </Alert>
        <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
          Complete Profile
        </Button>
      </Box>
    );
  }

  if (!suggestedJobs || suggestedJobs.length === 0) {
    return (
      <Box sx={{ margin: 2 }}>
        <Alert severity="info" sx={{ marginBottom: 2 }}>
          No matching jobs found at the moment. Try updating your profile with more skills and experience to improve job matches.
        </Alert>
        <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
          Update Profile
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ margin: 2 }}>
        Suggested Jobs Based on Your Profile
      </Typography>
      {suggestedJobs.map((job) => (
        <StyledCard key={job._id}>
          <Typography variant="h6" gutterBottom>
            {job.jobTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Match Score: {Math.round(job.score * 100)}%
          </Typography>
          <Typography variant="body1" gutterBottom>
            Company: {job.companyName}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Location: {job.location}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Salary: {job.salary}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Experience Required: {job.experience?.years} years {job.experience?.months} months
          </Typography>
          <Typography variant="body2" gutterBottom>
            Required Skills: {Array.isArray(job.skills) ? job.skills.join(', ') : job.skills}
          </Typography>
          {job.matchReasons && job.matchReasons.length > 0 && (
            <Box mt={1}>
              <Typography variant="subtitle2" color="primary">
                Why this matches your profile:
              </Typography>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {job.matchReasons.map((reason, index) => (
                  <li key={index}>
                    <Typography variant="body2">{reason}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </StyledCard>
      ))}
    </Box>
  );
};

export default JobSuggestions; 