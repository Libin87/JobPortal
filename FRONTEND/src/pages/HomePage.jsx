import React, { useEffect, useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';
import NavbarAdmin from './admin/NavbarAdmin';
import NavbarEmployee from './employee/NavbarEmployee';
import NavbarEmployer from './employer/NavbarEmployer';
import { Avatar, Container, Divider, ListItem, ListItemText, Button, Card, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, Chip, Pagination, Box, CircularProgress, FormControl, InputLabel, Select, MenuItem ,Drawer} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
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
import { formatDate } from '../utils/dateFormatter';

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
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '20px',
  height: '220px',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'linear-gradient(180deg, transparent 0%, rgba(79, 172, 254, 0.1) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    '&::before': {
      opacity: 1,
    },
    '&::after': {
      opacity: 1,
    },
    '& .job-card-content': {
      transform: 'translateY(-5px)',
    },
    '& .company-logo': {
      transform: 'scale(1.1) rotate(5deg)',
    },
    '& .job-title': {
      color: '#4facfe',
  },
  },
}));

const JobCardContent = styled(Box)({
  padding: '20px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 1,
  transition: 'transform 0.3s ease',
});

const SearchContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
  backdropFilter: 'blur(20px)',
  borderRadius: '40px',
  padding: '30px',
  marginBottom: '40px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto 40px auto',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -100,
    left: -100,
    width: 200,
    height: 200,
    background: 'radial-gradient(circle, rgba(79, 172, 254, 0.1) 0%, transparent 70%)',
    animation: 'float 6s infinite ease-in-out',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translate(0, 0)' },
    '50%': { transform: 'translate(30px, 30px)' },
  },
}));

const JobsContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
  backdropFilter: 'blur(20px)',
  borderRadius: '30px',
  padding: '40px',
  margin: '40px auto',
  maxWidth: '1400px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #4facfe, #00f2fe, #4facfe)',
    backgroundSize: '200% 100%',
    animation: 'gradient 3s linear infinite',
  },
  '@keyframes gradient': {
    '0%': { backgroundPosition: '0% 0%' },
    '100%': { backgroundPosition: '200% 0%' },
  },
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

