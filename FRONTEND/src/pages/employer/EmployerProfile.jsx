
import React, { useState, useEffect } from 'react';
import { Container, Grid, Button, TextField, Typography } from '@mui/material';
import NavbarEmployer from './NavbarEmployer';
import Footer from '../../components/Footer';
import axios from 'axios';

const CompanyProfile = () => {
  const [profileData, setProfileData] = useState({
    cname: '', 
    email: '',
    address: '',
    tagline: '',
    website: '',
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({ email: '', website: '' });

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    axios.get(`http://localhost:3000/profile/${userId}`)
      .then((response) => {
        if (response.data) {
          setProfileData({
            cname: response.data.cname,
            email: response.data.email,
            address: response.data.address,
            tagline: response.data.tagline,
            website: response.data.website,
          });
          setLogoPreview(`http://localhost:3000/${response.data.logoUrl}`); // Update to correct URL format
          setIsUpdating(true);
        }
      })
      .catch((error) => console.log('Error fetching profile:', error));
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
    if (name === 'email') setErrors((prev) => ({ ...prev, email: '' }));
    if (name === 'website') setErrors((prev) => ({ ...prev, website: '' }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);

    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validate email and website formats
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email' }));
      window.alert('Invalid email format!');
      return;
    }
    if (!/^(http|https):\/\/[^ "]+$/.test(profileData.website)) {
      setErrors((prev) => ({ ...prev, website: 'Invalid URL' }));
      window.alert('Invalid website URL!');
      return;
    }
  
    const formData = new FormData();
    Object.keys(profileData).forEach((key) => formData.append(key, profileData[key]));
    if (logo) formData.append('logoUrl', logo);
  
    const url = isUpdating
      ? `http://localhost:3000/profile/update/${userId}`
      : 'http://localhost:3000/profile/create';
  
    axios.post(url, formData)
      .then((response) => {
        // Check for cname in either updatedProfile or profile
        const profileData = response.data.updatedProfile || response.data.profile;
        
        if (profileData) {
          // Store the company name in local storage
          sessionStorage.setItem('cname', profileData.cname);
  
          // Update logo preview and alert success
          setLogoPreview(`http://localhost:3000/${profileData.logoUrl}`);
          window.alert(`${isUpdating ? 'Updated' : 'Created'} profile successfully`);
  
          if (!isUpdating) {
            setIsUpdating(true);
          }
        } else {
          throw new Error("Profile data is missing in the response.");
        }
      })
      .catch((error) => {
        console.log(`Error ${isUpdating ? 'updating' : 'creating'} profile:`, error);
        
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('General Error:', error.message);
        }
        
        window.alert(`Error ${isUpdating ? 'updating' : 'creating'} profile: ${error.response?.data?.error || error.message}`);
      });
  };
  
  return (
    <div>
      <NavbarEmployer />
      <Container style={containerStyle}>
        <Typography variant="h4" align="center" style={titleStyle}>
          {isUpdating ? 'Update' : 'Create'} Company Profile
        </Typography>

        <Container style={formContainerStyle}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Company Name"
                  name="cname"
                  value={profileData.cname}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="Company Address"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tagline"
                  name="tagline"
                  value={profileData.tagline}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Website"
                  name="website"
                  value={profileData.website}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.website}
                  helperText={errors.website}
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={12} md={6} container alignItems="center">
                <input
                  accept="image/*"
                  id="company-logo"
                  type="file"
                  onChange={handleLogoChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="company-logo">
                  <Button variant="contained" component="span" style={{ marginTop: '20px' }}>
                    Upload Company Logo
                  </Button>
                </label>

                {logoPreview && (
                  <div style={{ marginLeft: '20px' }}>
                    <img
                      src={logoPreview}
                      alt="Company Logo Preview"
                      style={{ marginTop: '20px', width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Button type="submit" variant="contained" fullWidth style={{ marginTop: '20px', backgroundColor: 'green' }}>
                  {isUpdating ? 'Update Profile' : 'Create Profile'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Container>
      <Footer />
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
