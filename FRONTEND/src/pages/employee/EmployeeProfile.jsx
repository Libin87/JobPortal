import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Button, TextField, Typography, Avatar, MenuItem,
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import { styled } from '@mui/system';
import Footer from '../../components/Footer';
import NavbarEmployee from './NavbarEmployee';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import DescriptionIcon from '@mui/icons-material/Description';

const ProfileContainer = styled(Container)(({ theme }) => ({
  maxWidth: '90%',
  marginTop: '50px',
  backgroundColor: '#F7F9FC',
  borderRadius: '20px',
  padding: '50px',
  minHeight: '500px',
  marginBottom: '30px',
  boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: '160px',
  height: '160px',
  marginBottom: '10px',
}));

const UploadButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#5A5BFF',
  color: '#FFF',
  width: '100%',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: '#4748CC',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#3A3B3C',
  color: '#FFF',
  width: '100%',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: '#2A2B2C',
  },
}));

const EmployeeProfile = () => {
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);  // Store the selected photo file
  const [resumeFile, setResumeFile] = useState(null);
  const [isProfileExists, setIsProfileExists] = useState(false); // Tracks if profile exists
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    degree: '',
    experienceYears: '',
    experienceMonths: '',
    skills: [],
    jobPreferences: [],
    dob: '',
  });

  const [fieldError, setFieldError] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    degree: '',
    experienceYears: '',
    experienceMonths: '',
    dob: '',
  });

  const [resumePreview, setResumePreview] = useState('');
  const [atsScore, setAtsScore] = useState(0);
  const [atsDetails, setAtsDetails] = useState(null);
  const [calculatingScore, setCalculatingScore] = useState(false);

  useEffect(() => {
    const loadSessionData = () => {
      const name = sessionStorage.getItem('name');
      const email = sessionStorage.getItem('email');
      const phone = sessionStorage.getItem('phone');

      setFormData(prevData => ({
        ...prevData,
        name: name || '',
        email: email || '',
        phone: phone || '',
      }));
    };

    const userId = sessionStorage.getItem('userId');
    console.log('userId', userId);

    if (userId) {
      fetchProfile(userId, loadSessionData);
    } else {
      // Load session data directly if no userId is found
      loadSessionData();
      setIsEditing(true); // Enable editing for new profiles
    }
  }, []);

  const fetchProfile = async (userId, fallback) => {
    try {
      const response = await axios.get(`http://localhost:3000/Employeeprofile/profile/${userId}`);
      const profileData = response.data;
      console.log('Fetched profile data:', profileData);

      if (profileData && profileData._id) {
        // Profile exists, update formData with the fetched profile data
        setFormData((prevData) => ({
          ...prevData,
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          degree: profileData.degree || [],
          experienceYears: profileData.experienceYears || '',
          experienceMonths: profileData.experienceMonths || '',
          skills: Array.isArray(profileData.skills) ? profileData.skills : [],
          jobPreferences: Array.isArray(profileData.jobPreferences) ? profileData.jobPreferences : [],
          dob: profileData.dob ? profileData.dob.slice(0, 10) : '',
        }));
        setPhotoPreview(profileData.photo ? `http://localhost:3000/${profileData.photo}` : '');
        setResumePreview(profileData.resume ? `http://localhost:3000/${profileData.resume}` : '');
        setIsProfileExists(true);
        setIsEditing(false); // Start in view mode for existing profiles
      } else {
        // Profile does not exist, use session data as a fallback
        setIsProfileExists(false);
        setIsEditing(true); // Enable editing for new profiles
        fallback();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setIsProfileExists(false);
      setIsEditing(true); // Enable editing if there's an error
      fallback(); // Use session data if there's an error fetching the profile
    }
  };

  const jobPreferencesOptions = [
    'Frontend Developer', 'UI Designer', 'Backend Developer', 'Fullstack Developer',
    'Project Manager', 'Data Scientist', 'Product Designer', 'DevOps Engineer',
    'QA Engineer', 'Marketing Specialist', 'HR Manager', 'Content Writer',
    'Software Engineer', 'Cybersecurity Analyst', 'Cloud Engineer', 'AI Engineer',
    'Machine Learning Engineer', 'Business Analyst', 'Blockchain Developer',
    'Game Developer', 'Embedded Systems Engineer', 'Mobile App Developer',
    'Systems Administrator', 'Network Engineer', 'SEO Specialist', 'Digital Marketer',
    'IT Support Specialist', 'Technical Writer', 'E-commerce Manager',
    'IT Consultant', 'Scrum Master', 'Solution Architect', 'Salesforce Developer',
    'SAP Consultant', 'Big Data Engineer', 'IoT Engineer'
  ];
  const skillOptions = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'C++', 'C#',
    'HTML', 'CSS', 'Ruby on Rails', 'PHP', 'Go', 'Kotlin', 'Swift', 'TypeScript',
    'Angular', 'Vue.js', 'Django', 'Flutter', 'Machine Learning', 'Data Science',
    'DevOps', 'Blockchain', 'Docker', 'Kubernetes', 'TensorFlow', 'R', 'Scala',
    'Unity', 'Unreal Engine', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Rust', 'Spring Boot',
    'Express.js', 'FastAPI', 'NestJS', 'Next.js', 'Svelte', 'Tailwind CSS', 
    'Redux', 'Jenkins', 'Terraform', 'Ansible', 'Google Cloud', 'Azure', 'Cybersecurity',
    'Penetration Testing', 'Ethical Hacking', 'Pandas', 'NumPy', 'PyTorch', 
    'Hadoop', 'Spark', 'Figma', 'Adobe XD', 'UX/UI Design', 'JIRA', 'Confluence',
    'Agile Methodologies', 'SCRUM', 'Salesforce', 'SAP', 'MATLAB', 'Power BI', 
    'Tableau', 'AR/VR Development', 'Web3', 'Solidity', 'Smart Contracts'
  ];

  const validateName = (name) => {
    if (!name) return 'Name is required';
    if (name.length < 3) return 'Name must be at least 3 characters';
    if (name.length > 15) return 'Name must be at most 15 characters';
    
    // Check for more than 3 consecutive identical letters
    for (let i = 0; i < name.length - 2; i++) {
      if (name[i] === name[i+1] && name[i] === name[i+2]) {
        return 'Name cannot have more than 3 consecutive identical letters';
      }
    }
    return '';
  };

  const validateAddress = (address) => {
    if (!address) return 'Address is required';
    if (address.length < 3) return 'Address must be at least 3 characters';
    if (address.length > 15) return 'Address must be at most 15 characters';
    
    // Check for more than 3 consecutive identical characters
    for (let i = 0; i < address.length - 2; i++) {
      if (address[i] === address[i+1] && address[i] === address[i+2]) {
        return 'Address cannot have more than 3 consecutive identical characters';
      }
    }
    
    // Count digits
    const digitCount = (address.match(/\d/g) || []).length;
    if (digitCount > 3) {
      return 'Address cannot have more than 3 digits';
    }
    
    return '';
  };

  const validateDOB = (dob) => {
    if (!dob) return 'Date of birth is required';
    
    const birthDate = new Date(dob);
    const today = new Date();
    
    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 15) return 'You must be at least 15 years old';
    if (age > 50) return 'Age cannot be more than 50 years';
    
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow changes if editing is enabled or for specific fields
    if (!isEditing && isProfileExists && name !== 'name' && name !== 'email' && name !== 'phone') {
      return;
    }
    
    // Phone validation
    if (name === 'phone') {
      // Remove any non-digit characters
      const phoneValue = value.replace(/\D/g, '');
      
      // Validate phone number
      let error = '';
      if (phoneValue.length > 0 && phoneValue.length !== 10) {
        error = 'Phone number must be 10 digits';
      } else if (phoneValue.length === 10 && !/^[6-9]\d{9}$/.test(phoneValue)) {
        error = 'Enter a valid Indian phone number starting with 6-9';
      }

      setFieldError(prev => ({
        ...prev,
        phone: error
      }));

      setFormData(prev => ({
        ...prev,
        phone: phoneValue
      }));
      return;
    }
    
    // Name validation
    if (name === 'name') {
      const error = validateName(value);
      setFieldError(prev => ({
        ...prev,
        name: error
      }));
    }
    
    // Address validation
    if (name === 'address') {
      const error = validateAddress(value);
      setFieldError(prev => ({
        ...prev,
        address: error
      }));
    }
    
    // Experience years validation
    if (name === 'experienceYears') {
      const years = parseInt(value);
      let error = '';
      
      if (isNaN(years)) {
        error = 'Please enter a valid number';
      } else if (years < 0) {
        error = 'Experience years cannot be negative';
      } else if (years > 40) {
        error = 'Experience years cannot exceed 40';
      }
      
      setFieldError(prev => ({
        ...prev,
        experienceYears: error
      }));
    }
    
    // Experience months validation
    if (name === 'experienceMonths') {
      const months = parseInt(value);
      let error = '';
      
      if (isNaN(months)) {
        error = 'Please enter a valid number';
      } else if (months < 0) {
        error = 'Experience months cannot be negative';
      } else if (months > 11) {
        error = 'Experience months cannot exceed 11';
      }
      
      setFieldError(prev => ({
        ...prev,
        experienceMonths: error
      }));
    }
    
    // Date of birth validation
    if (name === 'dob') {
      const error = validateDOB(value);
      setFieldError(prev => ({
        ...prev,
        dob: error
      }));
    }

    // Handle other fields normally
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      degree: '',
      experienceYears: '',
      experienceMonths: '',
      skills: [],
      jobPreferences: [],
      dob: '',
    });
    setPhotoPreview(''); // Reset photo preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit button clicked');
    console.log('Current form data:', formData);
    console.log('isProfileExists:', isProfileExists);

    // Basic validation
    if (!formData.name || !formData.phone) {
      toast.error('Name and phone number are required');
      return;
    }

    // Create FormData object for file uploads
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('address', formData.address || '');
    
    // Handle degree as array
    if (Array.isArray(formData.degree) && formData.degree.length > 0) {
      data.append('degree', formData.degree.join(','));
      console.log('Degree (array):', formData.degree.join(','));
    } else if (formData.degree) {
      data.append('degree', formData.degree);
      console.log('Degree (string):', formData.degree);
    }
    
    data.append('experienceYears', formData.experienceYears || 0);
    data.append('experienceMonths', formData.experienceMonths || 0);
    
    // Handle arrays properly
    if (Array.isArray(formData.skills) && formData.skills.length > 0) {
      data.append('skills', formData.skills.join(','));
      console.log('Skills:', formData.skills.join(','));
    }
    
    if (Array.isArray(formData.jobPreferences) && formData.jobPreferences.length > 0) {
      data.append('jobPreferences', formData.jobPreferences.join(','));
      console.log('Job Preferences:', formData.jobPreferences.join(','));
    }
    
    data.append('dob', formData.dob || '');

    // Append photo and resume files if selected
    if (photoFile) {
      data.append('photo', photoFile);
      console.log('Photo file attached:', photoFile.name);
    }
    
    if (resumeFile) {
      data.append('resume', resumeFile);
      console.log('Resume file attached:', resumeFile.name);
    }

    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      toast.error('User ID not found. Please log in again.');
      return;
    }

    data.append('userId', userId);
    console.log('Submitting profile with userId:', userId);

    // Log all form data entries for debugging
    for (let [key, value] of data.entries()) {
      console.log(`FormData: ${key} = ${value}`);
    }

    try {
      setIsLoading(true);
      
      let response;
      const url = isProfileExists 
        ? `http://localhost:3000/Employeeprofile/update/${userId}`
        : 'http://localhost:3000/Employeeprofile/create';
      
      console.log(`Making ${isProfileExists ? 'PUT' : 'POST'} request to ${url}`);
      
      // Use the correct HTTP method based on whether we're updating or creating
      if (isProfileExists) {
        console.log('Updating existing profile...');
        response = await axios.put(url, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        console.log('Creating new profile...');
        response = await axios.post(url, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      console.log("Profile response:", response.data);
      
      // Update the user record with name and phone
      const userUpdateResponse = await axios.put(`http://localhost:3000/user/update/${userId}`, {
        name: formData.name,
        phone: formData.phone,
      });
      console.log("User update response:", userUpdateResponse.data);
      
      toast.success(`Profile ${isProfileExists ? 'updated' : 'created'} successfully!`);
      
      // Update session storage with new values
      sessionStorage.setItem('name', formData.name);
      sessionStorage.setItem('phone', formData.phone);
      
      // Refresh profile data
      console.log('Refreshing profile data...');
      fetchProfile(userId, () => {
        console.log('Profile refreshed successfully');
      });
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      const errorMessage = error.response?.data?.message || 'Failed to save profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);  // Store the resume file in state
      setResumePreview(URL.createObjectURL(file));  // Generate preview URL
    }
  };

  // Update the qualification options
  const qualificationOptions = [
    { group: "Computer Science", degrees: [
      "BCA", "MCA", "B.Tech in Computer Science", "M.Tech in Computer Science",
      "BSc Computer Science", "MSc Computer Science", "BSc Computer Applications",
      "MSc Computer Applications"
    ]},
    { group: "Engineering", degrees: [
      "B.Tech", "M.Tech", "BE", "ME",
      "B.Tech in Electronics", "M.Tech in Electronics",
      "B.Tech in Electrical", "M.Tech in Electrical"
    ]},
    { group: "Business", degrees: [
      "BBA", "MBA", "BBM", "PGDM",
      "Bachelor's in Economics", "Master's in Economics",
      "Bachelor's in Commerce", "Master's in Commerce"
    ]},
    { group: "General", degrees: [
      "Associate's Degree", "Bachelor's Degree",
      "Master's Degree", "PhD", "Diploma",
      "Certificate Course"
    ]}
  ];

  // Add function to handle custom options
  const handleCustomOption = (value, fieldName, options) => {
    if (value && !options.includes(value)) {
      // Add the custom value to the formData
      setFormData(prev => ({
        ...prev,
        [fieldName]: Array.isArray(prev[fieldName]) 
          ? [...prev[fieldName], value]
          : [value]
      }));
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx'];

    if (!allowedExtensions.includes(fileExtension)) {
      toast.error('Please upload a valid resume file (PDF, DOC, or DOCX only)');
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    setCalculatingScore(true);
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
      const userId = sessionStorage.getItem('userId');
      console.log('Uploading resume for user:', userId);
      
      const response = await axios.put(
        `http://localhost:3000/Employeeprofile/update/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Resume upload response:', response.data);

      if (response.data.updatedProfile) {
        setResumeFile(file);
        setResumePreview(file.name);
        
        // Check if the document is actually a resume by validating content
        if (response.data.updatedProfile.atsScore === 0 || !response.data.updatedProfile.atsDetails) {
          toast.error('The uploaded document does not appear to be a valid resume. Please upload a proper resume with relevant content.');
          return;
        }
        
        // Check if ATS score calculation was successful
        if (response.data.updatedProfile.atsScore) {
          setAtsScore(response.data.updatedProfile.atsScore);
          setAtsDetails(response.data.updatedProfile.atsDetails);
          toast.success(`Resume uploaded and analyzed successfully! ATS Score: ${response.data.updatedProfile.atsScore}%`);
        } else {
          toast.warning('Resume uploaded but could not analyze content. Please ensure it contains relevant text.');
        }
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload resume';
      
      if (error.response?.data?.invalidContent) {
        toast.error('The uploaded file does not appear to be a valid resume. Please upload a proper resume.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setCalculatingScore(false);
    }
  };

  // Add useEffect to fetch ATS score when profile is loaded
  useEffect(() => {
    const fetchATSScore = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
          const response = await axios.get(`http://localhost:3000/Employeeprofile/ats-score/${userId}`);
          setAtsScore(response.data.atsScore);
          setAtsDetails(response.data.atsDetails);
        }
      } catch (error) {
        console.error('Error fetching ATS score:', error);
      }
    };

    fetchATSScore();
  }, []);

  return (
    <div>
      <NavbarEmployee />
      <ProfileContainer>
        <ToastContainer />
        <Grid container justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" color="#360275">
            {isProfileExists ? 'Employee Profile' : 'Create Profile'}
          </Typography>
          {isProfileExists && (
            <IconButton 
              onClick={() => setIsEditing(!isEditing)}
              sx={{ 
                backgroundColor: isEditing ? '#4CAF50' : '#1976d2',
                color: 'white',
                '&:hover': {
                  backgroundColor: isEditing ? '#45a049' : '#1565c0'
                }
              }}
            >
              <EditIcon />
            </IconButton>
          )}
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
              <Grid container direction="column" alignItems="center">
                <ProfileAvatar src={photoPreview} alt="Profile Photo" />
                <Typography variant="h6">{formData.name || 'Your Name'}</Typography>
                <input
                  accept=".jpg, .png"
                  id="photo-upload"
                  type="file"
                  style={{ display: 'none' }}
                  disabled={!isEditing && isProfileExists}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () => setPhotoPreview(reader.result);
                    if (file) {
                      setPhotoFile(file);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label htmlFor="photo-upload">
                  <UploadButton 
                    variant="contained" 
                    component="span"
                    disabled={!isEditing && isProfileExists}
                  >
                    Upload Photo
                  </UploadButton>
                </label>

                <input
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  id="resume-upload"
                  type="file"
                  style={{ display: 'none' }}
                  disabled={!isEditing && isProfileExists}
                  onChange={handleResumeUpload}
                />
                <label htmlFor="resume-upload">
                  <UploadButton 
                    variant="contained" 
                    component="span"
                    disabled={!isEditing && isProfileExists}
                  >
                    Upload Resume
                  </UploadButton>
                </label>

                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {resumePreview && (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<DescriptionIcon />}
                      onClick={() => {
                        // If resumePreview is a URL, open it in a new tab
                        if (resumePreview.startsWith('http')) {
                          window.open(resumePreview, '_blank');
                        } else {
                          // If it's just a filename, construct the URL from the backend
                          const userId = sessionStorage.getItem('userId');
                          window.open(`http://localhost:3000/Employeeprofile/view-resume/${userId}`, '_blank');
                        }
                      }}
                      sx={{ mt: 1, width: '100%' }}
                    >
                      View Resume
                    </Button>
                  )}
                  {resumePreview && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      {typeof resumePreview === 'string' && resumePreview.includes('/') 
                        ? resumePreview.split('/').pop() 
                        : resumePreview}
                    </Typography>
                  )}
                </Box>
              </Grid>
              {resumePreview && (
                <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    ATS Score Analysis
                  </Typography>
                  
                  {calculatingScore ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CircularProgress
                          variant="determinate"
                          value={atsScore}
                          size={60}
                          thickness={4}
                          sx={{
                            color: atsScore >= 80 ? 'success.main' :
                                   atsScore >= 60 ? 'warning.main' :
                                   'error.main'
                          }}
                        />
                        <Typography variant="h6" sx={{ ml: 2 }}>
                          {Math.round(atsScore)}%
                        </Typography>
                      </Box>

                      {atsDetails && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Detailed Scores:
                          </Typography>
                          
                          {/* Skills Score */}
                          <Box sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">Skills & Keywords</Typography>
                              <Typography variant="body2">{Math.round(atsDetails.skillsScore)}%</Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={atsDetails.skillsScore}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>

                          {/* Structure Score */}
                          <Box sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">Resume Structure</Typography>
                              <Typography variant="body2">{Math.round(atsDetails.structureScore)}%</Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={atsDetails.structureScore}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>

                          {/* Add other scores similarly */}

                          {atsDetails.suggestions?.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Suggestions for Improvement:
                              </Typography>
                              {atsDetails.suggestions.map((suggestion, index) => (
                                <Typography 
                                  key={index}
                                  variant="body2"
                                  sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 0.5
                                  }}
                                >
                                  <TrendingUpIcon fontSize="small" />
                                  {suggestion}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!fieldError.name}
                    helperText={fieldError.name}
                    required
                    disabled={!isEditing && isProfileExists}
                    inputProps={{
                      maxLength: 15
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    disabled={true}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      "& .MuiInputBase-input.Mui-readOnly": {
                        backgroundColor: "#f5f5f5"
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!fieldError.phone}
                    helperText={fieldError.phone}
                    required
                    disabled={!isEditing && isProfileExists}
                    inputProps={{
                      maxLength: 10,
                      pattern: "[0-9]*"
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Address"
                    name="address"
                    fullWidth
                    required
                    disabled={!isEditing && isProfileExists}
                    value={formData.address}
                    onChange={handleChange}
                    error={!!fieldError.address}
                    helperText={fieldError.address}
                    inputProps={{
                      maxLength: 15
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    disabled={!isEditing && isProfileExists}
                    options={qualificationOptions.flatMap(group => group.degrees)}
                    value={Array.isArray(formData.degree) ? formData.degree : []}
                    onChange={(event, newValue) => {
                      setFormData({
                        ...formData,
                        degree: newValue
                      });
                    }}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Qualifications"
                        error={!!fieldError.degree}
                        helperText={fieldError.degree}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Experience (Years)"
                    name="experienceYears"
                    fullWidth
                    required
                    disabled={!isEditing && isProfileExists}
                    value={formData.experienceYears}
                    onChange={handleChange}
                    error={!!fieldError.experienceYears}
                    helperText={fieldError.experienceYears}
                    type="number"
                    InputProps={{
                      inputProps: { min: 0, max: 40 }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Experience (Months)"
                    name="experienceMonths"
                    fullWidth
                    required
                    disabled={!isEditing && isProfileExists}
                    value={formData.experienceMonths}
                    onChange={handleChange}
                    error={!!fieldError.experienceMonths}
                    helperText={fieldError.experienceMonths}
                    type="number"
                    InputProps={{
                      inputProps: { min: 0, max: 11 }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    disabled={!isEditing && isProfileExists}
                    options={skillOptions}
                    value={formData.skills}
                    onChange={(event, value) => setFormData({ ...formData, skills: value })}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Skills"
                        error={!!fieldError.skills}
                        helperText={fieldError.skills}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    fullWidth
                    required
                    disabled={!isEditing && isProfileExists}
                    value={formData.dob}
                    onChange={handleChange}
                    error={!!fieldError.dob}
                    helperText={fieldError.dob || 'Must be between 15 and 50 years old'}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    disabled={!isEditing && isProfileExists}
                    options={jobPreferencesOptions}
                    value={formData.jobPreferences}
                    onChange={(event, value) => setFormData({ ...formData, jobPreferences: value })}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Job Preferences"
                        error={!!fieldError.jobPreferences}
                        helperText={fieldError.jobPreferences}
                      />
                    )}
                  />
                </Grid>

                {(isEditing || !isProfileExists) && (
                  <Grid container spacing={2} sx={{ mt: 2, ml: 1 }}>
                    <Grid item xs={6}>
                      <ActionButton 
                        type="submit" 
                        variant="contained" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          isProfileExists ? 'Update Profile' : 'Create Profile'
                        )}
                      </ActionButton>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: 'red', width: '100%' }}
                        onClick={() => {
                          handleCancel();
                          setIsEditing(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </form>
      </ProfileContainer>
      <Footer />
    </div>
  );
};

export default EmployeeProfile;

