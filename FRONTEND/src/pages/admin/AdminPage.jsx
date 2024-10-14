import React, { useEffect } from 'react';
import { Container, Grid, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin'; 
import Footer from '../../components/Footer';

const AdminPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const role = sessionStorage.getItem('role'); 
    if (!role || role !== 'admin') {
      navigate('/login'); 
    }
  }, [navigate]);

  return (
    <div>
      <NavbarAdmin />
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
          <h1 style={{ fontWeight: 'bolder', color: 'aliceblue', paddingTop: '30px' }}>
            ADMIN DASHBOARD
          </h1>
        </div>
        <br />
        <br />
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/manageUsers">
              <Button variant="contained" fullWidth style={{ backgroundColor: '#0D6EFD' }}>
                Manage Users
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/PostedJobsAdmin">
              <Button variant="contained" fullWidth style={{ backgroundColor: 'GREEN' }}>
                Posted Jobs
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/siteReport">
              <Button variant="contained" color="secondary" fullWidth>
                View Reports
              </Button>
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/adminJobAprooval">
              <Button variant="contained" fullWidth style={{ backgroundColor: '#00CCCD' }}>
                Notifications
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default AdminPage;
