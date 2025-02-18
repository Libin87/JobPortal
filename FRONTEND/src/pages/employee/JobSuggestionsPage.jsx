import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import axios from 'axios';
import NavbarEmployee from './NavbarEmployee';
import Footer from '../../components/Footer';

const JobSuggestionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resumeSkills, setResumeSkills] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await axios.get(`http://localhost:3000/employee/${userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const extractSkillsFromResume = (text) => {
    const skillGroups = [
      // Personal Traits & Objectives
      ['motivated', 'detail-oriented', 'eager to learn', 'team projects',
       'company goals', 'it company', 'reputable'],
      
      // Achievements & Leadership
      ['azure coordinator', 'technical fest', 'cultural fest',
       'council member', 'college council', 'nss volunteer',
       'national service scheme', 'ihrd', 'representative',
       'computer association', 'vice-president'],
      
      // Project - Movie Booking
      ['movie booking system', 'online platform', 'booking system',
       'user authentication', 'real-time', 'seat selection',
       'payment integration', 'comprehensive platform'],
      
      // Project - Home Automation
      ['home automation', 'flutter', 'arduino', 'mobile interface',
       'automation system', 'home appliances', 'system control'],
      
      // Certifications & Courses
      ['computer communication', 'networks', 'cs402',
       'modern database systems', 'cs403', 'database',
       'java programming', 'object-oriented programming', 'prdv410',
       'google cloud', 'technical series', 'cloud next'],
      
      // Education
      ['master of computer applications', 'mca', 'amal jyoti',
       'engineering', 'autonomous', 'bachelor of science',
       'computer science', 'college of applied science',
       'bsc', 'puthupally'],
      
      // Web Development
      ['web development', 'html', 'php', 'mysql', 'ajax',
       'javascript', 'web technologies'],
      
      // App Development
      ['app development', 'flutter', 'mobile development',
       'mobile interface'],
      
      // Programming Languages
      ['python', 'java', 'c', 'c++', 'alp',
       'programming languages'],
      
      // Tools & Software
      ['ms office', 'ms word', 'ms powerpoint',
       'office suite', 'arduino'],
      
      // Hobbies & Interests
      ['cricket', 'working out', 'movies',
       'sports', 'fitness'],
      
      // Soft Skills
      ['communication', 'teamwork', 'leadership',
       'volunteer work', 'coordination'],
      
      // Additional Keywords
      ['automation', 'development', 'implementation',
       'design', 'technical', 'engineering'],
      
      // Project Features
      ['authentication', 'real-time', 'integration',
       'system design', 'user interface', 'control system'],
      
      // Technical Areas
      ['web', 'mobile', 'automation', 'database',
       'programming', 'development', 'software']
    ];
    
    const textLower = text.toLowerCase();
    const matchedSkills = [];

    skillGroups.forEach(group => {
      const hasMatch = group.some(skill => textLower.includes(skill.toLowerCase()));
      if (hasMatch) {
        const groupMatches = group.filter(skill => 
          textLower.includes(skill.toLowerCase())
        );
        matchedSkills.push(...groupMatches);
      }
    });

    return [...new Set(matchedSkills)];
  };

  const fetchSuggestedJobs = async (resumeText, skills) => {
    try {
      const userId = sessionStorage.getItem('userId');
      const response = await axios.get(`http://localhost:3000/employee/${userId}`);
      const userProfile = response.data;

      const suggestionsResponse = await axios.post('http://localhost:3000/jobs/suggest-jobs', {
        resumeText: resumeText,
        skills: skills.join(','),
        experience: userProfile.experience || 0
      });

      const filteredJobs = suggestionsResponse.data.map(job => {
        const jobSkills = typeof job.skills === 'string' 
          ? job.skills.toLowerCase().split(',').map(s => s.trim())
          : Array.isArray(job.skills) 
            ? job.skills.map(s => s.toLowerCase())
            : [];
        
        const hasMatchingSkills = skills.some(resumeSkill => 
          jobSkills.some(jobSkill => 
            jobSkill.includes(resumeSkill.toLowerCase())
          )
        );

        const jobText = `${job.jobTitle} ${job.description}`.toLowerCase();
        const hasEducationMatch = [
          'computer applications',
          'computer science',
          'engineering',
          'mca',
          'bsc'
        ].some(edu => jobText.includes(edu));

        const matchScore = calculateMatchScore(job, userProfile);

        return {
          ...job,
          matchScore,
          hasMatchingSkills,
          hasEducationMatch
        };
      });

      setSuggestedJobs(filteredJobs);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching job suggestions:', err);
      setError('Failed to fetch job suggestions. Please try again.');
      setLoading(false);
    }
  };

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const skills = extractSkillsFromResume(text);
        setResumeSkills(skills);
        await fetchSuggestedJobs(text, skills);
      };
      reader.readAsText(file);
    }
  }, []);

  useEffect(() => {
    if (!location.state?.resumeText) {
      navigate('/employee');
      return;
    }

    const skills = extractSkillsFromResume(location.state.resumeText);
    setResumeSkills(skills);
    fetchSuggestedJobs(location.state.resumeText, skills);
  }, [location.state, navigate]);

  const renderSkills = (skills) => {
    if (!skills) return null;
    
    let skillsArray = [];
    if (Array.isArray(skills)) {
      skillsArray = skills;
    } else if (typeof skills === 'string') {
      skillsArray = skills.split(',').map(skill => skill.trim());
    } else {
      return null;
    }

    return skillsArray.map((skill, index) => (
      <Chip
        key={index}
        label={skill}
        sx={{ m: 0.5 }}
        size="small"
        color="primary"
        variant="outlined"
      />
    ));
  };

  const handleOpenDialog = (job) => {
    setSelectedJob(job);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedJob(null);
  };

  const calculateMatchScore = (job, profile) => {
    if (!profile) return 0;

    let score = 0;

    // Example criteria: Skills match
    const skillsMatch = job.skills.filter(skill => 
      profile.skills.includes(skill)
    ).length;
    const skillsScore = (skillsMatch / job.skills.length) * 50; // 50% weight

    // Example criteria: Experience match
    const experienceMatch = Math.min(profile.experience.years / job.experience.years, 1) * 50; // 50% weight

    // Calculate total score
    score = skillsScore + experienceMatch;

    return Math.round(score);
  };

  return (
    <div>
      <NavbarEmployee />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#4B647D', fontWeight: 'bold' }}>
          Personalized Job Suggestions
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        ) : suggestedJobs.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No job matches found. Please try updating your resume with more relevant skills.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {suggestedJobs.map((job) => (
              <Grid item xs={12} key={job._id}>
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 3,
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease-in-out'
                    }
                  }}
                >
                  <Typography variant="h6" color="primary" gutterBottom>
                    {job.jobTitle}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body1">
                        <strong>Company:</strong> {job.companyName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body1">
                        <strong>Location:</strong> {job.location}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body1">
                        <strong>Type:</strong> {job.jobType}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {job.description}
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Required Skills:
                    </Typography>
                    {renderSkills(job.skills)}
                  </Box>

                  <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                    Match Score: {job.matchScore}%
                  </Typography>

                  <Button 
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => handleOpenDialog(job)}
                  >
                    View Details
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Footer />

      {selectedJob && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Job Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              <strong>Job Title:</strong> {selectedJob.jobTitle}
            </Typography>
            <Typography variant="body1">
              <strong>Company:</strong> {selectedJob.companyName}
            </Typography>
            <Typography variant="body1">
              <strong>Match Score:</strong> {selectedJob.matchScore}%
            </Typography>
            {/* Add more fields as needed */}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default JobSuggestionsPage; 