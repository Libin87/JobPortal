import React, { useEffect, useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';
import NavbarAdmin from './admin/NavbarAdmin';
import NavbarEmployee from './employee/NavbarEmployee';
import NavbarEmployer from './employer/NavbarEmployer';
import { Avatar, Container, Divider, ListItem, ListItemText, Button, Card, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, Chip, Pagination, Box, CircularProgress, FormControl, InputLabel, Select, MenuItem ,Drawer} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import TodayIcon from '@mui/icons-material/Today';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import BuildIcon from '@mui/icons-material/Build';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { keyframes } from '@emotion/react';
import { alpha } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FilterListIcon from '@mui/icons-material/FilterList';
import { debounce } from 'lodash';
import { Autocomplete } from '@mui/material';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const GlowingText = styled(Typography)(({ theme }) => ({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2), transparent)',
    filter: 'blur(5px)',
    animation: 'glow 2s ease-in-out infinite alternate',
  },
  '@keyframes glow': {
    '0%': { opacity: 0.5 },
    '100%': { opacity: 1 },
  },
}));

const FloatingElement = styled('div')(({ theme }) => ({
  animation: 'float 3s ease-in-out infinite',
  '@keyframes float': {
    '0%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' },
    '100%': { transform: 'translateY(0px)' },
  },
}));

const StyledHeroSection = styled('section')(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
  minHeight: '500px',
  position: 'relative',
  overflow: 'hidden',
  paddingBottom: '80px',
  marginBottom: '-40px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    animation: `${pulseAnimation} 4s ease-in-out infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/path/to/pattern.svg")', // Add a subtle pattern
    opacity: 0.1,
    animation: 'backgroundScroll 20s linear infinite',
  },
}));