const formatExperience = (experience) => {
  if (!experience) return 'Not specified';
  
  if (typeof experience === 'object') {
    const years = experience.years || 0;
    const months = experience.months || 0;
    if (years === 0 && months === 0) return 'Fresher';
    return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`.trim();
  }
  
  return `${experience} year${experience !== 1 ? 's' : ''}`;
};

const GlowingTitle = styled(Typography)(({ theme }) => ({
  fontSize: '4.5rem',
  fontWeight: 800,
  background: 'linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 0 20px rgba(79, 172, 254, 0.5)',
  animation: 'glow 3s ease-in-out infinite alternate',
  '@keyframes glow': {
    '0%': {
      textShadow: '0 0 20px rgba(79, 172, 254, 0.5)',
    },
    '100%': {
      textShadow: '0 0 30px rgba(79, 172, 254, 0.8), 0 0 50px rgba(79, 172, 254, 0.3)',
    },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '3rem',
  },
}));

const FuturisticSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  color: '#fff',
  opacity: 0.9,
  fontWeight: 300,
  letterSpacing: '1px',
  textShadow: '0 0 10px rgba(255,255,255,0.5)',
  animation: 'fadeInUp 1s ease-out',
  '@keyframes fadeInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 0.9,
      transform: 'translateY(0)',
    },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.4rem',
  },
}));

const FuturisticHeroSection = styled('section')(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
  minHeight: '600px',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    animation: 'pulse 4s ease-in-out infinite',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '200%',
    height: '200%',
    background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.1) 48%, rgba(255,255,255,0.1) 52%, transparent 55%)',
    transform: 'translate(-50%, -50%) rotate(45deg)',
    animation: 'scan 10s linear infinite',
  },
  '@keyframes scan': {
    '0%': { transform: 'translate(-50%, -50%) rotate(45deg) translateY(100%)' },
    '100%': { transform: 'translate(-50%, -50%) rotate(45deg) translateY(-100%)' },
  },
  '@keyframes pulse': {
    '0%': { opacity: 0.5 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0.5 },
  },
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 900,
  background: 'linear-gradient(-45deg, #fff 0%, #e3f2fd 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '1rem',
  position: 'relative',
  textAlign: 'center',
  animation: 'titlePulse 3s ease-in-out infinite',
  '@keyframes titlePulse': {
    '0%, 100%': {
      textShadow: '0 0 30px rgba(255,255,255,0.3)',
      transform: 'scale(1)',
    },
    '50%': {
      textShadow: '0 0 50px rgba(255,255,255,0.5)',
      transform: 'scale(1.02)',
    },
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '2.8rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const AnimatedSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  color: '#fff',
  opacity: 0.9,
  fontWeight: 300,
  letterSpacing: '3px',
  textAlign: 'center',
  position: 'relative',
  textShadow: '0 2px 15px rgba(255,255,255,0.3)',
  animation: 'subtitleFloat 5s ease-in-out infinite',
  '@keyframes subtitleFloat': {
    '0%, 100%': {
      transform: 'translateY(0)',
    },
    '50%': {
      transform: 'translateY(-10px)',
    },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.2rem',
    letterSpacing: '2px',
  },
}));

const EnhancedHeroSection = styled('section')(({ theme }) => ({
  background: 'linear-gradient(-45deg, #1a237e, #0d47a1, #283593, #1565c0)',
  backgroundSize: '400% 400%',
  animation: 'gradientBG 15s ease infinite',
  minHeight: '60vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  padding: '2rem 0',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
  },
}));

const ParticlesContainer = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  overflow: 'hidden',
  zIndex: 1,
});

const FloatingShapes = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  overflow: 'hidden',
  zIndex: 1,
  '& > div': {
    position: 'absolute',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    animation: 'float 8s infinite',
  },
});

const WaveContainer = styled('div')({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  overflow: 'hidden',
  lineHeight: 0,
  transform: 'rotate(180deg)',
  '& svg': {
    position: 'relative',
    display: 'block',
    width: 'calc(100% + 1.3px)',
    height: '120px',
  },
  '& .shapeFill': {
    fill: '#FFFFFF',
    opacity: 0.2,
  },
});

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



  const handleApply = async (job) => {
    try {
      const userId = sessionStorage.getItem('userId');
      
      if (!userId) {
        toast.error('Please login to apply for jobs', {
          duration: 3000,
          position: 'top-center',
          icon: '🔒',
        });
        navigate('/login');
        return;
      }

      // Show loading toast
      const loadingToastId = toast.loading('Submitting your application...', {
        position: 'top-center'
      });

      // Check if already applied
      const checkResponse = await axios.get(`http://localhost:3000/jobs/check-application`, {
        params: { 
          userId: userId,
          jobId: job._id 
        }
      });

      if (checkResponse.data.hasApplied) {
        toast.dismiss(loadingToastId);
        toast.error('You have already applied for this job!', {
          duration: 3000,
          position: 'top-center',
          icon: '⚠️'
        });
        return;
      }

      // Submit application with basic data
      const applicationData = {
        userId: userId,
        jobId: job._id,
        jobTitle: job.jobTitle,
        companyName: job.companyName
      };

      const response = await axios.post(
        `http://localhost:3000/jobs/apply`, 
        applicationData
      );

      toast.dismiss(loadingToastId);

      if (response.data.message) {
        toast.success('Application submitted successfully!', {
          duration: 3000,
          position: 'top-center',
          icon: '✅'
        });

        handleClose();

        // Show test message if required
        if (response.data.testRequired) {
          setTimeout(() => {
            toast.info('Please check your profile for the required test', {
              duration: 3000,
              position: 'top-center',
              icon: 'ℹ️'
            });
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(
        error.response?.data?.message || 'Failed to submit application. Please try again.',
        {
          duration: 3000,
          position: 'top-center',
          icon: '❌'
        }
      );
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
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <JobCardContent className="job-card-content">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <StyledAvatar
              src={`http://localhost:3000/${job.logoUrl}`}
              alt={job.companyName}
              className="company-logo"
            />
            <Box sx={{ ml: 2 }}>
              <Typography
                variant="h6"
                className="job-title"
        sx={{
                  fontWeight: 600,
                  color: '#333',
                  transition: 'color 0.3s ease',
                }}
              >
                {job.jobTitle}
              </Typography>
              <Typography
                variant="subtitle2"
                color="primary"
                sx={{ fontWeight: 500 }}
              >
                {job.companyName}
              </Typography>
            </Box>
          {isExpired && (
            <Chip
              label="Expired"
              color="error"
              size="small"
              sx={{
                position: 'absolute',
                  top: 20,
                  right: 20,
                backgroundColor: '#ff1744',
                color: 'white',
              }}
            />
          )}
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip
              icon={<LocationOnIcon sx={{ fontSize: '0.9rem' }} />}
              label={job.location}
              size="small"
              sx={{
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                color: '#388e3c',
                '& .MuiChip-icon': { color: '#388e3c' },
              }}
            />
            <Chip
              icon={<CurrencyRupeeIcon sx={{ fontSize: '0.9rem' }} />}
              label={job.salary}
              size="small"
              sx={{
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                color: '#1976d2',
                '& .MuiChip-icon': { color: '#1976d2' },
              }}
            />
            <Chip
              icon={<WorkIcon sx={{ fontSize: '0.9rem' }} />}
              label={job.jobType}
              size="small"
              sx={{
                backgroundColor: 'rgba(156, 39, 176, 0.1)',
                color: '#7b1fa2',
                '& .MuiChip-icon': { color: '#7b1fa2' },
              }}
            />
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: isExpired ? '#ff1744' : 'text.secondary',
              mt: 'auto',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TodayIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
            Last Date: {formatDate(job.lastDate)}
          </Typography>
        </JobCardContent>
      </AnimatedJobCard>
    );
  };

  return (
    <div style={styles.wrapper}>
      {role === 'guest' && <Navbar />}
      {role === 'admin' && <NavbarAdmin />}
      {role === 'employee' && <NavbarEmployee />}
      {role === 'employer' && <NavbarEmployer />}

      <EnhancedHeroSection>
        <ParticlesContainer>
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
                opacity: Math.random() * 0.3 + 0.2,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 50 - 25, 0],
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: 'absolute',
                width: Math.random() * 8 + 3,
                height: Math.random() * 8 + 3,
                borderRadius: '50%',
                background: 'white',
                boxShadow: '0 0 10px rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </ParticlesContainer>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box 
            sx={{ 
              textAlign: 'center',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <HeroTitle variant="h1">
                Welcome to JobPortal
              </HeroTitle>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <AnimatedSubtitle>
                Your gateway to finding the best jobs and top talents
              </AnimatedSubtitle>
            </motion.div>
          </Box>
        </Container>

        <WaveContainer>
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shapeFill"></path>
          </svg>
        </WaveContainer>
      </EnhancedHeroSection>

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
                    <JobCard job={job} />
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
              <DialogTitle 
                style={{
                  position: 'relative', 
                  textAlign: 'center', 
                  paddingRight: '40px', 
                  backgroundColor: '#360275',
                color: '#fff',
                }}
              >
                <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                  {selectedJob.jobTitle}
                </Typography>
                <IconButton 
                  onClick={handleClose} 
                  style={{ position: 'absolute', right: 0, top: 0 }}
                >
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
                      Last Date to Apply: {formatDate(selectedJob.lastDate)}
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
                      Experience: {formatExperience(selectedJob.experience)}
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
                      onClick={() => fetchCompanyDetails(selectedJob.userId)}
                    >
                      View Company Profile
                    </Button>
                    <div>
                      {role === "employee" && (
                        <Button 
                          variant="contained" 
                          color="secondary" 
                          onClick={() => handleApply(selectedJob)}
                          disabled={!selectedJob}
                        >
                          Apply Now
    </Button>
  )}
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


