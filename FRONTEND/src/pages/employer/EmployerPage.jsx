import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import NavbarEmployer from './NavbarEmployer';
import Footer from '../../components/Footer';

const EmployerPage = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    salary: '',
    jobType: '',
    qualifications: '',
    skills: '',
    jobDescription: '',
    experience: '',
    contactDetails: '',
    lastDate: '',
  });

  const [error, setError] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (!role || role !== 'employer') {
      navigate('/login');
    } else {
      // Fetch company name from backend
      const fetchCompanyName = async () => {
        try {
          const userId = sessionStorage.getItem('userId');
          const response = await axios.get(`http://localhost:3000/profile/company/${userId}`);
          sessionStorage.setItem('cname', response.data.companyName);
        } catch (err) {
          console.error('Error fetching company name:', err);
        }
      };
      fetchCompanyName();
    }
  }, [navigate]);

  const validateField = (name, value) => {
    let fieldError = {};

    if (!value.trim()) {
      fieldError[name] = 'Field is required';
    } else {
      fieldError[name] = '';
    }

    switch (name) {
      case 'salary':
        if (value && value < 1000) {
          fieldError.salary = 'Enter a valid Salary.';
        }
        break;
      case 'experience':
        if (value && !/^\d+$/.test(value)) {
          fieldError.experience = 'Enter a valid experience';
        }
        break;
        case 'lastDate':
          const today = new Date().toISOString().split('T')[0];
          if (value && value < today) {
            fieldError.lastDate = 'Last Date cannot be in the past.';
          }
          break;
     
      case 'contactDetails': 
  const phoneRegex = /^\d{10}$/; // 10-digit phone number
  const repeatedDigitsRegex = /(\d)\1{4,}/; // No more than 4 consecutive same digits
  const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]{3,}\.(com|in|org|net|edu|gov|mil|co|info|biz|me)$/; // Standard email format

  if (!phoneRegex.test(value) && !emailRegex.test(value)) {
    fieldError.contactDetails = 'Enter a valid phone number (10 digits) or email address.';
  } else if (phoneRegex.test(value) && repeatedDigitsRegex.test(value)) {
    fieldError.contactDetails = 'Phone number should not contain the same digit more than 4 times consecutively.';
  }
  break;

      default:
        break;
    }

    setError((prevError) => ({
      ...prevError,
      ...fieldError,
    }));

    return fieldError;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    const fieldError = validateField(name, value);
    if (!fieldError[name]) {
      setError((prevError) => ({
        ...prevError,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userId');
    const companyName = sessionStorage.getItem('cname');
    const jobData = { ...formData, userId,companyName };
    try {
      const response = await axios.post('http://localhost:3000/jobs/create', jobData);
      console.log(response.data);
      setOpenPopup(true);
      setFormData({
        jobTitle: '',
        location: '',
        salary: '',
        jobType: '',
        qualifications: '',
        skills: '',
        jobDescription: '',
        experience: '',
        contactDetails: '',
        lastDate: '',
      });
    } catch (err) {
      console.error('Error posting job:', err);
      setError((prev) => ({ ...prev, general: 'There was an issue posting the job. Please try again.' }));
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
      qualifications: '',
      skills: '',
      jobDescription: '',
      experience: '',
      contactDetails: '',
      lastDate: '',
    });
  };

  return (
    <div>
      <NavbarEmployer />
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
            <Link to="/ApprovedJobs">
              <Button variant="contained" fullWidth style={{ backgroundColor: 'GREEN' }}>
                APPROVED JOBS
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
                label="Salary"
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
                fullWidth
                required
                error={!!error.jobType}
                helperText={error.jobType}
              >
                <MenuItem value="hybrid">Hybrid</MenuItem>
                <MenuItem value="remote">Remote</MenuItem>
                <MenuItem value="onsite">Onsite</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleInputChange}
                onBlur={handleBlur}
                fullWidth
                required
                error={!!error.qualifications}
                helperText={error.qualifications}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                onBlur={handleBlur}
                fullWidth
                required
                error={!!error.skills}
                helperText={error.skills}
              />
            </Grid>

            

            <Grid item xs={12} md={6}>
              <TextField
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                onBlur={handleBlur}
                fullWidth
                required
                error={!!error.experience}
                helperText={error.experience}
              />
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
            <Grid item xs={12} md={6}>
              <TextField
                label="Last Date to Apply"
                name="lastDate"
                type="date"
                value={formData.lastDate}
                onChange={handleInputChange}
                onBlur={handleBlur}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                error={!!error.lastDate}
                helperText={error.lastDate}
              />
            </Grid>

            <Grid item xs={12}>
            <Button 
    variant="contained" 
    onClick={handleCancel} 
    style={{ backgroundColor: '#cc0000', color: 'white', marginRight: '20px', marginTop:''}}>
    Cancel
  </Button>
              <Button type="submit" variant="contained" color="primary" >
                Post Job
              </Button>
              
            </Grid>
            
          </Grid>
          
        </form>
      </Container>

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
    </div>
  );
};

export default EmployerPage;
