import React, { useState, useEffect } from 'react';
import { Container, Grid, Button, TextField, Typography, Box, Chip } from '@mui/material';
import NavbarEmployer from './NavbarEmployer';
import Footer from '../../components/Footer';
import axios from 'axios';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompanyProfile = () => {
  const [profileData, setProfileData] = useState({
    cname: '', 
    email: '',
    address: '',
    tagline: '',
    website: '',
    documentUrl: '',
    verificationStatus: '',
    verificationMessage: ''
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({
    cname: '',
    email: '',
    address: '',
    tagline: '',
    website: ''
  });

  const [document, setDocument] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [documentPreview, setDocumentPreview] = useState('');

  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const userId = sessionStorage.getItem('userId');
console.log("id",userId)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/profile/${userId}`);
        if (response.data) {
          setProfileData({
            cname: response.data.cname,
            email: response.data.email,
            address: response.data.address,
            tagline: response.data.tagline,
            website: response.data.website,
            documentUrl: response.data.documentUrl,
            verificationStatus: response.data.verificationStatus,
            verificationMessage: response.data.verificationMessage
          });
          
          setLogoPreview(`http://localhost:3000/${response.data.logoUrl}`);
          setDocumentName(response.data.documentUrl ? response.data.documentUrl.split('/').pop() : '');
          setIsUpdating(true);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // Profile doesn't exist yet
          setIsUpdating(false);
          console.log('No profile exists yet. Ready to create new profile.');
        } else {
          console.error('Error fetching profile:', error);
          toast.error('Error fetching profile data. Please try again later.');
        }
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const validateField = (name, value) => {
    // Check for consecutive characters (more than 3)
    const hasConsecutiveChars = (str) => {
      const regex = /(.)\1{2,}/;
      return regex.test(str);
    };

    switch (name) {
      case 'cname': {
        if (!value) return 'Company name is required';
        if (value.length < 3) return 'Company name must be at least 3 characters';
        if (value.length > 50) return 'Company name must be less than 50 characters';
        if (hasConsecutiveChars(value)) return 'Company name cannot have more than 3 consecutive characters';
        if (!/^[A-Za-z0-9\s.,&'-]+$/.test(value)) return 'Company name contains invalid characters';
        return '';
      }

      case 'email': {
        if (!value) return 'Email is required';
        
        // Stricter email validation
        const emailRegex = /^[A-Za-z][A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(value)) {
          if (!value.includes('@')) return 'Email must contain @';
          if (!value.includes('.')) return 'Email must contain a domain';
          if (value.startsWith('@')) return 'Email must start with a letter';
          if (value.indexOf('@') !== value.lastIndexOf('@')) return 'Email cannot contain multiple @ symbols';
          if (value.endsWith('@') || value.endsWith('.')) return 'Email cannot end with @ or .';
          if (/[^A-Za-z0-9._@-]/.test(value)) return 'Email contains invalid characters';
          if (value.length > 254) return 'Email is too long';
          if (value.split('@')[0].length > 64) return 'Local part of email is too long';
          return 'Invalid email format';
        }

        // Check domain part
        const domain = value.split('@')[1];
        if (domain.startsWith('-') || domain.endsWith('-')) return 'Domain cannot start or end with hyphen';
        if (domain.includes('..')) return 'Domain cannot contain consecutive dots';
        if (!/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(domain)) return 'Invalid domain format';
        
        return '';
      }

      case 'address': {
        if (!value) return 'Address is required';
        if (value.length < 10) return 'Address must be at least 10 characters';
        if (value.length > 200) return 'Address must be less than 200 characters';
        if (hasConsecutiveChars(value)) return 'Address cannot have more than 3 consecutive characters';
        if (!/^[A-Za-z0-9\s.,#&'-]+$/.test(value)) return 'Address contains invalid characters';
        return '';
      }

      case 'tagline': {
        if (!value) return 'Tagline is required';
        if (value.length < 5) return 'Tagline must be at least 5 characters';
        if (value.length > 100) return 'Tagline must be less than 100 characters';
        if (hasConsecutiveChars(value)) return 'Tagline cannot have more than 3 consecutive characters';
        return '';
      }

      case 'website': {
        if (!value) return 'Website URL is required';
        
        // Stricter URL validation
        try {
          // Try to construct URL (will throw error if invalid)
          const url = new URL(value.startsWith('http') ? value : `https://${value}`);
          
          // Check protocol
          if (!['http:', 'https:'].includes(url.protocol)) {
            return 'Website must use HTTP or HTTPS protocol';
          }

          // Check domain format
          const domain = url.hostname;
          if (domain.length > 253) return 'Domain name is too long';
          if (domain.startsWith('-') || domain.endsWith('-')) return 'Domain cannot start or end with hyphen';
          if (domain.startsWith('.') || domain.endsWith('.')) return 'Domain cannot start or end with dot';
          if (domain.includes('..')) return 'Domain cannot contain consecutive dots';
          
          // Validate domain parts
          const domainParts = domain.split('.');
          if (domainParts.length < 2) return 'Website must have a valid domain (e.g., example.com)';
          if (domainParts.some(part => part.length > 63)) return 'Domain parts cannot exceed 63 characters';
          if (domainParts.some(part => !/^[A-Za-z0-9-]+$/.test(part))) return 'Domain contains invalid characters';
          
          // Validate TLD (Top Level Domain)
          const tld = domainParts[domainParts.length - 1];
          if (tld.length < 2) return 'Invalid top-level domain';
          if (!/^[A-Za-z]{2,}$/.test(tld)) return 'Invalid top-level domain format';

          // Check for common URL patterns
          const commonTLDs = ['com', 'org', 'net', 'edu', 'gov', 'mil', 'biz', 'info', 'io', 'co', 'in'];
          if (!commonTLDs.includes(tld.toLowerCase())) {
            return 'Please use a common top-level domain (e.g., .com, .org, .net)';
          }

          // Optional: Check for path/query validation if needed
          if (url.pathname !== '/' && !/^[/A-Za-z0-9-._~:/?#\[\]@!$&'()*+,;=]*$/.test(url.pathname)) {
            return 'URL path contains invalid characters';
          }

        } catch (error) {
          return 'Invalid website URL format (e.g., https://example.com)';
        }
        
        return '';
      }

      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        toast.error('Please upload an image file');
        return;
      }
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo file size should be less than 2MB');
        return;
      }
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match('application/pdf')) {
        toast.error('Please upload a PDF document');
        return;
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Document file size should be less than 5MB');
        return;
      }
      setDocument(file);
      setDocumentName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(profileData).forEach(key => {
      if (key !== 'documentUrl' && key !== 'verificationStatus' && key !== 'verificationMessage') {
        const error = validateField(key, profileData[key]);
        if (error) newErrors[key] = error;
      }
    });

    // Check for document upload on new profile creation
    if (!isUpdating && !document) {
      newErrors.document = 'Company document is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors before submitting');
      return;
    }

    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      if (key !== 'documentUrl' && key !== 'verificationStatus' && key !== 'verificationMessage') {
        formData.append(key, profileData[key]);
      }
    });
    
    if (logo) formData.append('logoUrl', logo);
    if (document) formData.append('documentUrl', document);
    formData.append('userId', userId);

    try {
      setIsLoading(true);
      const url = isUpdating
        ? `http://localhost:3000/profile/update/${userId}`
        : 'http://localhost:3000/profile/create';

      const response = await axios.post(url, formData);
      const newProfileData = response.data.updatedProfile || response.data.profile;
      
      if (newProfileData) {
        setProfileData({
          ...newProfileData,
          verificationStatus: newProfileData.verificationStatus || 'Pending',
          verificationMessage: newProfileData.verificationMessage || ''
        });
        
        sessionStorage.setItem('cname', newProfileData.cname);
        setLogoPreview(`http://localhost:3000/${newProfileData.logoUrl}`);
        setDocumentName(newProfileData.documentUrl ? newProfileData.documentUrl.split('/').pop() : '');
        toast.success(`Profile ${isUpdating ? 'updated' : 'created'} successfully!`);

        if (!isUpdating) {
          setIsUpdating(true);
        }
      }
    } catch (error) {
      console.error(`Error ${isUpdating ? 'updating' : 'creating'} profile:`, error);
      toast.error(error.response?.data?.message || 'Error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDocument = () => {
    if (documentName) {
      setOpenDocumentDialog(true);
    }
  };

  return (
    <div>
      <NavbarEmployer />
      <Container style={containerStyle}>
        <Typography variant="h4" align="center" style={titleStyle}>
          {isUpdating ? 'Update' : 'Create'} Company Profile
        </Typography>

        {!isUpdating && (
          <Box sx={{ 
            bgcolor: '#fff3e0', 
            p: 2, 
            borderRadius: 1, 
            mb: 3,
            textAlign: 'center'
          }}>
            <Typography variant="body1" color="warning.main">
              Welcome! Please create your company profile to start posting jobs.
            </Typography>
          </Box>
        )}

        <Container style={formContainerStyle}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Company Name"
                  name="cname"
                  value={profileData.cname}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  fullWidth
                  required
                  error={!!errors.cname}
                  helperText={errors.cname}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  fullWidth
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Company Address"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  fullWidth
                  required
                  multiline
                  rows={4}
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tagline"
                  name="tagline"
                  value={profileData.tagline}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  fullWidth
                  required
                  inputProps={{ maxLength: 50 }}
                  error={!!errors.tagline}
                  helperText={errors.tagline}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Website"
                  name="website"
                  value={profileData.website}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  fullWidth
                  required
                  inputProps={{ maxLength: 50 }}
                  error={!!errors.website}
                  helperText={errors.website}
                />
              </Grid>
             

<Grid container item xs={12} spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
  {/* Logo Upload */}
  <Grid item xs={12} md={4}>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2 
    }}>
      {logoPreview && (
        <Box>
          <img
            src={logoPreview}
            alt="Company Logo Preview"
            style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
          />
        </Box>
      )}
      <input
        accept="image/*"
        id="company-logo"
        type="file"
        onChange={handleLogoChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="company-logo">
        <Button 
          variant="contained" 
          component="span"
          sx={{ 
            bgcolor: '#360275',
            '&:hover': { bgcolor: '#2c0261' }
          }}
        >
          Upload Logo
        </Button>
      </label>
    </Box>
  </Grid>

  {/* Document Upload */}
  <Grid item xs={12} md={4}>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2 
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <input
          accept=".pdf,.doc,.docx"
          id="company-document"
          type="file"
          onChange={handleDocumentChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="company-document">
          <Button 
            variant="outlined" 
            component="span"
            startIcon={<UploadFileIcon />}
            sx={{ borderColor: '#360275', color: '#360275' }}
          >
            Upload Document
          </Button>
        </label>
        {documentName && (
          <IconButton 
            onClick={handleViewDocument}
            title="View Document"
            sx={{ color: '#360275' }}
          >
            <VisibilityIcon />
          </IconButton>
        )}
      </Box>
    </Box>
    {documentName && (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        gap: 1,
        mt: 1 
      }}>
        <Typography variant="caption" color="textSecondary">
          {documentName}
        </Typography>
        {profileData.verificationStatus && (
          <>
            <Chip
              size="small"
              label={profileData.verificationStatus}
              color={
                profileData.verificationStatus === 'Verified' 
                  ? 'success' 
                  : profileData.verificationStatus === 'Rejected' 
                    ? 'error' 
                    : 'warning'
              }
            />
            {profileData.verificationStatus === 'Rejected' && profileData.verificationMessage && (
              <Typography variant="caption" color="error">
                Reason: {profileData.verificationMessage}
              </Typography>
            )}
          </>
        )}
      </Box>
    )}
  </Grid>

  {/* Submit Button */}
  <Grid item xs={12} md={4}>
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Button 
        type="submit" 
        variant="contained" 
        sx={{ 
          bgcolor: 'green',
          '&:hover': { bgcolor: 'darkgreen' },
          minWidth: '200px'
        }}
      >
        {isUpdating ? 'Update Profile' : 'Create Profile'}
      </Button>
    </Box>
  </Grid>
</Grid>

            </Grid>
          </form>
        </Container>
      </Container>
      <Footer />

      {/* Document Viewer Dialog */}
      <Dialog
        open={openDocumentDialog}
        onClose={() => setOpenDocumentDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#360275', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Company Document
          <IconButton 
            onClick={() => setOpenDocumentDialog(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, height: '80vh' }}>
          {profileData.documentUrl ? (
            <iframe
              src={`http://localhost:3000/profile/file/${profileData.documentUrl.split('/').pop()}`}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Company Document"
            />
          ) : (
            <Typography variant="body1" color="error" align="center">
              No document available
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {profileData.documentUrl && (
            <Button
              variant="contained"
              href={`http://localhost:3000/${profileData.documentUrl}`}
              target="_blank"
              download
              sx={{ 
                bgcolor: '#360275',
                '&:hover': { bgcolor: '#2c0261' }
              }}
            >
              Download Document
            </Button>
          )}
          <Button onClick={() => setOpenDocumentDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add this ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

const containerStyle = {
  maxWidth: '100rem',
  marginTop: '50px',
  backgroundColor: '#423B47',
  borderRadius: '20px',
  paddingLeft: '100px',
  paddingRight: '100px',
  minHeight: '15rem',
  marginBottom: '20px',
};
  
const titleStyle = {
  color: 'aliceblue',
  paddingTop: '30px',
};
  
const formContainerStyle = {
  maxWidth: '100rem',
  backgroundColor: 'aliceblue',
  borderRadius: '20px',
  padding: '50px',
  minHeight: '35rem',
  marginBottom: '20px',
};

export default CompanyProfile;
