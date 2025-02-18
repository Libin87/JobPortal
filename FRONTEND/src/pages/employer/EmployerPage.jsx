import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Button,
  TextField,
  FormControl, InputLabel, Select, MenuItem, FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, Autocomplete, Chip, Typography, Box, CircularProgress,
  Badge,
  IconButton,
  Menu,
  MenuItem as MuiMenuItem,
  Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import NavbarEmployer from './NavbarEmployer';
import Footer from '../../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileWarning from '../../components/ProfileWarning';
import NotificationsIcon from '@mui/icons-material/Notifications';

const EmployerPage = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    salary: '',
    jobType: '',
    qualifications: [],
    skills: [],
    jobDescription: '',
    experience: {
      years: '',
      months: ''
    },
    contactDetails: '',
    lastDate: '',
    vaccancy: '',
  });

  const [error, setError] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await axios.get(`http://localhost:3000/profile/${userId}`);
        setHasProfile(!!response.data);
        
        if (response.data) {
          // Fetch company name
          const nameResponse = await axios.get(`http://localhost:3000/profile/company/${userId}`);
          sessionStorage.setItem('cname', nameResponse.data.companyName);
          

          // Fetch company logo
          const logoResponse = await axios.get(`http://localhost:3000/profile/logo/${userId}`);
          const logoUrl = logoResponse.data.logoUrl;
          sessionStorage.setItem('logo', logoResponse.data.logoUrl);


          // Store logoUrl in a variable or in state if needed
          console.log('Company Logo URL:', logoUrl);

          setVerificationStatus(response.data.verificationStatus);
          
          // If profile is rejected, show the rejection message
          if (response.data.verificationStatus === 'Rejected') {
            toast.error(`Company profile verification failed: ${response.data.verificationMessage || 'Please contact admin'}`);
          }
        }
      } catch (error) {
        setHasProfile(false);
      } finally {
        setIsLoading(false);
      }
    };

    const role = sessionStorage.getItem('role');
    if (!role || role !== 'employer') {
      navigate('/login');
    } else {
      checkProfile();
    }
  }, [navigate]);

  useEffect(() => {
    fetchNotifications();
    // Set up polling for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const validateField = (name, value) => {
    const errors = {};

    // First check if field is empty (except for experience which is handled separately)
    if (name !== 'experience' && (!value || (Array.isArray(value) && value.length === 0))) {
      errors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      return errors;
    }

    switch (name) {
      case 'salary': {
        const salaryValue = parseFloat(value);
        if (isNaN(salaryValue) || salaryValue < 1000 || salaryValue > 5000000) {
          errors[name] = 'Enter a valid salary (between 1,000 and 5,000,000)';
        }
        break;
      }

      case 'experience': {
        const { years, months } = value;
        if (years === '' && months === '') {
          return 'Experience is required';
        }
        const numYears = parseInt(years) || 0;
        const numMonths = parseInt(months) || 0;
        
        if (numYears < 0 || numYears > 60) {
          return 'Years should be between 0 and 60';
        }
        if (numMonths < 0 || numMonths > 11) {
          return 'Months should be between 0 and 11';
        }
        return '';
      }

      case 'jobTitle': {
        const titleLocationRegex1 = /^(?!.*([a-zA-Z])\1\1\1)[A-Za-z\s]+(?:\d{0,2})?$/;
        if (!titleLocationRegex1.test(value)) {
          errors[name] = 'Enter a valid job title';
        }
        break;
      }

      case 'location': {
        const titleLocationRegex = /^(?!.*([a-zA-Z])\1\1\1)[A-Za-z\s]+(?:\d{0,2})?$/;
        if (!titleLocationRegex.test(value)) {
          errors[name] = 'Enter a valid location';
        }
        break;
      }

     case 'vaccancy': {
        const vacancyRegex = /^(?:[1-9][0-9]?|100)$/;
        if (!vacancyRegex.test(String(value).trim())) {
          errors[name] = 'Vacancy must be a number between 1 and 100';
        }
        break;
      }


      case 'contactDetails': {
        const phoneRegex = /^\d{10}$/;
        const repeatedDigitsRegex = /(\d)\1{4,}/;
        const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]{3,}\.(com|in|org|net|edu|gov|mil|co|info|biz|me)$/;

        if (!phoneRegex.test(value) && !emailRegex.test(value)) {
          errors[name] = 'Enter a valid phone number (10 digits) or email address';
        } else if (phoneRegex.test(value) && repeatedDigitsRegex.test(value)) {
          errors[name] = 'Enter a valid phone number';
        }
        break;
      }

      case 'skills':
        if (!value || (Array.isArray(value) && value.length === 0)) {
          errors[name] = 'Please select at least one skill';
        }
        break;

      case 'qualifications':
        if (!value || (Array.isArray(value) && value.length === 0)) {
          errors[name] = 'Please select at least one qualification';
        }
        break;

      case 'jobDescription':
        if (value && value.trim().length < 10) {
          errors.jobDescription = 'Job description must be at least 10 characters long.';
        } else if (/([a-zA-Z])\1\1/.test(value)) {
          errors.jobDescription = 'No letter should be repeated more than three times consecutively.';
        } else if (/\d/.test(value)) {
          errors.jobDescription = 'Job description should not contain digits.';
        }
        break;

      case 'lastDate': {
        const selectedDate = new Date(value);
        const today = new Date();
        
        // Reset hours to compare only dates
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        // Calculate minimum date (5 days from today)
        const minDate = new Date(today);
        minDate.setDate(today.getDate() + 5);

        // Calculate maximum date (60 days from today)
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 60);

        if (isNaN(selectedDate.getTime())) {
          errors[name] = 'Please enter a valid date';
        } else if (selectedDate < today) {
          errors[name] = 'Last date cannot be in the past';
        } else if (selectedDate < minDate) {
          errors[name] = 'Last date must be at least 5 days from today';
        } else if (selectedDate > maxDate) {
          errors[name] = 'Last date cannot be more than 60 days from today';
        }
        break;
      }

      default:
        break;
    }

    return errors;
  };


  const handleInputChange = (event, newValue) => {
    const { name, value } = event.target || {};

    // Handle arrays (skills and qualifications)
    if (Array.isArray(newValue)) {
      setFormData(prev => ({
        ...prev,
        [name || 'skills']: newValue
      }));

      // Validate arrays
      const fieldError = validateField(name || 'skills', newValue);
      setError(prev => ({
        ...prev,
        [name || 'skills']: fieldError[name || 'skills'] || ''
      }));
      return;
    }

    // Handle regular inputs
    if (name) {
      const trimmedValue = value ? value.trim() : '';
      setFormData(prev => ({
        ...prev,
        [name]: trimmedValue
      }));

      // Validate the field
      const fieldError = validateField(name, trimmedValue);
      setError(prev => ({
        ...prev,
        [name]: fieldError[name] || ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Special handling for experience fields
    if (name.startsWith('experience.')) {
      const errorMessage = validateField('experience', formData.experience);
      setError(prev => ({
        ...prev,
        experience: errorMessage
      }));
      return;
    }

    // For other fields
    const fieldError = validateField(name, value);
    setError(prev => ({
      ...prev,
      ...fieldError
    }));
  };

  const handleMultipleSelect = (name, newValue) => {
    setFormData(prev => ({
      ...prev,
      [name]: newValue || []
    }));

    // Validate the field
    const fieldError = validateField(name, newValue);
    setError(prev => ({
      ...prev,
      [name]: fieldError[name] || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check verification status before allowing job posting
    if (verificationStatus !== 'Verified') {
      toast.error(
        verificationStatus === 'Pending' 
          ? 'Your company profile is pending verification. Please wait for admin approval.'
          : 'Your company profile has not been verified. You cannot post jobs at this time.'
      );
      return;
    }

    // Validate all fields
    let hasErrors = false;
    const newErrors = {};

    // Validate all fields including skills and qualifications
    Object.keys(formData).forEach(key => {
      const fieldError = validateField(key, formData[key]);
      if (fieldError[key]) {
        newErrors[key] = fieldError[key];
        hasErrors = true;
      }
    });

    // If there are errors, show them and stop submission
    if (hasErrors) {
      setError(newErrors);
      return;
    }

    const userId = sessionStorage.getItem('userId');
    const companyName = sessionStorage.getItem('cname');
    const logoUrl = sessionStorage.getItem('logo');

    // Format the data before sending
    const jobData = {
      ...formData,
      userId,
      companyName,
      logoUrl,
      skills: Array.isArray(formData.skills) ? formData.skills : [],
      qualifications: Array.isArray(formData.qualifications) ? formData.qualifications : []
    };

    try {
      const response = await axios.post('http://localhost:3000/jobs/create', jobData);
      console.log(response.data);
      setOpenPopup(true);
      // Reset form
      setFormData({
        jobTitle: '',
        location: '',
        salary: '',
        jobType: '',
        qualifications: [],
        skills: [],
        jobDescription: '',
        experience: {
          years: '',
          months: ''
        },
        contactDetails: '',
        lastDate: '',
        vaccancy: ''
      });
      setError({}); // Clear all errors
    } catch (err) {
      console.error('Error posting job:', err);
      setError(prev => ({
        ...prev,
        general: 'There was an issue posting the job. Please try again.'
      }));
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleCancel = () => {
    setFormData({
      jobTitle: '',
      location: '',
      salary: '',
      jobType: '',
      qualifications: [],
      skills: [],
      jobDescription: '',
      experience: {
        years: '',
        months: ''
      },
      contactDetails: '',
      lastDate: '',
      vaccancy: '',
    });
  };

  const skillOptions = [
    "JavaScript", "Python", "Java", "React", "Node.js", "Angular", "Vue.js",
    "PHP", "Ruby", "C++", "C#", "Swift", "Kotlin", "Go", "Rust",
    "HTML", "CSS", "TypeScript", "MongoDB", "MySQL", "PostgreSQL",
    "AWS", "Azure", "Docker", "Kubernetes", "Git", "DevOps",
    "Machine Learning", "AI", "Data Science", "Blockchain"
  ];

  const qualificationOptions = [
    "Bachelor's in Computer Science",
    "Bachelor's in Information Technology",
    "Bachelor's in Engineering",
    "Master's in Computer Science",
    "Master's in Information Technology",
    "PhD in Computer Science",
    "BCA",
    "MCA",
    "B.Tech",
    "M.Tech",
    "BSc Computer Science",
    "MSc Computer Science",
    "Bachelor's in Mathematics",
    "Diploma in Computer Science",
    "Any Degree"
  ];

  const VerificationMessage = () => {
    if (!verificationStatus || verificationStatus === 'Verified') return null;

    return (
      <Container style={{ 
        backgroundColor: verificationStatus === 'Pending' ? '#fff3cd' : '#f8d7da',
        color: verificationStatus === 'Pending' ? '#856404' : '#721c24',
        padding: '15px',
        marginTop: '20px',
        borderRadius: '5px',
        textAlign: 'center',
        maxWidth: '84.5%'
      }}>
        <Typography variant="h6">
          {verificationStatus === 'Pending' 
            ? '⚠️ Your company profile is pending verification. You cannot post jobs until approved.'
            : '❌ Your company profile verification has been rejected. Please update your profile and contact admin.'}
        </Typography>
      </Container>
    );
  };

  const fetchNotifications = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const response = await axios.get(`http://localhost:3000/notifications/${userId}`);
      
      // Sort notifications by date and unread status
      const sortedNotifications = response.data.sort((a, b) => {
        // Show unread notifications first
        if (!a.read && b.read) return -1;
        if (a.read && !b.read) return 1;
        // Then sort by date
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setNotifications(sortedNotifications);
      setUnreadCount(sortedNotifications.filter(notif => !notif.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    }
  };

  const handleNotificationIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationItemClick = async (notification) => {
    if (notification.type === 'job' && notification.actionLink === '/contact-admin') {
      navigate('/contactus');
    }
    // Mark notification as read
    await handleNotificationRead(notification._id);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:3000/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleContactAdmin = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', sessionStorage.getItem('userId'));
      
      // Only append jobId if it exists and is valid
      if (selectedJobId && typeof selectedJobId === 'string') {
        formData.append('jobId', selectedJobId);
      }
      
      formData.append('message', contactMessage);
      formData.append('type', 'job_suspension');
      
      if (selectedFile) {
        formData.append('document', selectedFile);
      }

      const response = await axios.post('http://localhost:3000/contact/admin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Your response has been sent to admin successfully');
      setShowContactDialog(false);
      setContactMessage('');
      setSelectedFile(null);
      setSelectedJobId(null);
      
    } catch (error) {
      console.error('Error contacting admin:', error);
      toast.error(error.response?.data?.message || 'Failed to send message to admin');
    }
  };

  return (
    <div>
      <NavbarEmployer />
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : !hasProfile ? (
        <ProfileWarning />
      ) : (
        <>
          <Container
            style={{
              maxWidth: '100rem',
              marginTop: '50px',
              backgroundColor: '#4B647D',
              borderRadius: '20px',
              paddingLeft: '100px',
              paddingRight: '100px',
              minHeight: '15rem',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontWeight: 'bolder', color: 'aliceblue', paddingTop: '30px' }}>EMPLOYER DASHBOARD</h1>
            </div>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={3} md={3}>
                <Link to="/employerprofile">
                  <Button variant="contained" fullWidth style={{ backgroundColor: '#0D6EFD' }}>
                    Company Profile
                  </Button>
                </Link>
              </Grid>
              <Grid item xs={12} sm={3} md={3}>
                <Link to="/PostedJobs">
                  <Button variant="contained" color="secondary" fullWidth>
                    POSTED JOBS
                  </Button>
                </Link>
              </Grid>
              <Grid item xs={12} sm={3} md={3}>
                <Link to="/createTest ">
                  <Button variant="contained" fullWidth style={{ backgroundColor: 'GREEN' }}>
                    Selection Test
                  </Button>
                </Link>
              </Grid>
              <Grid item xs={12} sm={3} md={3}>
                <Link to="/Applicants">
                  <Button variant="contained" fullWidth style={{ backgroundColor: '#00CCCD' }}>
                    Applicants
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Container>

          <VerificationMessage />

          {/* Only show the job posting section if verified */}
          {verificationStatus === 'Verified' ? (
            <>
              <Container style={{ backgroundColor: '#552878', marginBottom: '30px', borderRadius: '50px', maxWidth: '84.5%' }}>
                <h2 style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '40px', color: 'aliceblue' }}>POST A JOB</h2>
              </Container>

              <Container
                style={{
                  maxWidth: '100rem',
                  marginTop: '50px',
                  backgroundColor: 'aliceblue',
                  borderRadius: '20px',
                  paddingLeft: '100px',
                  paddingRight: '100px',
                  minHeight: '35rem',
                  marginBottom: '20px',
                }}
              >
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2} style={{ marginTop: '30px' }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Job Title"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        fullWidth
                        required
                        error={!!error.jobTitle}
                        helperText={error.jobTitle}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        fullWidth
                        required
                        error={!!error.location}
                        helperText={error.location}

                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Salary in rupees"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        fullWidth
                        required
                        error={!!error.salary}
                        helperText={error.salary}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        label="Job Type"
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              textAlign: 'left',
                            },
                          },
                        }}
                        sx={{ textAlign: 'left' }}
                        fullWidth
                        required
                        error={!!error.jobType}
                        helperText={error.jobType}
                      >
                        <MenuItem value="frontend-developer">Frontend Developer</MenuItem>
                        <MenuItem value="ui-designer">UI Designer</MenuItem>
                        <MenuItem value="backend-developer">Backend Developer</MenuItem>
                        <MenuItem value="fullstack-developer">Fullstack Developer</MenuItem>
                        <MenuItem value="project-manager">Project Manager</MenuItem>
                        <MenuItem value="data-scientist">Data Scientist</MenuItem>
                        <MenuItem value="product-designer">Product Designer</MenuItem>
                        <MenuItem value="devops-engineer">DevOps Engineer</MenuItem>
                        <MenuItem value="qa-engineer">QA Engineer</MenuItem>
                        <MenuItem value="marketing-specialist">Marketing Specialist</MenuItem>
                        <MenuItem value="hr-manager">HR Manager</MenuItem>
                        <MenuItem value="content-writer">Content Writer</MenuItem>
                        <MenuItem value="content-writer">Other</MenuItem>

                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={qualificationOptions}
                        value={formData.qualifications}
                        onChange={(event, newValue) => handleMultipleSelect('qualifications', newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option}
                              {...getTagProps({ index })}
                              style={{ margin: 2 }}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Qualifications"
                            placeholder="Add qualification"
                            error={!!error.qualifications}
                            helperText={error.qualifications}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={skillOptions}
                        value={formData.skills}
                        onChange={(event, newValue) => handleMultipleSelect('skills', newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option}
                              {...getTagProps({ index })}
                              style={{ margin: 2 }}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Skills"
                            placeholder="Add skill"
                            error={!!error.skills}
                            helperText={error.skills}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            label="Experience (Years)"
                            name="experience.years"
                            type="number"
                            value={formData.experience.years}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData(prev => ({
                                ...prev,
                                experience: {
                                  ...prev.experience,
                                  years: value
                                }
                              }));
                              // Validate immediately on change
                              const errorMessage = validateField('experience', {
                                ...formData.experience,
                                years: value
                              });
                              setError(prev => ({
                                ...prev,
                                experience: errorMessage
                              }));
                            }}
                            onBlur={handleBlur}
                            fullWidth
                            required
                            inputProps={{ min: 0, max: 60 }}
                            error={!!error.experience}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Experience (Months)"
                            name="experience.months"
                            type="number"
                            value={formData.experience.months}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData(prev => ({
                                ...prev,
                                experience: {
                                  ...prev.experience,
                                  months: value
                                }
                              }));
                              // Validate immediately on change
                              const errorMessage = validateField('experience', {
                                ...formData.experience,
                                months: value
                              });
                              setError(prev => ({
                                ...prev,
                                experience: errorMessage
                              }));
                            }}
                            onBlur={handleBlur}
                            fullWidth
                            required
                            inputProps={{ min: 0, max: 11 }}
                            error={!!error.experience}
                          />
                        </Grid>
                        {error.experience && (
                          <Grid item xs={12}>
                            <Typography 
                              color="error" 
                              variant="caption" 
                              sx={{ 
                                display: 'block',
                                mt: 1,
                                ml: 1
                              }}
                            >
                              {error.experience}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Contact Details"
                        name="contactDetails"
                        value={formData.contactDetails}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        fullWidth
                        required
                        error={!!error.contactDetails}
                        helperText={error.contactDetails}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Last Date to Apply"
                        name="lastDate"
                        type="date"
                        value={formData.lastDate}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        fullWidth
                        required
                        error={!!error.lastDate}
                        helperText={error.lastDate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
                          max: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString().split('T')[0]
                        }}
                      />
                    </Grid><Grid item xs={12} md={6}>
                      <TextField
                        label="No.Of.Vaccancies"
                        name="vaccancy"
                        value={formData.vaccancy}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        fullWidth
                        required
                        error={!!error.vaccancy}
                        helperText={error.vaccancy}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Job Description"
                        name="jobDescription"
                        value={formData.jobDescription}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        multiline
                        rows={4}
                        fullWidth
                        required
                        error={!!error.jobDescription}
                        helperText={error.jobDescription}
                      />
                    </Grid>


                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={handleCancel}
                        style={{ backgroundColor: '#cc0000', color: 'white', marginRight: '20px', marginTop: '' }}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained" color="primary" >
                        Post Job
                      </Button>

                    </Grid>

                  </Grid>

                </form>
              </Container>
            </>
          ) : null}

          {/* Success Dialog */}
          <Dialog open={openPopup} onClose={handleClosePopup}>
            <DialogTitle>Job Posted</DialogTitle>
            <DialogContent>
              <DialogContentText>Your job has been posted successfully!</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePopup} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>

          <Footer />

          <Box sx={{ position: 'fixed', top: 75, right: 20, zIndex: 1000 }}>
            <IconButton
              onClick={handleNotificationIconClick}
              size="large"
              sx={{
                backgroundColor: 'white',
                boxShadow: 2,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon sx={{ color: '#360275' }} />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleNotificationClose}
              PaperProps={{
                sx: {
                  maxHeight: 400,
                  width: '300px',
                  mt: 1.5,
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Typography sx={{ p: 2, fontWeight: 'bold', color: '#360275' }}>
                Notifications
              </Typography>
              <Divider />
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <MuiMenuItem 
                    key={notification._id} 
                    onClick={() => handleNotificationItemClick(notification)}
                    sx={{
                      backgroundColor: notification.read ? 'transparent' : 'rgba(54, 2, 117, 0.05)',
                      whiteSpace: 'normal',
                      padding: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      {notification.jobId && (
                        <Typography variant="caption" color="primary">
                          Job: {notification.jobId.jobTitle}
                        </Typography>
                      )}
                      {notification.type === 'job' && notification.actionLink === '/contact-admin' && (
                        <Button
                          size="small"
                          color="primary"
                          sx={{ mt: 1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/contactus');
                          }}
                        >
                          Contact Admin
                        </Button>
                      )}
                      <Typography variant="caption" color="text.secondary" display="block">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    {index < notifications.length - 1 && <Divider />}
                  </MuiMenuItem>
                ))
              ) : (
                <MuiMenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    No notifications
                  </Typography>
                </MuiMenuItem>
              )}
            </Menu>
          </Box>

          <Dialog open={showContactDialog} onClose={() => setShowContactDialog(false)}>
            <DialogTitle>Contact Admin</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please provide additional information or clarification regarding the job suspension:
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Message"
                fullWidth
                multiline
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
              />
              <Box sx={{ mt: 2 }}>
                <input
                  accept="application/pdf,image/*"
                  style={{ display: 'none' }}
                  id="document-file"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="document-file">
                  <Button variant="outlined" component="span">
                    Upload Document (Optional)
                  </Button>
                </label>
                {selectedFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected file: {selectedFile.name}
                  </Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setShowContactDialog(false);
                setSelectedFile(null);
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleContactAdmin}
                variant="contained"
                color="primary"
                disabled={!contactMessage.trim()}
              >
                Send Message
              </Button>
            </DialogActions>
          </Dialog>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </>
      )}
    </div>
  );
};

export default EmployerPage;


