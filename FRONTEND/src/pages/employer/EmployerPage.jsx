

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
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import NavbarEmployer from './NavbarEmployer';
import Footer from '../../components/Footer';

const EmployerPage = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
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

  const [openPopup, setOpenPopup] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const role = localStorage.getItem('role'); // Assume role is stored in localStorage after login

    // If no role or not employer, redirect to login
    if (!role || role !== 'employer') {
      navigate('/login'); // Redirect to login page if not an employer
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   try {
  //     const response = await axios.post('http://localhost:3000/jobs/create', formData);
  //     console.log(response.data);

  //     setOpenPopup(true);
  //     setFormData({
  //       jobTitle: '',
  //       companyName: '',
  //       location: '',
  //       salary: '',
  //       jobType: '',
  //       qualifications: '',
  //       skills: '',
  //       jobDescription: '',
  //       experience: '',
  //       contactDetails: '',
  //       lastDate: '',
  //     });
  //   } catch (err) {
  //     console.error('Error posting job:', err);
  //     setError('There was an issue posting the job. Please try again.');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userId');
  
    // Create a new object to include the userId in the form data
    const jobData = {
      ...formData,
      userId: userId,
    };
    console.log(jobData);
    try {
      // Use jobData instead of formData
      const response = await axios.post('http://localhost:3000/jobs/create', jobData);
      console.log(response.data);
  
      setOpenPopup(true);
      setFormData({
        jobTitle: '',
        companyName: '',
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
      setError('There was an issue posting the job. Please try again.');
    }
  };
  

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleCancel = () => {
    setFormData({
      jobTitle: '',
      companyName: '',
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
          backgroundColor: '#423B47',
          borderRadius: '20px',
          paddingLeft: '100px',
          paddingRight: '100px',
          minHeight: '15rem',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontWeight: 'bolder', color: 'aliceblue', paddingTop: '30px' }}>
            EMPLOYER DASHBOARD
          </h1>
        </div>
        <br />
        <br />
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

      <Container
        style={{
          backgroundColor: '#552878',
          marginBottom: '30px',
          borderRadius: '50px',
          maxWidth: '84.5%',
        }}
      >
        <h2 style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '40px', color: 'aliceblue' }}>
          POST A JOB
        </h2>
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
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Job Type"
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                fullWidth
                required
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
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                />
              </Grid>
  
              <Grid item xs={12} md={6}>
                <TextField
                  label="Job Description"
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  fullWidth
                  required
                />
              </Grid>
  
              <Grid item xs={12} md={6}>
                <TextField
                  label="Contact Details"
                  name="contactDetails"
                  value={formData.contactDetails}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
  
            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                label="Last Date"
                name="lastDate"
                value={formData.lastDate}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: { min: new Date().toISOString().split('T')[0] },
                }}
              />
            </Grid>

  
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  onClick={handleCancel}
                  style={{ marginTop: '5px', backgroundColor: 'black' }}
                >
                  Cancel
                </Button>
              </Grid>
  
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  style={{ marginTop: '5px', backgroundColor: 'green' }}
                >
                  Submit Job Post
                </Button>
              </Grid>
            </Grid>
          </form>
  
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
  
          <Dialog open={openPopup} onClose={handleClosePopup} maxWidth="sm">
            <DialogTitle>Job Posted Successfully!</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Your job has been posted successfully. It is now waiting for review.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePopup} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
  
        <Footer />
      </div>
    );
  };
  
  export default EmployerPage;
  
