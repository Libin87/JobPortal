import React, { useEffect } from 'react';
import { Container, Grid, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; 
import NavbarEmployee from './NavbarEmployee'; 
import Footer from '../../components/Footer';

const EmployeePage = () => {
  const navigate = useNavigate();

  
  useEffect(() => {
    const role = localStorage.getItem('role'); 
    if (!role || role !== 'employee') {
      navigate('/login'); 
    }
  }, [navigate]);

  return (
    <div>
      <NavbarEmployee />
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
            EMPLOYEE DASHBOARD
          </h1>
        </div>
        <br />
        <br />
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/employeeProfile">
              <Button variant="contained" fullWidth style={{ backgroundColor: '#0D6EFD' }}>
                Profile
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/jobApplications">
              <Button variant="contained" color="secondary" fullWidth>
                Job Applications
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/notifications">
              <Button variant="contained" fullWidth style={{ backgroundColor: 'GREEN' }}>
                Notifications
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/savedJobs">
              <Button variant="contained" fullWidth style={{ backgroundColor: '#00CCCD' }}>
                Saved Jobs
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default EmployeePage;
