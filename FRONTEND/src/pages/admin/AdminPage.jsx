import React, { useEffect, useState } from 'react';
import { Container, Grid, Button, Paper, Card, CardContent, Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin'; 
import Footer from '../../components/Footer';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

const AdminPage = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState({
    totalUsers: 0,
    totalJobs: 0,
    activeJobs: 0,
    applications: 0,
    totalEmployees: 0,
    totalEmployers: 0,
    totalApplications: 0,
    totalTests: 0,
    totalPayments: 0,
    applicationsByApprovalStatus: [],
    applicationsByEmployer: [],
  });
  const [pendingJobs, setPendingJobs] = useState(0);
  const [pendingProfiles, setPendingProfiles] = useState(0);

  const COLORS = ['#360275', '#0D6EFD', '#FF8042', '#00C49F', '#8884d8', '#82ca9d'];
  const USER_COLORS = ['#360275', '#FF8042'];

  const mainData = [
    { name: 'Total Users', value: report.totalUsers },
    { name: 'Total Jobs', value: report.totalJobs },
    { name: 'Active Jobs', value: report.activeJobs },
    { name: 'Total Applications', value: report.totalApplications },
    { name: 'Total Tests', value: report.totalTests },
    { name: 'Total Payments', value: report.totalPayments }
  ].filter(item => item.value > 0);

  const userTypeData = [
    { name: 'Employees', value: report.totalEmployees },
    { name: 'Employers', value: report.totalEmployers },
  ].filter(item => item.value > 0);

  useEffect(() => {
    const role = sessionStorage.getItem('role'); 
    if (!role || role !== 'admin') {
      navigate('/login'); 
    }
  }, [navigate]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [reportResponse, paymentsResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/siteReport'),
          axios.get('http://localhost:3000/api/payment/receipts')
        ]);
        
        setReport({
          ...reportResponse.data,
          totalPayments: paymentsResponse.data.length
        });
      } catch (err) {
        console.error('Error fetching site report data:', err);
      }
    };
    fetchReportData();
  }, []);

  useEffect(() => {
    const fetchPendingCounts = async () => {
      try {
        const [jobsResponse, profilesResponse] = await Promise.all([
          axios.get('http://localhost:3000/jobs/pending'),
          axios.get('http://localhost:3000/profile/pending-profiles')
        ]);
        
        setPendingJobs(jobsResponse.data.length);
        setPendingProfiles(profilesResponse.data.length);
      } catch (err) {
        console.error('Error fetching pending counts:', err);
      }
    };

    fetchPendingCounts();
  }, []);

  const paymentManagementButton = (
    <Grid item xs={12} sm={3} md={3}>
      <Link to="/payment-management" id='payment-management'>
        <Button 
          variant="contained" 
          fullWidth 
          style={{ backgroundColor: '#82ca9d' }}
        >
          Payment Management
        </Button>
      </Link>
    </Grid>
  );

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
            <Link to="/manageUsers" id='manage-users'>
              <Button variant="contained" fullWidth style={{ backgroundColor: '#0D6EFD' }}>
                Manage Users
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/PostedJobsAdmin" id='posted-jobs'>
              <Button variant="contained" fullWidth style={{ backgroundColor: 'GREEN' }}>
                Posted Jobs
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/contact-messages" id='contact-messages'>
              <Button 
                variant="contained" 
                fullWidth 
                style={{ backgroundColor: '#FF5722' }}
              >
                Contact Messages
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/adminJobAprooval" id='approval'>
              <Button 
                variant="contained" 
                fullWidth 
                style={{ backgroundColor: '#00CCCD' }}
                startIcon={
                  <Badge 
                    badgeContent={pendingJobs + pendingProfiles} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        right: -3,
                        top: 3,
                      }
                    }}
                  >
                    <NotificationsIcon />
                  </Badge>
                }
              >
                Notifications
              </Button>
            </Link>
          </Grid>
          {paymentManagementButton}
        </Grid>
      </Container>

      <Container maxWidth="xl" sx={{ mt: 6, mb: 6 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: '20px',
            background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center', 
              mb: 4, 
              color: '#4B647D',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Site Analytics Overview
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                height: '100%', 
                background: 'linear-gradient(135deg, #360275 0%, #4B647D 100%)',
                color: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6">Total Users</Typography>
                      <Typography variant="h3">{report.totalUsers}</Typography>
                    </Box>
                    <PeopleAltIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                height: '100%', 
                background: 'linear-gradient(135deg, #0D6EFD 0%, #0099FF 100%)',
                color: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6">Total Jobs</Typography>
                      <Typography variant="h3">{report.totalJobs}</Typography>
                    </Box>
                    <WorkIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                height: '100%', 
                background: 'linear-gradient(135deg, #FF8042 0%, #FF9966 100%)',
                color: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6">Total Applications</Typography>
                      <Typography variant="h3">{report.totalApplications}</Typography>
                    </Box>
                    <AssignmentIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                height: '100%', 
                background: 'linear-gradient(135deg, #00C49F 0%, #00E5B7 100%)',
                color: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6">Total Tests</Typography>
                      <Typography variant="h3">{report.totalTests}</Typography>
                    </Box>
                    <QuizIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: '15px',
                  background: 'white',
                  height: '430px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <Typography variant="h5" sx={{ mb: 3, color: '#360275', fontWeight: 'bold' }}>
                  Overview of Metrics
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mainData}
                      cx="50%"
                      cy="50%"
                      outerRadius={130}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {mainData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      wrapperStyle={{ paddingTop: '30px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: '15px',
                  background: 'white',
                  height: '430px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <Typography variant="h5" sx={{ mb: 3, color: '#360275', fontWeight: 'bold' }}>
                  User Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={330}>
                  <BarChart data={userTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#360275">
                      {userTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={USER_COLORS[index % USER_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default AdminPage;
