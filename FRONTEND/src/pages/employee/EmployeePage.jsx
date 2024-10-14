import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import NavbarEmployee from './NavbarEmployee';
import Footer from '../../components/Footer';

const EmployeePage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (!role || role !== 'employee') {
      navigate('/login');
    } else {
      fetchJobs();
    }
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  return (
    <div>
      <NavbarEmployee />
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
            <Link to="/employeeProfile">
              <Button variant="contained" fullWidth style={{ backgroundColor: '#0D6EFD' }}>
                Profile
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Link to="/jobApplications">
              <Button variant="contained" color="secondary" fullWidth>
                Job Applications
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Link to="/notifications">
              <Button variant="contained" fullWidth style={{ backgroundColor: 'green' }}>
                Notifications
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Link to="/savedJobs">
              <Button variant="contained" fullWidth style={{ backgroundColor: '#00CCCD' }}>
                Saved Jobs
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Container>

      <Container style={{ marginTop: '30px', marginBottom: '30px', borderRadius: '50px', maxWidth: '84.5%' }}>
        <TextField
          variant="outlined"
          placeholder="Search jobs by title or location"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          style={{ marginBottom: '30px' }}
        />
        <Grid container spacing={3}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job._id}>
              <Card style={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {job.jobTitle}
                  </Typography>
                  <Typography color="textSecondary">{job.location}</Typography>
                  <Typography color="textSecondary">Salary: ${job.salary}</Typography>
                  <Typography color="textSecondary">Experience: {job.experience} years</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {job.jobDescription}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={handleApply}>
                    Apply
                  </Button>
                  <Button size="small" color="secondary">
                    Save
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>Application Submitted</DialogTitle>
        <DialogContent>
          <DialogContentText>Your application has been submitted successfully!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default EmployeePage;
