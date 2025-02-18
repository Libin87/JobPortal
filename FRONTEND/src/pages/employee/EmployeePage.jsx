import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Alert,
  Chip,
  CircularProgress,
  IconButton,
  Fade,
  Backdrop,
  LinearProgress,
  Card,
  CardContent,
  CardActions,
  Divider,
  AlertTitle,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Link, useNavigate } from 'react-router-dom';
import NavbarEmployee from './NavbarEmployee';
import Footer from '../../components/Footer';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SendIcon from '@mui/icons-material/Send';
import toast, { Toaster } from 'react-hot-toast';
import BusinessIcon from '@mui/icons-material/Business';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { formatDate } from '../../utils/dateFormatter';

const EmployeePage = () => {
  const [userId] = useState(sessionStorage.getItem('userId'));
  const [tests, setTests] = useState([]);
  const [hasPendingTests, setHasPendingTests] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [atsScore, setAtsScore] = useState(null);
  const [atsMessage, setAtsMessage] = useState('');
  const [showAtsAlert, setShowAtsAlert] = useState(false);
  const [showResumeWarning, setShowResumeWarning] = useState(false);
  const [openAtsDialog, setOpenAtsDialog] = useState(false);
  const [formData, setFormData] = useState({
    skills: [],
    experience: '',
    jobPreferences: []
  });
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  const RESUME_CRITERIA = {
    keywords: [
      // Contact & Personal Info
      'email', 'phone', 'linkedin',
      'date of birth', 'gender', 'nationality',
      'languages', 'english', 'malayalam',
      'kerala', 'indian',
      
      // Educational Qualifications
      'master of computer applications', 'mca',
      'bachelor of computer applications', 'bca',
      'plus two', 'tenth',
      'cgpa', 'ktu university',
      'bangalore north university',
      'amal jyothi college',
      'autonomous', 'engineering',
      'kerala state board',
      
      // Technical Skills
      'web development', 'mern stack',
      'html', 'css', 'javascript', 'react',
      'node js', 'mysql', 'mongodb',
      'python', 'c', 'c++',
      'windows', 'linux',
      'full stack development',
      
      // Projects
      'careerconnect', 'autocare hub',
      'edutrack', 'management system',
      'service management',
      'student management',
      
      // Professional Traits
      'dedicated', 'committed',
      'honest', 'hard working',
      'team player', 'leadership',
      'communication skills',
      'positive attitude',
      'competitive', 'challenging',
      
      // Certifications & Achievements
      'ict academy', 'nptel',
      'internet of things',
      'full stack', 'specialist',
      'azure coordinator',
      'cultural fest',
      
      // Hobbies
      'cycling', 'swimming',
      
      // Career Keywords
      'career objective',
      'growth', 'success',
      'organization',
      'knowledge', 'contribute'
    ],
    
    sections: [
      'contact details',
      'technical skills',
      'career objective',
      'achievements',
      'certifications',
      'personal details',
      'education',
      'projects',
      'hobbies'
    ],
    
    actionVerbs: [
      'contributed', 'served',
      'developed', 'managed',
      'certified', 'organized',
      'executed', 'working',
      'adapt', 'contribute'
    ],

    industryPatterns: {
      contact: [
        /\+91\s*\d{10}/,                    // Phone
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i,  // Email
        /linkedin\.com\/in\/[\w-]+/i,        // LinkedIn
        /kerala|kottayam|pin:\s*\d{6}/i      // Address
      ],
      education: [
        /(?:cgpa|percentage):\s*\d+\.?\d*/i,  // CGPA/Percentage
        /(?:20\d\d-20\d\d|20\d\d)/i,         // Year
        /(?:university|college|school)/i,      // Institution
        /(?:mca|bca|plus two|tenth)/i         // Qualification
      ],
      skills: [
        /html|css|javascript|react|node|python|c\+\+/i,  // Technical skills
        /mern stack|full stack/i,                        // Stack
        /windows|linux/i                                 // OS
      ],
      projects: [
        /scope\s*:/i,                        // Project scope
        /project|system/i,                   // Project keywords
        /management system/i                 // System type
      ]
    }
  };

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (!userId || role !== 'employee') {
      navigate('/login');
      return;
    }

    fetchProfileAndSuggest();

    const fetchPendingTests = async () => {
      try {
        const employeeId = sessionStorage.getItem('userId');
        console.log('Fetching tests for employee:', employeeId);
        
        // First, get all applications for this user
        const applicationsResponse = await axios.get(
          `http://localhost:3000/jobs/employee-applications`,
          {
            params: { userId: employeeId }
          }
        );

        console.log('Applications found:', applicationsResponse.data);

        // Filter applications that require tests
        const applicationsWithTests = applicationsResponse.data.filter(
          app => app.testStatus === 'Pending'
        );

        if (applicationsWithTests.length > 0) {
          setHasPendingTests(true);
          
          // Get test details for these applications
          const testsResponse = await axios.get(
            `http://localhost:3000/test/pending-tests/${employeeId}`
          );
          
          console.log('Tests found:', testsResponse.data);
          
          if (testsResponse.data && testsResponse.data.length > 0) {
            setTests(testsResponse.data.map(test => ({
              ...test,
              jobTitle: test.jobTitle || 'Not specified',
              companyName: test.companyName || 'Not specified'
            })));
          } else {
            setTests([]);
          }
        } else {
          setHasPendingTests(false);
          setTests([]);
        }
      } catch (error) {
        console.error('Error fetching pending tests:', error);
        toast.error('Failed to fetch pending tests');
        setHasPendingTests(false);
        setTests([]);
      }
    };

    fetchPendingTests();
  }, [navigate, userId]);

  const handleNotificationClick = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleTakeTest = (testId) => {
    navigate(`/take-test/${testId}`);
  };

  const checkATSScore = async (resumeText) => {
    try {
      console.log('Analyzing fresher resume:', resumeText.substring(0, 100) + '...'); 
      
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error('Resume text is empty or invalid');
      }

      const resumeLower = resumeText.toLowerCase();
      let scores = {
        keywords: 0,
        sections: 0,
        actionVerbs: 0,
        patterns: 0
      };

      // Scoring logic
      RESUME_CRITERIA.keywords.forEach(keyword => {
        if (resumeLower.includes(keyword.toLowerCase())) {
          scores.keywords += 1;
        }
      });

      RESUME_CRITERIA.sections.forEach(section => {
        if (resumeLower.includes(section.toLowerCase())) {
          scores.sections += 1;
        }
      });

      RESUME_CRITERIA.actionVerbs.forEach(verb => {
        if (resumeLower.includes(verb.toLowerCase())) {
          scores.actionVerbs += 1;
        }
      });

      Object.values(RESUME_CRITERIA.industryPatterns).forEach(patternList => {
        patternList.forEach(pattern => {
          if (pattern.test(resumeText)) {
            scores.patterns += 1;
          }
        });
      });

      // Calculate scores with updated weights
      const keywordScore = (scores.keywords / RESUME_CRITERIA.keywords.length) * 100;
      const sectionScore = (scores.sections / RESUME_CRITERIA.sections.length) * 100;
      const verbScore = (scores.actionVerbs / RESUME_CRITERIA.actionVerbs.length) * 100;
      const patternScore = (scores.patterns / 12) * 100; // Updated pattern count

      const finalScore = (
        keywordScore * 0.35 +     // 35% weight for keywords
        sectionScore * 0.30 +     // 30% weight for sections
        verbScore * 0.20 +        // 20% weight for action verbs
        patternScore * 0.15       // 15% weight for patterns
      );

      setAtsScore(finalScore);

      // Generate feedback
      let feedback = [];
      if (keywordScore < 60) feedback.push('Add more relevant technical skills and qualifications');
      if (sectionScore < 60) feedback.push('Ensure all important sections are properly labeled');
      if (verbScore < 60) feedback.push('Use more action words to describe your achievements and projects');
      if (patternScore < 60) feedback.push('Include contact details and education information in proper format');

      let detailedFeedback = `
        Skills & Qualifications: ${keywordScore.toFixed(1)}%
        Resume Structure: ${sectionScore.toFixed(1)}%
        Achievement Descriptions: ${verbScore.toFixed(1)}%
        Information Format: ${patternScore.toFixed(1)}%\n
        ${feedback.length > 0 ? 'Suggestions to improve:\n' + feedback.join('\n') : 'Excellent resume format!'}
      `;

      if (finalScore < 50) {
        setAtsMessage(`Your fresher resume needs more details (${finalScore.toFixed(1)}%). ${detailedFeedback}`);
        return false;
      } else if (finalScore >= 50 && finalScore < 60) {
        setAtsMessage(`Your fresher resume is good (${finalScore.toFixed(1)}%) but can be better. ${detailedFeedback}`);
        return true;
      } else {
        setAtsMessage(`Excellent fresher resume! Score: ${finalScore.toFixed(1)}%. ${detailedFeedback}`);
        return true;
      }
    } catch (error) {
      console.error('Resume Analysis Error:', error);
      setAtsMessage('Failed to analyze resume. Please try again or contact support.');
      return false;
    }
  };

  const fileInputProps = {
    accept: '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    style: { display: 'none' }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx'];

    if (!allowedExtensions.includes(fileExtension)) {
      setAtsMessage('Please upload a valid PDF or Word document (pdf, doc, or docx)');
      setShowAtsAlert(true);
      return;
    }

    // Log file details for debugging
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      extension: fileExtension
    });

    setUploadProgress(true);
    setShowResumeWarning(false);
    
    const formData = new FormData();
    formData.append('resume', file);
    const userId = sessionStorage.getItem('userId');
    formData.append('userId', userId);

    try {
      const response = await axios.post('http://localhost:3000/employee/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000
      });

      if (!response.data.resumeText) {
        throw new Error('No resume text received from server');
      }

      setUploadedResume(file.name);
      setResumeText(response.data.resumeText);
      setUploadProgress(false);
      setShowResumeWarning(false);
      
      // Analyze the resume immediately after upload
      await checkATSScore(response.data.resumeText);
      
    } catch (error) {
      console.error('Resume upload error:', error);
      setUploadProgress(false);
      setAtsMessage(
        error.response?.data?.message || 
        'Failed to upload resume. Please try again.'
      );
      setShowAtsAlert(true);
    }
  };

  const handleApply = async (job) => {
    console.log('Starting application process for job:', job.jobTitle);
    try {
      const userId = sessionStorage.getItem('userId');
      console.log('User ID:', userId);
      
      if (!userId) {
        console.log('No user ID found - redirecting to login');
        toast.error('Please login to apply for jobs');
        navigate('/login');
        return;
      }

      // Show loading toast
      const loadingToastId = toast.loading('Checking application status...');

      console.log('Checking if already applied...');
      const checkResponse = await axios.get(`http://localhost:3000/jobs/check-application`, {
        params: { 
          userId: userId,
          jobId: job._id 
        }
      });

      if (checkResponse.data.hasApplied) {
        console.log('User has already applied for this job');
        toast.dismiss(loadingToastId);
        
        toast.error(
          <div style={{ padding: '8px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Already Applied</div>
            <div>You have already submitted an application for {job.jobTitle}</div>
            <button 
              onClick={() => navigate('/jobApplications')}
              style={{
                marginTop: '8px',
                background: 'none',
                border: 'none',
                color: '#d32f2f',
                cursor: 'pointer',
                padding: '4px 8px',
                textDecoration: 'underline'
              }}
            >
              View Application
            </button>
          </div>,
          { duration: 5000 }
        );
        return;
      }

      // Update loading message
      toast.loading('Submitting your application...', {
        id: loadingToastId,
      });

      console.log('Submitting application...');
      const applicationData = {
        userId: userId,
        jobId: job._id,
        jobTitle: job.jobTitle,
        companyName: job.companyName
      };

      console.log('Application data:', applicationData);

      const response = await axios.post(
        `http://localhost:3000/jobs/apply-suggestion`, 
        applicationData
      );

      console.log('Application response:', response.data);
      toast.dismiss(loadingToastId);

      if (response.data.message) {
        console.log('Application submitted successfully');
        toast.success(
          <div style={{ padding: '8px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Application Submitted!</div>
            <div>Successfully applied for {job.jobTitle}</div>
            <button 
              onClick={() => navigate('/jobApplications')}
              style={{
                marginTop: '8px',
                background: 'none',
                border: 'none',
                color: '#2e7d32',
                cursor: 'pointer',
                padding: '4px 8px',
                textDecoration: 'underline'
              }}
            >
              View Applications
            </button>
          </div>,
          { duration: 5000 }
        );
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(
        <div style={{ padding: '8px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Application Failed</div>
          <div>{error.response?.data?.message || 'Failed to submit application. Please try again.'}</div>
        </div>,
        { duration: 4000 }
      );
    }
  };

  const handleAtsButtonClick = () => {
    setOpenAtsDialog(true);
    setUploadedResume(null);
    setAtsScore(null);
  };

  const handleCloseAtsDialog = () => {
    setOpenAtsDialog(false);
  };

  const JobSuggestionCard = ({ job, onApply }) => {
    // Add a click handler function
    const handleApplyClick = () => {
      console.log('Apply button clicked for job:', job.jobTitle);
      onApply(job); // Call the parent's onApply function
    };

    return (
      <Card sx={{ 
        mb: 3, 
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
        }
      }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {job.logoUrl ? (
                  <Avatar 
                    src={`http://localhost:3000/${job.logoUrl}`}
                    alt={job.companyName}
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mr: 2,
                      border: '2px solid #eee'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/company-default.png";
                    }}
                  />
                ) : (
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mr: 2,
                      bgcolor: 'primary.light'
                    }}
                  >
                    <BusinessIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                )}
                <Box>
                  <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                    {job.jobTitle}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {job.companyName}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon color="action" />
                    <Typography variant="body1">{job.location}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon color="action" />
                    <Typography variant="body1">
                      {`${job.experience.years}y ${job.experience.months}m`}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CurrencyRupeeIcon color="action" />
                    <Typography variant="body1">
                      {job.salary}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon color="action" />
                    <Typography variant="body1">
                      Apply by: {formatDate(job.lastDate)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  color="primary" 
                  sx={{ 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <WorkIcon fontSize="small" />
                  Required Skills
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  mt: 1 
                }}>
                  {Array.isArray(job.skills) && job.skills.length > 0 ? (
                    job.skills.map((skill, index) => (
      <Chip
        key={index}
        label={skill}
                        color={job.matchedSkills?.includes(skill.toLowerCase()) ? "success" : "default"}
                        variant={job.matchedSkills?.includes(skill.toLowerCase()) ? "filled" : "outlined"}
        size="small"
                        icon={job.matchedSkills?.includes(skill.toLowerCase()) ? <CheckCircleIcon /> : undefined}
                        sx={{
                          '& .MuiChip-label': {
                            fontWeight: 500
                          },
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 1
                          }
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No specific skills listed
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                  Why this matches you:
                </Typography>
                <List dense>
                  {job.matchReasons.map((reason, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={reason}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: 'text.secondary'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>

        <CardActions sx={{ p: 2, justifyContent: 'flex-end', borderTop: '1px solid #eee' }}>
          <Button
            variant="contained"
            onClick={handleApplyClick}
            sx={{
              backgroundColor: '#360275',
              color: 'white',
              padding: '10px 30px',
              '&:hover': {
                backgroundColor: '#4a0b99',
                transform: 'scale(1.02)',
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
              transition: 'all 0.2s ease',
              fontWeight: 'bold',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 6px rgba(54, 2, 117, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SendIcon />
              Apply Now
            </Box>
          </Button>
        </CardActions>
      </Card>
    );
  };

  const fetchProfileAndSuggest = async () => {
    try {
      if (!userId) return;

      const profileResponse = await axios.get(`http://localhost:3000/Employeeprofile/profile/${userId}`);
      const profile = profileResponse.data;
      setProfileData(profile);

      // Make sure skills are properly formatted
      const jobSuggestionData = {
        resumeText: profile.resume || '',
        skills: profile.skills || [], // Ensure skills is an array
        experience: profile.experience || '',
        jobPreferences: profile.jobPreferences || []
      };

      setLoadingSuggestions(true);
      const suggestionsResponse = await axios.post(
        'http://localhost:3000/jobs/suggest-jobs',
        jobSuggestionData
      );

      setSuggestedJobs(suggestionsResponse.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile data');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
    <div>
      <NavbarEmployee />
      <Toaster position="top-center" />
      <Container
        style={{
          maxWidth: '100rem',
          marginTop: '50px',
          backgroundColor: '#4B647D',
          borderRadius: '20px',
          padding: '40px 100px',
          minHeight: '15rem',
        }}
      >
        <Typography
          variant="h4"
          style={{ fontWeight: 'bolder', color: 'aliceblue', textAlign: 'center' }}
        >
          EMPLOYEE DASHBOARD
        </Typography>

        <Grid container spacing={3} justifyContent="center" style={{ marginTop: '20px' }}>
          <Grid item xs={12} sm={4} md={3}>
            <Link to="/employeeProfile" style={{ textDecoration: 'none' }}>
              <Button variant="contained" fullWidth style={{ backgroundColor: '#0D6EFD' }}>
                Profile
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Link to="/jobApplications" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="secondary" fullWidth>
                Job Applications
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Button
              variant="contained"
              fullWidth
              style={{ 
                backgroundColor: 'green', 
                position: 'relative',
              }}
              onClick={handleNotificationClick}
            >
              Notifications
              {hasPendingTests && (
                <span
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: red[500],
                    borderRadius: '50%',
                    display: 'block'
                  }}
                />
              )}
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Button 
              variant="contained" 
              fullWidth 
              style={{ backgroundColor: '#00CCCD' }}
              onClick={handleAtsButtonClick}
            >
              Find ATS Score
              </Button>
          </Grid>
        </Grid>
      </Container>


      <Container style={{ marginTop: '30px', marginBottom: '30px', borderRadius: '50px', maxWidth: '84.5%' }}>
        {showAtsAlert && (
          <Card 
            elevation={3} 
            sx={{ 
              mb: 3,
              background: atsScore < 50 ? '#FDE8E8' : 
                         atsScore < 60 ? '#FFF4E5' : 
                         '#E8F5E9',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            <CardContent>
              <Grid container spacing={3}>
                {/* Overall Score Section */}
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Overall ATS Score
                    </Typography>
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'inline-flex',
                        width: 120,
                        height: 120,
                      }}
                    >
                      <CircularProgress
                        variant="determinate"
                        value={atsScore}
                        size={120}
                        thickness={4}
                        sx={{
                          color: atsScore < 50 ? 'error.main' :
                                 atsScore < 60 ? 'warning.main' :
                                 'success.main'
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant="h4"
                          component="div"
                          color="text.secondary"
                        >
                          {`${Math.round(atsScore)}%`}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        mt: 2,
                        color: atsScore < 50 ? 'error.main' :
                               atsScore < 60 ? 'warning.main' :
                               'success.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      {atsScore < 50 ? (
                        <><ErrorIcon /> Not Passing</>
                      ) : atsScore < 60 ? (
                        <><WarningIcon /> Needs Improvement</>
                      ) : (
                        <><CheckCircleIcon /> Excellent</>
                      )}
                    </Typography>
                  </Box>
                </Grid>

                {/* Detailed Scores Section */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Detailed Analysis
                    </Typography>
                    
                    {/* Skills & Keywords Score */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Skills & Keywords</Typography>
                        <Typography variant="body2">{`${Math.round((atsScore * 0.35))}%`}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={atsScore * 0.35}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    {/* Resume Structure Score */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Resume Structure</Typography>
                        <Typography variant="body2">{`${Math.round((atsScore * 0.25))}%`}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={atsScore * 0.25}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    {/* Experience Description Score */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Experience Description</Typography>
                        <Typography variant="body2">{`${Math.round((atsScore * 0.25))}%`}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={atsScore * 0.25}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    {/* Format & Structure Score */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Format & Structure</Typography>
                        <Typography variant="body2">{`${Math.round((atsScore * 0.15))}%`}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={atsScore * 0.15}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Improvement Suggestions */}
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Suggestions for Improvement:
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {atsMessage.split('\n').map((line, index) => (
                        line.trim() && (
                          <Typography 
                            key={index} 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: 1,
                              mb: 0.5 
                            }}
                          >
                            <TrendingUpIcon fontSize="small" />
                            {line}
                          </Typography>
                        )
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {showResumeWarning && (
          <Fade in={showResumeWarning}>
            <Alert 
              severity="warning"
              sx={{ 
                mt: 2, 
                mb: 2,
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                minWidth: '300px'
              }}
            >
              <AlertTitle>Resume Required</AlertTitle>
              Please upload your resume first to get personalized job suggestions
            </Alert>
          </Fade>
        )}

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box 
            sx={{ 
              textAlign: 'center',
              mt: 4,
              mb: 3,
              position: 'relative'
            }}
          >
            <Typography 
              variant="h4" 
              sx={{
                color: '#360275',
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '4px',
                  background: 'linear-gradient(90deg, #360275 0%, #7b1fa2 100%)',
                  borderRadius: '2px'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -15,
                  left: -20,
                  width: '40px',
                  height: '40px',
                  background: 'radial-gradient(circle, rgba(54,2,117,0.1) 0%, rgba(54,2,117,0) 70%)',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }
              }}
            >
              Personalized Job Suggestions
              <Box 
                component="span" 
                sx={{ 
                  position: 'absolute',
                  right: -30,
                  top: -10,
                  fontSize: '1.5rem',
                  color: '#7b1fa2',
                  transform: 'rotate(30deg)'
                }}
              >
                ✨
              </Box>
            </Typography>
          </Box>

          {/* Add keyframes for the pulse animation */}
          <style>
            {`
              @keyframes pulse {
                0% { transform: scale(1); opacity: 0.5; }
                50% { transform: scale(1.2); opacity: 0.8; }
                100% { transform: scale(1); opacity: 0.5; }
              }
            `}
          </style>

          {loadingSuggestions ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : suggestedJobs.length > 0 ? (
            <Grid container spacing={3}>
              {suggestedJobs.map((job) => (
                <Grid item xs={12} key={job._id}>
                  <JobSuggestionCard 
                    job={job} 
                    onApply={(job) => {
                      console.log('Parent onApply called with job:', job.jobTitle);
                      handleApply(job);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">
              {!profileData ? (
                "Loading profile data..."
              ) : !profileData.resume ? (
                "Please upload your resume in the profile section to get job suggestions"
              ) : (
                "No matching jobs found at the moment. Please check back later."
              )}
            </Typography>
          )}
        </Container>
      </Container>

      {/* Dialog for Tests */}
      <Dialog 
        open={openPopup} 
        onClose={handleClosePopup} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle 
          style={{ 
            textAlign: 'center', 
            fontWeight: 'bold',
            backgroundColor: '#360275',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6">Pending Selection Tests</Typography>
          <IconButton onClick={handleClosePopup} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {tests.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Test Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Job Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total Marks</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow 
                      key={test._id}
                      sx={{ '&:hover': { backgroundColor: '#f8f8f8' } }}
                    >
                      <TableCell>{test.testName}</TableCell>
                      <TableCell>{test.jobTitle}</TableCell>
                      <TableCell>{test.companyName}</TableCell>
                      <TableCell>{test.duration} mins</TableCell>
                      <TableCell>{test.totalMarks} marks</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleTakeTest(test._id)}
                          startIcon={<AssessmentIcon />}
                          sx={{
                            bgcolor: '#360275',
                            '&:hover': { bgcolor: '#4a0ba8' }
                          }}
                        >
                          Take Test
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ 
              p: 4, 
              textAlign: 'center',
              backgroundColor: '#f8f8f8',
              borderRadius: 2
            }}>
              <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Pending Tests
            </Typography>
              <Typography color="text.secondary">
                You don't have any pending tests at the moment.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog 
        open={openAtsDialog} 
        onClose={handleCloseAtsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#00CCCD', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Resume ATS Analysis
          <IconButton onClick={handleCloseAtsDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <input
              {...fileInputProps}
              id="ats-resume-upload"
              type="file"
              onChange={handleResumeUpload}
            />
            <label htmlFor="ats-resume-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{
                  bgcolor: '#00CCCD',
                  '&:hover': { bgcolor: '#00A9A9' }
                }}
              >
                {uploadedResume ? 'Upload New Resume' : 'Upload Resume'}
              </Button>
            </label>
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Upload your resume in PDF or Word format to analyze ATS compatibility
            </Typography>
          </Box>

          {uploadedResume && (
            <Box sx={{ mt: 2 }}>
              {uploadProgress ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="h4" gutterBottom>
                        {`${Math.round(atsScore || 0)}%`}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        Overall Score
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                          variant="determinate"
                          value={atsScore}
                          size={120}
                          thickness={4}
                          sx={{
                            color: atsScore < 50 ? 'error.main' :
                                   atsScore < 60 ? 'warning.main' :
                                   'success.main'
                          }}
                        />
                        <Box sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Typography variant="h6" component="div">
                            {`${Math.round(atsScore)}%`}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Overall Score
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                      Detailed Analysis
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Skills & Keywords</Typography>
                        <Typography variant="body2">{`${Math.round((atsScore * 0.35))}%`}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={atsScore * 0.35}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Resume Structure</Typography>
                        <Typography variant="body2">{`${Math.round((atsScore * 0.25))}%`}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={atsScore * 0.25}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Experience Description</Typography>
                        <Typography variant="body2">{`${Math.round((atsScore * 0.25))}%`}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={atsScore * 0.25}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Format & Structure</Typography>
                        <Typography variant="body2">{`${Math.round((atsScore * 0.15))}%`}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={atsScore * 0.15}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                      Suggestions for Improvement
                    </Typography>
                    
                    <Box sx={{ mt: 2, bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {atsScore < 50 
                          ? 'Your fresher resume needs more details' 
                          : atsScore < 60 
                            ? 'Your resume could use some improvements'
                            : 'Your resume is well-optimized'
                        } ({Math.round(atsScore)}%)
                      </Typography>

                      <Box sx={{ my: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Detailed Breakdown:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Skills & Qualifications: {Math.round(atsScore * 0.35)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Resume Structure: {Math.round(atsScore * 0.25)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Achievement Descriptions: {Math.round(atsScore * 0.25)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Information Format: {Math.round(atsScore * 0.15)}%
                        </Typography>
                      </Box>

                      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                        Suggestions to improve:
                      </Typography>
                      
                      <Box sx={{ pl: 2 }}>
                        {atsMessage.split('\n').map((line, index) => (
                          line.trim() && !line.includes(':') && !line.includes('%') && (
                            <Typography 
                              key={index} 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 1,
                                mb: 1
                              }}
                            >
                              <TrendingUpIcon fontSize="small" sx={{ color: 'primary.main' }} />
                              {line}
                            </Typography>
                          )
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default EmployeePage;