const StyledFeatureCard = styled(motion.div)(({ theme, color }) => ({
  background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.2)} 100%)`,
  borderRadius: '20px',
  padding: '2rem',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.3s ease-in-out',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  }
}));

const AnimatedJobCard = styled(motion.div)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '12px',
  height: '180px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, #2196f3, #1976d2)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    '&::before': {
      opacity: 1,
    },
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  margin: '0 10px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '0',
    height: '2px',
    bottom: 0,
    left: '50%',
    background: '#fff',
    transition: 'all 0.3s ease',
    transform: 'translateX(-50%)',
  },
  '&:hover': {
    backgroundColor: 'transparent',
    '&::after': {
      width: '100%',
    },
    transform: 'translateY(-3px)',
  },
}));

const JobCard = styled(motion.div)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  borderRadius: '16px',
  padding: '24px',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  border: '1px solid rgba(0,0,0,0.05)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #2196f3, #1976d2)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    '&::before': {
      opacity: 1,
    },
  }
}));

const FeaturesSectionContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  backgroundColor: 'transparent',
  paddingTop: '20px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50px',
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, #01579b 0%, #1a237e 100%)',
    zIndex: -1,
    borderRadius: '30px 30px 0 0',
  }
}));

const JobsSectionTitle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  marginBottom: '40px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '150px',
    height: '4px',
    background: 'linear-gradient(90deg, #1a237e, #01579b)',
    borderRadius: '2px',
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: '80px',
  height: '80px',
  border: '3px solid #fff',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
    border: '3px solid #1a237e',
  }
}));

const JobsContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: '30px',
  margin: '20px auto',
  maxWidth: '1200px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  borderRadius: '30px',
  padding: '20px',
  marginBottom: '30px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto 30px auto',
}));

const FilterDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 300,
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
  },
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: '#360275',
  color: 'white',
  '&:hover': {
    backgroundColor: '#4a0399',
  },
}));

const HomePage = () => {
  const [role, setRole] = useState('guest');
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [companyProfileOpen, setCompanyProfileOpen] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null); // State to store company details
  const [loading, setLoading] = useState(false); // State to track loading
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    jobType: '',
    location: '',
    experience: '',
    salary: ''
  });
  const [locations, setLocations] = useState([]); // To store unique locations
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userRole = sessionStorage.getItem('role');
    if (userRole) {
      setRole(userRole);
    }

    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/jobs/approvedHome');
        setJobs(response.data);
        console.log('Fetched jobs:', response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        alert("Failed to fetch jobs. Please try again.");
      }
    };

    fetchJobs();
  }, [navigate]);

  useEffect(() => {
    fetchJobTypes();
    fetchLocations();
  }, []);

  const fetchJobTypes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/jobs/jobtypes');
      setJobTypes(response.data);
    } catch (error) {
      console.error('Error fetching job types:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/jobs/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleClickOpen = (job) => {
    setSelectedJob(job);    // Sets the job in the local state for further operations
    sessionStorage.setItem('selectedJobId', job._id);
    sessionStorage.setItem('selectedJob', job.jobTitle);  // Saves the jobId to sessionStorage
    sessionStorage.setItem('employerId', job.userId);
    sessionStorage.setItem('companyName', job.companyName);

    setOpen(true);          // Opens the dialog or modal
  };
  

  const handleClose = () => {
    setOpen(false);
  };

  // Handle opening and closing of company profile dialog
  const handleCompanyProfileOpen = () => {
    setCompanyProfileOpen(true);
  };

  const handleCompanyProfileClose = () => {
    setCompanyProfileOpen(false);
  };
  const fetchCompanyDetails = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/profile/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCompanyDetails(data);
      setCompanyProfileOpen(true); // Open the dialog after fetching details
    } catch (error) {
      console.error("Error fetching company details:", error);
      alert("Failed to fetch company details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [message, setMessage] = useState('');



  const handleApply = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const jobId = sessionStorage.getItem('selectedJobId');
      const employerId = sessionStorage.getItem('employerId');
      const companyName = sessionStorage.getItem('companyName');
      const logo = sessionStorage.getItem('logo');
      
      console.log('JOB ID:', jobId);
      console.log('User ID:', userId);
      const jobTitle = sessionStorage.getItem('selectedJob');

  
      // Fetch user profile data
      const profileResponse = await axios.get(`http://localhost:3000/Employeeprofile/profile/${userId}`);
      
      // Assuming the profile response contains the needed fields
      const {
        name,
        email,
        experience,
        degree,
        
        resume,  // Make sure the resume field is included in your API response
        address,
        skills,
        jobPreferences,
        photo,   // Ensure that this is included in your API response
        dob,
        phone,
      } = profileResponse.data; // Adjust according to the actual response structure
  
      // Prepare the application data
      const applicationData = {
        userId,
        jobId,
        jobTitle,
        companyName,
        name,
        email,
        experience,
        degree,
        jobTitle,
        resume,
        address,
        skills,
        jobPreferences,
        photo,
        dob,
        phone,
        employerId,
      };
  
      // Send application data to the server
      const response = await axios.post('http://localhost:3000/jobs/apply', applicationData);
  
      // Show success toast
      toast.success(response.data.message, {
        onClose: () => console.log('Success toast closed'),  // Optional handler
      });
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'An error occurred';
  
      // Show error toast
      toast.error(errorMessage, {
        onClose: () => console.log('Error toast closed'),  // Optional handler
      });
    }
  };
  
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: document.getElementById('jobs-section').offsetTop, behavior: 'smooth' });
  };

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setIsSearching(true);
    setCurrentPage(1); // Reset to first page when searching

    try {
      if (query.trim()) {
        const response = await axios.get(`http://localhost:3000/jobs/search?query=${query}`);
        setJobs(response.data);
      } else {
        // If search is empty, fetch all jobs again
        refreshJobs(); // Call the refresh function when search is cleared
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error searching jobs. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const refreshJobs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/jobs/approvedHome');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Error refreshing jobs. Please try again.');
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      handleSearch({ target: { value: query } });
    }, 500),
    []
  );

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(true);
    refreshJobs();
  };

  const handleFilterChange = async (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    // Update active filters
    const active = Object.entries(newFilters)
      .filter(([_, val]) => val !== '')
      .map(([key, val]) => ({ key, value: val }));
    setActiveFilters(active);

    try {
      const queryParams = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await axios.get(`http://localhost:3000/jobs/filter?${queryParams}`);
      setJobs(response.data);
      setCurrentPage(1); // Reset to first page when filters change
    } catch (error) {
      console.error('Filter error:', error);
      toast.error('Error applying filters. Please try again.');
    }
  };

  const handleRemoveFilter = (filterKey) => {
    handleFilterChange(filterKey, '');
  };

  // Add this function to check for expired jobs
  const checkExpiredJobs = async () => {
    try {
      await axios.put('http://localhost:3000/jobs/checkExpired');
      fetchJobs(); // Refresh the jobs list
    } catch (error) {
      console.error('Error checking expired jobs:', error);
    }
  };

  // Add useEffect to check expired jobs periodically
  useEffect(() => {
    // Check expired jobs when component mounts
    const checkExpiredJobs = async () => {
      try {
        await axios.put('http://localhost:3000/jobs/checkExpired');
        fetchJobs(); // Refresh the jobs list
      } catch (error) {
        console.error('Error checking expired jobs:', error);
      }
    };

    checkExpiredJobs();
    // Check every hour
    const interval = setInterval(checkExpiredJobs, 3600000);

    return () => clearInterval(interval);
  }, []);

  // Update your fetchJobs function (if you have one)
  const fetchJobs = async () => {
    try {
      // This will automatically update expired jobs before fetching
      const response = await axios.get('http://localhost:3000/jobs/approvedHome');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Error fetching jobs. Please try again.');
    }
  };

  // Update your job card to show expired status if applicable
  const JobCard = ({ job }) => {
    const isExpired = new Date(job.lastDate) < new Date();
    
    return (
      <AnimatedJobCard
        onClick={() => handleClickOpen(job)}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        sx={{
          height: '180px',
          width: '90%',
          opacity: isExpired ? 0.7 : 1,
        }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Existing card content */}
          
          {/* Add expired badge if job is expired */}
          {isExpired && (
            <Chip
              label="Expired"
              color="error"
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#ff1744',
                color: 'white',
              }}
            />
          )}
          
          {/* Add last date information */}
          <Typography
            variant="caption"
            sx={{
              color: isExpired ? '#ff1744' : 'text.secondary',
              mt: 1
            }}
          >
            Last Date: {new Date(job.lastDate).toLocaleDateString()}
          </Typography>
        </Box>
      </AnimatedJobCard>
    );
  };

  return (
    <div style={styles.wrapper}>
      {role === 'guest' && <Navbar />}
      {role === 'admin' && <NavbarAdmin />}
      {role === 'employee' && <NavbarEmployee />}
      {role === 'employer' && <NavbarEmployer />}

      <section style={styles.hero}>
        <div className="container text-center text-white">
          <h1 style={styles.heroTitle}>Welcome to JobPortal</h1>
          <p style={styles.heroSubtitle}>Your gateway to finding the best jobs and top talents</p>
          {role === 'guest' && (
            <a href="/signup" className="btn btn-lg mt-4" style={styles.getStartedButton}>
              Get Started
            </a>
          )}
        </div>
      </section>

      <section style={styles.features}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {[
              {
                title: 'Find Jobs',
                icon: <WorkIcon sx={{ fontSize: 40 }} />,
                description: 'Explore thousands of job listings across various industries.',
                color: '#2196f3'
              },
              {
                title: 'Top Companies',
                icon: <BusinessIcon sx={{ fontSize: 40 }} />,
                description: 'Connect with leading organizations and build your career.',
                color: '#3f51b5'
              },
              {
                title: 'Career Growth',
                icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
                description: 'Advance your career with expert guidance and resources.',
                color: '#1976d2'
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <StyledFeatureCard color={feature.color}>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      style={{ marginBottom: '1rem', color: feature.color }}
                    >
                      {feature.icon}
                    </motion.div>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        color: feature.color,
                        mb: 2
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.7
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </StyledFeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      <section id="jobs-section" style={styles.testimonials}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{
              color: '#360275',
              fontWeight: 'bold',
              mb: 4,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '4px',
                background: 'linear-gradient(90deg, #360275, #6a0dad)',
                borderRadius: '2px',
              }
            }}
          >
            LATEST JOBS
          </Typography>

          <JobsContainer>
            <SearchContainer>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for jobs, companies, or locations..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#360275' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {isSearching ? (
                        <CircularProgress size={20} sx={{ color: '#360275' }} />
                      ) : searchQuery ? (
                        <IconButton
                          onClick={handleClearSearch}
                          size="small"
                          sx={{ color: '#360275' }}
                        >
                          <CloseIcon />
                        </IconButton>
                      ) : null}
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(54, 2, 117, 0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#360275',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#360275',
                    },
                    '& input': {
                      padding: '15px 14px',
                      '&::placeholder': {
                        color: 'rgba(0, 0, 0, 0.6)',
                        opacity: 1,
                      },
                    },
                  },
                }}
              />
              {searchQuery && (
                <Box sx={{ 
                  mt: 2, 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Typography variant="body2" color="text.secondary">
                    {jobs.length} results found
                  </Typography>
                  <Button
                    size="small"
                    onClick={handleClearSearch}
                    startIcon={<CloseIcon />}
                    sx={{
                      color: '#360275',
                      '&:hover': {
                        backgroundColor: 'rgba(54, 2, 117, 0.1)',
                      },
                    }}
                  >
                    Clear Search
                  </Button>
                </Box>
              )}
            </SearchContainer>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 2,
              px: 2 
            }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {activeFilters.map((filter) => (
                  <FilterChip
                    key={filter.key}
                    label={`${filter.key}: ${filter.value}`}
                    onDelete={() => handleRemoveFilter(filter.key)}
                  />
                ))}
              </Box>
              <IconButton 
                onClick={() => setIsFilterDrawerOpen(true)}
                sx={{ 
                  backgroundColor: '#360275',
                  color: 'white',
                  '&:hover': { backgroundColor: '#4a0399' }
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Box>
            <FilterDrawer
              anchor="right"
              open={isFilterDrawerOpen}
              onClose={() => setIsFilterDrawerOpen(false)}
            >
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Filters</Typography>
                  <IconButton onClick={() => setIsFilterDrawerOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Job Type</InputLabel>
                  <Select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                    label="Job Type"
                  >
                    <MenuItem value="">All</MenuItem>
                    {jobTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Autocomplete
                    value={filters.location}
                    onChange={(event, newValue) => handleFilterChange('location', newValue)}
                    options={locations}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Location"
                        variant="outlined"
                        placeholder="Search location..."
                      />
                    )}
                    freeSolo
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(54, 2, 117, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#360275',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#360275',
                        },
                      },
                    }}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Experience</InputLabel>
                  <Select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    label="Experience"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="0">Fresher</MenuItem>
                    <MenuItem value="1-2">1-2 years</MenuItem>
                    <MenuItem value="3-5">3-5 years</MenuItem>
                    <MenuItem value="5+">5+ years</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Salary Range</InputLabel>
                  <Select
                    value={filters.salary}
                    onChange={(e) => handleFilterChange('salary', e.target.value)}
                    label="Salary Range"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="0-300000">0-3 LPA</MenuItem>
                    <MenuItem value="300000-600000">3-6 LPA</MenuItem>
                    <MenuItem value="600000-1000000">6-10 LPA</MenuItem>
                    <MenuItem value="1000000+">10+ LPA</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    setFilters({ jobType: '', location: '', experience: '', salary: '' });
                    setActiveFilters([]);
                    refreshJobs();
                  }}
                  sx={{
                    mt: 2,
                    backgroundColor: '#360275',
                    '&:hover': { backgroundColor: '#4a0399' }
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            </FilterDrawer>
            <Grid container spacing={3} marginLeft={'5px'}>
              {currentJobs.map((job, index) => (
                <Grid item xs={12} sm={6} md={6} key={job._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <AnimatedJobCard
                      onClick={() => handleClickOpen(job)}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      sx={{
                        height: '200px',
                        width: '90%',
                      }}
                    >
                      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Avatar and Text Container */}
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'row',
                          alignItems: 'center',
                          mb: 2,
                          gap: 2
                        }}>
                          <StyledAvatar
                            src={`http://localhost:3000/${job.logoUrl}`}
                            alt={job.companyName}
                          />
                          <Box sx={{ 
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: '#333',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                mb: 0.5,
                                textAlign: 'center'
                              }}
                            >
                              {job.jobTitle}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="primary"
                              sx={{
                                fontWeight: 500,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'center'
                              }}
                            >
                              {job.companyName}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Chips */}
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 1,
                          mt: 'auto'
                        }}>
                          <Chip
                            icon={<LocationOnIcon sx={{ fontSize: '0.9rem' }} />}
                            label={job.location}
                            size="large"
                            sx={{
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                              color: '#388e3c',
                              '& .MuiChip-icon': { color: '#388e3c' },
                            }}
                          />
                          <Chip
                            icon={<CurrencyRupeeIcon sx={{ fontSize: '0.9rem' }} />}
                            label={job.salary}
                            size="large"
                            sx={{
                              backgroundColor: 'rgba(33, 150, 243, 0.1)',
                              color: '#1976d2',
                              '& .MuiChip-icon': { color: '#1976d2' },
                            }}
                          />
                        </Box>
                      </Box>
                    </AnimatedJobCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4 
            }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    },
                  },
                  '& .Mui-selected': {
                    backgroundColor: '#360275 !important',
                    color: 'white',
                  },
                }}
              />
            </Box>
          </JobsContainer>

        </Container>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          {selectedJob && (
            <>
              <DialogTitle style={{
                position: 'relative', textAlign: 'center', paddingRight: '40px', backgroundColor: '#360275',
                color: '#fff',
              }}>
                <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                  {selectedJob.jobTitle}
                </Typography>
                <IconButton onClick={handleClose} style={{ position: 'absolute', right: 0, top: 0 }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent>
              <ToastContainer />
                <Card style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px' }}>
                  <Typography variant="h5" gutterBottom>
                    Job Details
                  </Typography>
                  <div style={styles.iconText}>
                    <BusinessIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Company: {selectedJob.companyName}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <LocationOnIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Location: {selectedJob.location}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <CurrencyRupeeIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Salary: {selectedJob.salary}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <TodayIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Last Date to Apply: {new Date(selectedJob.lastDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'  
                      })}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <WorkIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Job Type: {selectedJob.jobType}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <BadgeIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Experience: {selectedJob.experience} years
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <SchoolIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Qualifications: {selectedJob.qualifications}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <BuildIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Skills: {selectedJob.skills}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <DescriptionIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Job Description: {selectedJob.jobDescription}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <EmailIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Contact Details: {selectedJob.contactDetails}
                    </Typography>
                  </div>
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => fetchCompanyDetails(selectedJob.userId)} // Pass the company ID
                    >
                      View Company Profile
                    </Button>
                    <div>
                    <ToastContainer />
  {jobs.map((job, index) => (
    <div key={job._id}>
  <h2>{job.title}</h2>
  {index === 0 && role === "employee" && (
    <Button variant="contained" color="secondary" onClick={() => handleApply()}>
      Apply
    </Button>
  )}
</div>

  ))}
</div>
                  </div>
                </Card>
              </DialogContent>
            </>
          )}
        </Dialog>
        <Dialog open={companyProfileOpen} onClose={handleCompanyProfileClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h5">Company Profile</Typography>
            <IconButton onClick={handleCompanyProfileClose} style={{ position: 'absolute', right: 0, top: 0 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Card style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px', display: 'flex', flexDirection: 'row' }}>
              {companyDetails ? (
                <>
                  {/* First Section: Company Logo and Name */}
                  <div style={{ flex: 1, textAlign: 'left', marginRight: '20px' }}>
                    <Avatar
                      src={`http://localhost:3000/${companyDetails.logoUrl}`} // Assuming you have logoUrl in companyDetails
                      alt="Company Logo"
                      style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "path/to/default-image.png";
                      }}
                    />
                    <div style={{ marginLeft: "0px" }}>
                      <Typography variant="h5">{companyDetails.cname}</Typography>

                    </div>
                  </div>

                  {/* Second Section: Remaining Company Details */}
                  <div style={{ flex: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      Address: {companyDetails.address}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Email: {companyDetails.email}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Website: {companyDetails.website}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Tagline: {companyDetails.tagline}
                    </Typography>
                    {/* Add more company details as needed */}
                  </div>
                </>
              ) : (
                <Typography variant="body1">Loading company details...</Typography> // Fallback for loading state
              )}
            </Card>
          </DialogContent>
        </Dialog>

      </section>

      <Footer />
    </div>
  );
};

const styles = {
  wrapper: {
    margin: 0,
    padding: 0,
    fontFamily: 'Arial, sans-serif',
  },
  hero: {
    height: '400px',
    backgroundColor: '#360275',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: '4rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    background: 'linear-gradient(45deg, #fff, #e3f2fd)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    opacity: 0.9,
  },
  getStartedButton: {
    backgroundColor: '#fff',
    color: '#1a237e',
    padding: '15px 40px',
    borderRadius: '30px',
    fontSize: '1.2rem',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    marginBottom: '40px',
    '&:hover': {
      backgroundColor: '#f5f5f5',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
    },
  },
  features: {
    padding: '50px 0',
  },
  icon: {
    marginRight: '8px',
  },
  testimonials: {
    padding: '50px 0',
  },
    listContainer: {
      display: 'flex',
      justifyContent: 'center',
      listStyle: 'none',
      padding: '20px',
      background: 'linear-gradient(135deg, #f0f0f5, #e0e0ff)', // Adds a light gradient background
      border: '2px solid #360275', // Adds a prominent border
      borderRadius: '15px', // Rounds the container's corners
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // Enhances shadow for a subtle 3D effect
      maxWidth: '90%',
      margin: '0 auto',
    },
    columnsWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '20px',
      width: '100%',
    },
    column: {
      width: '45%',
    },
    listItem: {
      listStyleType: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      backgroundColor: '#fff', // White background for each list item
      border: '1px solid #ddd',
      borderRadius: '10px', // Rounds corners of each item
      marginBottom: '10px', // Adds space between items
      boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease', // Animation for hover effect
    },
    logo: {
      width: '80px',
      height: '80px',
      marginRight: '15px',
      borderRadius: '50%', // Circular logo style
      border: '1px solid #360275',
    },
  
    iconText: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
    },
    viewmore: {
      backgroundColor: '#360275',
      color: '#fff',
      borderRadius: '20px',
      padding: '5px 15px',
      boxShadow: '0px 3px 8px rgba(54, 2, 117, 0.3)',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: '#5e379a',
      },
    },
    listItemHover: {
      transform: 'scale(1.02)', // Scale effect on hover
    },
  searchContainer: {
    position: 'sticky',
    top: 0,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    padding: '20px 0',
  },
};
  

export default HomePage;


