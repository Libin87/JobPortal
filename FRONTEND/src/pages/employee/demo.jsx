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
  Divider,
  AlertTitle,
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

const EmployeePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tests, setTests] = useState([]);
  const [hasPendingTests, setHasPendingTests] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState('');
  const [uploadedResume, setUploadedResume] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [atsScore, setAtsScore] = useState(null);
  const [atsMessage, setAtsMessage] = useState('');
  const [showAtsAlert, setShowAtsAlert] = useState(false);
  const [showResumeWarning, setShowResumeWarning] = useState(false);
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
    if (!role || role !== 'employee') {
      navigate('/login');
    }

    const fetchPendingTests = async () => {
      try {
        const employeeId = sessionStorage.getItem('userId');
        
        // First, check for applications with pending test status
        const applicationsResponse = await axios.get(
          `http://localhost:3000/jobs/applications1`,
          {
            params: {
              userId: employeeId,
              testStatus: 'Pending'
            }
          }
        );

        console.log('Applications response:', applicationsResponse.data);

        if (applicationsResponse.data && applicationsResponse.data.length > 0) {
          setHasPendingTests(true);
          
          // If there are pending applications, fetch the associated tests
          const testsResponse = await axios.get(
            `http://localhost:3000/test/employee-tests/${employeeId}`
          );
          
          console.log('Tests response:', testsResponse.data);
          
          if (testsResponse.data.hasTests) {
            setTests(testsResponse.data.tests);
          } else {
            setTests([]);
          }
        } else {
          setHasPendingTests(false);
          setTests([]);
        }
      } catch (error) {
        console.error('Error fetching pending tests:', error);
        setHasPendingTests(false);
        setTests([]);
      }
    };

    fetchPendingTests();
  }, [navigate]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

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
        setShowAtsAlert(true);
        return false;
      } else if (finalScore >= 50 && finalScore < 60) {
        setAtsMessage(`Your fresher resume is good (${finalScore.toFixed(1)}%) but can be better. ${detailedFeedback}`);
        setShowAtsAlert(true);
        return true;
      } else {
        setAtsMessage(`Excellent fresher resume! Score: ${finalScore.toFixed(1)}%. ${detailedFeedback}`);
        setShowAtsAlert(true);
        return true;
      }
    } catch (error) {
      console.error('Resume Analysis Error:', error);
      setAtsMessage('Failed to analyze resume. Please try again or contact support.');
      setShowAtsAlert(true);
      return false;
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('document')) {
      setAtsMessage('Please upload a PDF or Word document');
      setShowAtsAlert(true);
      return;
    }

    setUploadProgress(true);
    const formData = new FormData();
    formData.append('resume', file);
    const userId = sessionStorage.getItem('userId');
    formData.append('userId', userId);

    try {
      console.log('Uploading resume file:', file.name);
      
      const response = await axios.post('http://localhost:3000/employee/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000 // 30 second timeout
      });

      console.log('Upload response:', response.data);

      if (!response.data.resumeText) {
        throw new Error('No resume text received from server');
      }

      setUploadedResume(file.name);
      setResumeText(response.data.resumeText);
      
      // Check ATS score before proceeding
      const passedATS = await checkATSScore(response.data.resumeText);
      
      if (passedATS) {
        // Only get suggestions if ATS score is acceptable
        handleGetSuggestions(response.data.resumeText);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Failed to upload resume. ';
      if (error.response?.status === 413) {
        errorMessage += 'File is too large.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage += 'Upload timed out.';
      } else {
        errorMessage += 'Please try again or contact support.';
      }
      
      setAtsMessage(errorMessage);
      setShowAtsAlert(true);
    } finally {
      setUploadProgress(false);
    }
  };

  const handleGetSuggestions = async (resumeContent = '') => {
    if (!uploadedResume) {
      setShowResumeWarning(true);
      setTimeout(() => setShowResumeWarning(false), 3000);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const userId = sessionStorage.getItem('userId');
      
      // Check if ATS score is already calculated and sufficient
      if (atsScore >= 50) {
        navigate('/job-suggestions', { 
          state: { 
            resumeText: resumeContent || resumeText,
            atsScore: atsScore
          } 
        });
        return;
      }

      // If no ATS score or insufficient score, show warning
      setAtsMessage('Please ensure your resume passes the ATS check first.');
      setShowAtsAlert(true);
      
    } catch (err) {
      console.error('Error:', err);
      setSuggestionError('Failed to process request. Please try again.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

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

  return (
    <div>
      <NavbarEmployee />
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
            <Link to="/savedJobs" style={{ textDecoration: 'none' }}>
              <Button variant="contained" fullWidth style={{ backgroundColor: '#00CCCD' }}>
                Find ATS Score
              </Button>
            </Link>
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

        <Grid container spacing={3} justifyContent="center">
          {/* Resume Upload Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upload Resume
                </Typography>
                <input
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  id="resume-upload"
                  type="file"
                  onChange={handleResumeUpload}
                />
                <label htmlFor="resume-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                  >
                    {uploadedResume ? 'Change Resume' : 'Upload Resume'}
                  </Button>
                </label>
                {uploadedResume && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Uploaded: {uploadedResume}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Get Suggestions Button */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Get Personalized Jobs
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleGetSuggestions()}
                  startIcon={<AssessmentIcon />}
                  fullWidth
                  disabled={loadingSuggestions}
                >
                  {loadingSuggestions ? 'Getting Suggestions...' : 'Get Job Suggestions'}
                </Button>
                {suggestionError && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {suggestionError}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Job Suggestions Section */}
        <Fade in={suggestedJobs.length > 0}>
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                color: '#4B647D',
                fontWeight: 'bold',
                borderBottom: '2px solid #4B647D',
                pb: 1
              }}
            >
              Recommended Jobs Based on Your Resume
            </Typography>
            <Grid container spacing={2}>
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
                          Company: {job.companyName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body1">
                          Location: {job.location}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body1">
                          Type: {job.jobType}
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

                    <Button 
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mt: 2 }}
                      href={`/job-details/${job._id}`}
                    >
                      View Details
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      </Container>

      {/* Dialog for Tests */}
      <Dialog open={openPopup} onClose={handleClosePopup} maxWidth="md" fullWidth>
        <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
          Pending Selection Tests
        </DialogTitle>
        <DialogContent>
          {tests.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Test Name</TableCell>
                    <TableCell>Job Title</TableCell>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Duration (mins)</TableCell>
                    <TableCell>Total Marks</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test._id}>
                      <TableCell>{test.testName}</TableCell>
                      <TableCell>{test.jobTitle}</TableCell>
                      <TableCell>{test.companyName}</TableCell>
                      <TableCell>{test.duration}</TableCell>
                      <TableCell>{test.totalMarks}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleTakeTest(test._id)}
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
            <Typography align="center" style={{ padding: '20px' }}>
              No pending tests available at the moment.
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default EmployeePage;
