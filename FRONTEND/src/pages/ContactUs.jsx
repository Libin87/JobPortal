import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarAdmin from './admin/NavbarAdmin';
import NavbarEmployee from './employee/NavbarEmployee';
import NavbarEmployer from './employer/NavbarEmployer';
import Footer from '../components/Footer';

const ContactUs = () => {
  const [userRole, setUserRole] = useState(sessionStorage.getItem('role'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [errors, setErrors] = useState({});

  const renderNavbar = () => {
    switch (userRole) {
      case 'admin':
        return <NavbarAdmin />;
      case 'employee':
        return <NavbarEmployee />;
      case 'employer':
        return <NavbarEmployer />;
      default:
        return <NavbarEmployee />; 
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:3000/contact/submit-message', formData);
      
      setAlert({
        open: true,
        message: response.data.message,
        severity: 'success'
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Error sending message',
        severity: 'error'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {renderNavbar()}
      <Container sx={{ py: 8, flex: 1 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Typography variant="h4" sx={{ mb: 4, color: '#360275', fontWeight: 'bold' }}>
                Contact Us
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  error={!!errors.message}
                  helperText={errors.message}
                  sx={{ mb: 3 }}
                />
                <Button 
                  type="submit"
                  variant="contained"
                  sx={{ 
                    bgcolor: '#360275',
                    '&:hover': { bgcolor: '#2A0163' }
                  }}
                >
                  Send Message
                </Button>
              </form>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Typography variant="h4" sx={{ mb: 4, color: '#360275', fontWeight: 'bold' }}>
                Get in Touch
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1, color: '#360275' }}>
                  Our Office
                </Typography>
                <Typography>123 JobPortal Street, JobCity, JP 45678</Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1, color: '#360275' }}>
                  Phone
                </Typography>
                <Typography>+123 456 7890</Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1, color: '#360275' }}>
                  Email
                </Typography>
                <Typography>support@jobportal.com</Typography>
              </Box>
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#360275' }}>
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Add your social media icons/links here */}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setAlert(prev => ({ ...prev, open: false }))} 
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default ContactUs;
