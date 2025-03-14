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
import toast, { Toaster } from 'react-hot-toast';
import { formatDate } from '../../utils/dateFormatter';
import moment from 'moment';
import { alpha } from '@mui/material/styles';

// Import icons individually to avoid the large bundle size
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
import BusinessIcon from '@mui/icons-material/Business';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CodeIcon from '@mui/icons-material/Code';
import InfoIcon from '@mui/icons-material/Info';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';

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
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [pendingTests, setPendingTests] = useState([]);
  const navigate = useNavigate();

  // Add new state for the match details dialog
  const [openMatchDetails, setOpenMatchDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

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
    fetchEligibleTests();
  }, [userId]);

  const fetchEligibleTests = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      if (!userId) return;

      const response = await axios.get(`http://localhost:3000/test/employee-tests/${userId}`);
      
      if (response.data && response.data.length > 0) {
        setTests(response.data.map(test => ({
          ...test,
          status: moment(test.lastDate).isBefore(moment()) ? 'Expired' : 'Active'
        })));
        setHasPendingTests(true);
      } else {
        setTests([]);
        setHasPendingTests(false);
      }
    } catch (error) {
      console.error('Error fetching eligible tests:', error);
      toast.error('Failed to fetch tests');
      setTests([]);
      setHasPendingTests(false);
    }
  };

  const handleNotificationClick = () => {
    fetchEligibleTests();
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

  const refreshJobs = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      if (!userId) return;

      // Get user profile to fetch skills and preferences
      const profileResponse = await axios.get(`http://localhost:3000/Employeeprofile/profile/${userId}`);
      const userProfile = profileResponse.data;

      // Get suggested jobs based on user profile
      const response = await axios.get('http://localhost:3000/jobs/suggestions', {
        params: {
          userId,
          skills: userProfile.skills,
          jobPreferences: userProfile.jobPreferences
        }
      });

      setJobSuggestions(response.data);
    } catch (error) {
      console.error('Error refreshing jobs:', error);
    }
  };

  useEffect(() => {
    refreshJobs();
  }, []);

  const handleApply = async (job) => {
    try {
      const userId = sessionStorage.getItem('userId');
      
      // Show loading toast
      toast.loading('Submitting application...');

      // Fetch user profile data
      const profileResponse = await axios.get(`http://localhost:3000/Employeeprofile/profile/${userId}`);
      
      // Extract profile data
      const {
        name,
        email,
        experienceYears = 0,
        experienceMonths = 0,
        degree = [],
        resume = '',
        address = '',
        skills = [],
        jobPreferences = [],
        photo = '',
        dob,
        phone = '',
        atsScore = 0
      } = profileResponse.data;

      // Calculate total experience
      const experience = (experienceYears || 0) + ((experienceMonths || 0) / 12);

      // Prepare application data
      const applicationData = {
        userId,
        jobId: job._id,
        employerId: job.userId,
        name,
        email,
        experience,
        degree: Array.isArray(degree) ? degree : [degree].filter(Boolean),
        jobTitle: job.jobTitle,
        resume,
        address,
        skills: Array.isArray(skills) ? skills : skills?.split(',').filter(Boolean) || [],
        jobPreferences: Array.isArray(jobPreferences) ? jobPreferences : jobPreferences?.split(',').filter(Boolean) || [],
        photo,
        dob,
        phone,
        companyName: job.companyName,
        atsScore
      };

      // Send application
      const response = await axios.post('http://localhost:3000/jobs/apply', applicationData);

      // Clear all toasts
      toast.dismiss();

      // Show success message
      toast.success('Successfully applied for the job!');

      // Refresh the job suggestions
      refreshJobs();

    } catch (error) {
      // Clear all toasts
      toast.dismiss();
      
      // Handle ATS score error specifically
      if (error.response?.data?.atsScoreTooLow) {
        toast.error(
          `Your ATS score (${error.response.data.userScore}%) does not meet the requirement (${error.response.data.requiredScore}%). Please improve your resume.`
        );
      } else {
        toast.error(error.response?.data?.message || 'Failed to apply for the job');
      }
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

  // Add handlers for the match details dialog
  const handleOpenMatchDetails = (job) => {
    if (job) {
      setSelectedJob(job);
      setOpenMatchDetails(true);
    }
  };

  const handleCloseMatchDetails = () => {
    setOpenMatchDetails(false);
    setSelectedJob(null);
  };

  // Move getMatchReasons outside of JobSuggestionCard
  const getMatchReasons = (job, profileData) => {
    // Early return if job or profileData is null/undefined
    if (!job || !profileData) {
      return [];
    }

    console.log('Job Matching Details:', {
      job: {
        id: job?._id || job?.id,
        title: job?.title || job?.jobTitle,
        rawSkillScore: job?.skillScore,
        rawExperienceScore: job?.experienceScore,
        rawPreferenceScore: job?.preferenceScore,
        rawQualificationScore: job?.qualificationScore,
        rawResumeRelevance: job?.resumeRelevance,
        matchedSkills: job?.matchedSkills,
        requiredSkills: job?.requiredSkills
      },
      profile: {
        atsScore: profileData?.atsScore,
        atsDetails: profileData?.atsDetails
      }
    });

    const normalizeScore = (score) => {
      if (!score) return 0;
      const normalized = Math.round(score * 100);
      return Math.min(Math.max(normalized, 0), 100);
    };

    const getScoreColor = (score) => {
      if (score >= 80) return '#4caf50';
      if (score >= 50) return '#ff9800';
      return '#f44336';
    };

    const formatReason = (text, score, icon) => {
      return {
        text,
        score: Math.round(score),
        icon,
        color: getScoreColor(score)
      };
    };

    const reasons = [];
    const skillScore = normalizeScore(job.skillScore);
    const experienceScore = normalizeScore(job.experienceScore);
    const preferenceScore = normalizeScore(job.preferenceScore);
    const qualificationScore = normalizeScore(job.qualificationScore);

    // Log normalized scores
    console.log('Normalized Scores:', {
      skillScore,
      experienceScore,
      preferenceScore,
      qualificationScore
    });

    // Skills match
    if (skillScore > 0) {
      reasons.push(formatReason(
        `${skillScore >= 80 ? 'Strong' : 'Partial'} skill match (${job.matchedSkills?.length || 0}/${job.requiredSkills?.length || 0} skills)`,
        skillScore,
        <CodeIcon />
      ));
    }

    // Experience match
    if (experienceScore > 0) {
      reasons.push(formatReason(
        `${experienceScore >= 80 ? 'Experience level is an excellent match' : 'Experience level is suitable'}`,
        experienceScore,
        <WorkIcon />
      ));
    }

    // Preference match
    if (preferenceScore > 0) {
      reasons.push(formatReason(
        `${preferenceScore >= 80 ? 'Job type matches your preferences' : 'Job type partially matches your preferences'}`,
        preferenceScore,
        <StarIcon />
      ));
    }

    // Qualification match
    if (qualificationScore > 0) {
      reasons.push(formatReason(
        `${qualificationScore >= 80 ? 'All qualifications match' : 'Some qualifications match'}`,
        qualificationScore,
        <SchoolIcon />
      ));
    }

    // ATS Score
    const actualAtsScore = profileData?.atsScore || 0;
    reasons.push(formatReason(
      `${actualAtsScore >= 80 ? 'Strong ATS Score' :
         actualAtsScore >= 50 ? 'Moderate ATS Score' :
         'Low ATS Score'}`,
      actualAtsScore,
      <AssessmentIcon />
    ));

    // Resume Relevance
    const baseResumeScore = job.resumeRelevance ? normalizeScore(job.resumeRelevance) : 0;
    const atsWeight = 0.7;
    const matchWeight = 0.3;
    const finalResumeScore = Math.round(
      (actualAtsScore * atsWeight) + (baseResumeScore * matchWeight)
    );

    reasons.push(formatReason(
      `${finalResumeScore >= 80 ? 'High resume relevance' :
         finalResumeScore >= 50 ? 'Moderate resume relevance' :
         'Low resume relevance'}`,
      finalResumeScore,
      <DescriptionIcon />
    ));

    return reasons;
  };

  const JobSuggestionCard = ({ job, onApply, profileData }) => {
    // Add debugging logs
    console.log('Job Data:', {
      id: job.id,
      title: job.title,
      experience: job.experience,
      requiredExperience: job.requiredExperience,
      rawExperience: job.experience
    });

    if (!job) return null;

    // Fix score calculations - ensure they're between 0-100
    const normalizeScore = (score) => {
      if (!score) return 0;
      // Convert decimal to percentage and ensure it's between 0-100
      const normalized = Math.round(score * 100);
      return Math.min(Math.max(normalized, 0), 100);
    };

    // Add proper score normalization
    const atsMatchScore = profileData?.atsScore || 0;
    const resumeRelevance = Math.min(
      ((profileData?.atsDetails?.keywords || 0) * 0.4 +
       (profileData?.atsDetails?.sections || 0) * 0.3 +
       (profileData?.atsDetails?.format || 0) * 0.3) * 100,
      100
    );
    const matchPercentage = normalizeScore(job.score);
    const skillScore = normalizeScore(job.skillScore);
    const experienceScore = normalizeScore(job.experienceScore);
    const preferenceScore = normalizeScore(job.preferenceScore);
    const qualificationScore = normalizeScore(job.qualificationScore);

    // Helper function to get color based on normalized score
    const getScoreColor = (score) => {
      if (score >= 80) return '#4caf50'; // success green
      if (score >= 50) return '#ff9800'; // warning orange
      return '#f44336'; // error red
    };

    // Helper function to format reason
    const formatReason = (text, score, icon) => {
      return {
        text,
        score: Math.round(score), // Round to nearest integer
        icon,
        color: getScoreColor(score)
      };
    };

    // Format match reasons with ATS and Resume relevance
    const matchReasons = getMatchReasons(job, profileData);

    const handleApplyClick = async () => {
      try {
        const checkResponse = await axios.get('http://localhost:3000/jobs/check-application', {
          params: {
            userId: sessionStorage.getItem('userId'),
            jobId: job._id || job.id
          }
        });

        if (checkResponse.data.hasApplied) {
          toast.error('You have already applied for this job');
          return;
        }

        const response = await axios.post('http://localhost:3000/jobs/apply-suggestion', {
          userId: sessionStorage.getItem('userId'),
          jobId: job._id || job.id,
          jobTitle: job.title || job.jobTitle,
          companyName: job.companyName,
          employerId: job.userId
        });

        toast.success('Application submitted successfully!');
        if (onApply) onApply(job);
      } catch (error) {
        console.error('Error applying for job:', error);
        if (error.response?.status === 404) {
          toast.error('This job is no longer available');
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Error submitting application. Please try again.');
        }
      }
    };

    const formatSalary = (salary) => {
      if (!salary) return 'Salary N/A';
      return `₹${salary}`;
    };

    // Update the experience formatting
    const formatExperience = (exp) => {
      // Add console log to debug the experience data
      console.log('Experience data:', exp);
      
      // Check for both experience and requiredExperience
      const experienceData = exp || job.experience || job.requiredExperience;
      
      if (!experienceData) {
        return "Experience not specified";
      }

      const years = experienceData.years || 0;
      const months = experienceData.months || 0;

      if (years === 0 && months === 0) {
        return "No experience required";
      }

      let expText = '';
      if (years > 0) {
        expText += `${years} Year${years > 1 ? 's' : ''}`;
      }
      if (months > 0) {
        expText += `${years > 0 ? ' ' : ''}${months} Month${months > 1 ? 's' : ''}`;
      }
      return expText;
    };

    return (
      <Card sx={{ mb: 2, position: 'relative' }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Left Section - Job Details */}
            <Grid item xs={12} md={8}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                mb: 3 
              }}>
                <Avatar 
                  src={job.logoUrl ? `http://localhost:3000/${job.logoUrl}` : null}
                  alt={job.companyName}
                  sx={{ 
                    width: 70, 
                    height: 70,
                    mr: 2.5,
                    border: '1px solid #eee',
                    bgcolor: 'grey.100'
                  }}
                  imgProps={{
                    onError: (e) => {
                      console.error('Logo load error:', e);
                      e.target.src = null;
                    }
                  }}
                >
                  {!job.logoUrl && <BusinessIcon sx={{ fontSize: 40, color: 'grey.500' }} />}
                </Avatar>
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#360275',
                      mb: 0.5 
                    }}
                  >
                    {job.title || job.jobTitle}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'text.secondary',
                      fontWeight: 500 
                    }}
                  >
                    {job.companyName}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    bgcolor: '#f5f5f5',
                    p: 1.5,
                    borderRadius: 1
                  }}>
                    <WorkIcon color="primary" />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatExperience(job.experience || job.requiredExperience)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    bgcolor: '#f5f5f5',
                    p: 1.5,
                    borderRadius: 1
                  }}>
                    <LocationOnIcon color="primary" />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {job.location || 'Location N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    bgcolor: '#f5f5f5',
                    p: 1.5,
                    borderRadius: 1
                  }}>
                    <MonetizationOnIcon color="primary" />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatSalary(job.salary)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Skills Section */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Required Skills:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {job.requiredSkills && job.requiredSkills.length > 0 ? (
                    job.requiredSkills.map((skill, index) => {
                      const isMatched = job.matchedSkills && job.matchedSkills.includes(skill.toLowerCase());
                      return (
                        <Chip
                          key={index}
                          label={skill}
                          sx={{ 
                            borderRadius: '4px',
                            backgroundColor: isMatched ? '#360275' : '#f5f5f5',
                            color: isMatched ? 'white' : '#666',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            '&:hover': {
                              backgroundColor: isMatched ? '#4a0b99' : '#e0e0e0',
                              transform: 'translateY(-2px)',
                              transition: 'all 0.2s'
                            },
                            transition: 'all 0.2s',
                            px: 1,
                            height: '32px'
                          }}
                          icon={isMatched ? 
                            <CheckCircleIcon sx={{ 
                              color: 'white !important',
                              fontSize: '18px'
                            }} /> : null
                          }
                        />
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No specific skills listed
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Right Section - Only Overall Match Score */}
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress
                    variant="determinate"
                    value={Math.min(matchPercentage, 100)}
                    size={60}
                    thickness={4}
                    sx={{
                      color: matchPercentage >= 80 ? 'success.main' :
                             matchPercentage >= 60 ? 'warning.main' :
                             'error.main'
                    }}
                  />
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                    {Math.min(matchPercentage, 100)}% Overall Match
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleOpenMatchDetails(job)}
                  startIcon={<InfoIcon />}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white'
                    }
                  }}
                >
                  Why this matches?
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const fetchProfileAndSuggest = async () => {
    try {
      if (!userId) {
        console.log('No userId found');
        return;
      }

      console.log('Fetching profile for userId:', userId);
      const profileResponse = await axios.get(`http://localhost:3000/Employeeprofile/profile/${userId}`);
      const profile = profileResponse.data;
      console.log('Fetched profile:', profile);
      setProfileData(profile);

      // Ensure profile has required data
      if (!profile || !profile.skills || profile.skills.length === 0) {
        console.log('Profile missing required data:', {
          hasProfile: !!profile,
          hasSkills: !!profile?.skills,
          skillsLength: profile?.skills?.length
        });
        setSuggestedJobs([]);
        return;
      }

      console.log('Fetching job descriptions...');
      const jobDescriptions = await axios.get('http://localhost:3000/jobs/viewjob');
      console.log('Fetched jobs:', jobDescriptions.data);

      // Send job matching request
      setLoadingSuggestions(true);
      const matchingResponse = await axios.post(
        'http://localhost:3000/jobs/suggest-jobs',
        {
          userId,
          skills: profile.skills,
        experience: {
            years: profile.experienceYears || 0,
            months: profile.experienceMonths || 0
          },
          jobPreferences: profile.jobPreferences || [],
          qualifications: profile.degree || [],
          resume: profile.resume,
          atsScore: profile.atsScore
        }
      );

      console.log('Job matching response:', matchingResponse.data);

      // Process and filter jobs with sorting
      const processedJobs = (matchingResponse.data || [])
        .filter(job => job && job.score > 0.5)
        .map(job => ({
          ...job,
          id: job.id || job._id,
          title: job.title || job.jobTitle,
          logoUrl: job.logoUrl,
          matchScore: Math.round(job.score * 100),
          atsMatchScore: Math.round(job.atsMatchScore * 100),
          resumeRelevance: Math.round(job.resumeRelevance * 100),
          matchedSkills: job.matchedSkills || [],
          unmatchedSkills: job.unmatchedSkills || [],
          requiredSkills: job.requiredSkills || []
        }))
        .sort((a, b) => b.score - a.score); // Sort by score in descending order

      console.log('Processed and sorted jobs:', processedJobs);
      setSuggestedJobs(processedJobs);

    } catch (error) {
      console.error('Error in fetchProfileAndSuggest:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // More specific error message
      if (error.response?.status === 404) {
        toast.error('Profile not found. Please complete your profile first.');
      } else {
        toast.error('Error loading job suggestions: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Add the Match Details Dialog component
  const MatchDetailsDialog = ({ open, onClose, job, profileData }) => {
    // Only calculate matchReasons if both job and profileData exist
    const matchReasons = (job && profileData) ? getMatchReasons(job, profileData) : [];

    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {job ? `Match Details for ${job.jobTitle || job.title}` : 'Match Details'}
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 3 }}>
          {job && profileData ? (
            <Grid container spacing={2}>
              {matchReasons.map((reason, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: alpha(reason.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderLeft: `4px solid ${reason.color}`,
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: alpha(reason.color, 0.15),
                        transform: 'translateY(-2px)',
                        boxShadow: 1
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      maxWidth: '70%' 
                    }}>
                      {React.cloneElement(reason.icon, { 
                        sx: { 
                          color: reason.color, 
                          mr: 1.5, 
                          fontSize: '1.2rem' 
                        } 
                      })}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: 'text.primary',
                          fontSize: '0.85rem',
                          lineHeight: 1.3
                        }}
                      >
                        {reason.text}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: reason.color,
                        fontWeight: 'bold',
                        backgroundColor: alpha(reason.color, 0.15),
                        padding: '3px 8px',
                        borderRadius: '10px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {reason.score}%
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No match details available
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    );
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
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : suggestedJobs.length > 0 ? (
            <Grid container spacing={3}>
              {suggestedJobs.map((job, index) => (
                <Grid item xs={12} key={index}>
                  <JobSuggestionCard 
                    job={job} 
                    onApply={handleApply} 
                    profileData={profileData}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
              mt: 2
            }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No matching jobs found at the moment
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try updating your profile with more skills and experience to improve job matches
              </Typography>
            </Box>
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
        <DialogContent sx={{ mt: 3 }}>
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
                    <TableCell sx={{ fontWeight: 'bold' }}>Last Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
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
                        {moment(test.lastDate).format('DD MMM YYYY')}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={test.status}
                          color={test.status === 'Active' ? 'success' : 'error'}
                          size="small"
                          sx={{ 
                            minWidth: '80px',
                            '& .MuiChip-label': {
                              fontWeight: 500
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleTakeTest(test._id)}
                          startIcon={<AssessmentIcon />}
                          disabled={test.status === 'Expired'}
                          sx={{
                            bgcolor: '#360275',
                            '&:hover': { bgcolor: '#4a0ba8' },
                            '&.Mui-disabled': {
                              bgcolor: 'rgba(0, 0, 0, 0.12)'
                            }
                          }}
                        >
                          {test.status === 'Expired' ? 'Expired' : 'Take Test'}
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
                          • Experience Description: {Math.round(atsScore * 0.25)}%
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

      {/* Add Match Details Dialog */}
      <MatchDetailsDialog 
        open={openMatchDetails}
        onClose={handleCloseMatchDetails}
        job={selectedJob}
        profileData={profileData}
      />

      <Footer />
    </div>
  );
};

export default EmployeePage;
