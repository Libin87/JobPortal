import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Box,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import NavbarAdmin from './NavbarAdmin';
import Footer from '../../components/Footer';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';

const COLORS = ['#360275', '#0D6EFD', '#FF8042', '#00C49F', '#8884d8'];
const USER_COLORS = ['#360275', '#FF8042'];

const SiteReport = () => {
  const theme = useTheme();
  const [report, setReport] = useState({
    totalUsers: 0,
    totalJobs: 0,
    activeJobs: 0,
    applications: 0,
    totalEmployees: 0,
    totalEmployers: 0,
    totalApplications: 0,
    totalTests: 0,
    applicationsByApprovalStatus: [],
    applicationsByEmployer: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/siteReport');
        setReport(response.data);
        console.log('Report Data:', response.data);
      } catch (err) {
        console.error('Error fetching site report data:', err);
        setError('Failed to load site report.');
      }

    };

    fetchReportData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', backgroundColor: color, color: 'white' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Box>
          <Box>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const mainData = [
    { name: 'Total Users', value: report.totalUsers },
    { name: 'Total Jobs', value: report.totalJobs },
    { name: 'Active Jobs', value: report.activeJobs },
    { name: 'Total Applications', value: report.totalApplications },
    { name: 'Total Tests', value: report.totalTests }
  ].filter(item => item.value > 0);

  const userTypeData = [
    { name: 'Employees', value: report.totalEmployees },
    { name: 'Employers', value: report.totalEmployers },
  ].filter(item => item.value > 0);

  const renderLabel = (entry) => {
    return `${entry.status}: ${entry.count}`;
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <NavbarAdmin />
      <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            textAlign: 'center', 
            mb: 4, 
            color: '#360275',
            fontWeight: 'bold'
          }}
        >
          Site Analytics Dashboard
        </Typography>

        {error && (
          <Typography color="error" textAlign="center" mb={4}>
            {error}
          </Typography>
        )}

        {/* Quick Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Users" 
              value={report.totalUsers}
              icon={<PeopleAltIcon sx={{ fontSize: 40 }} />}
              color="#360275"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Jobs" 
              value={report.totalJobs}
              icon={<WorkIcon sx={{ fontSize: 40 }} />}
              color="#0D6EFD"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Applications" 
              value={report.totalApplications}
              icon={<AssignmentIcon sx={{ fontSize: 40 }} />}
              color="#FF8042"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Tests" 
              value={report.totalTests}
              icon={<QuizIcon sx={{ fontSize: 40 }} />}
              color="#00C49F"
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                backgroundColor: 'white',
                height: '100%'
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, color: '#360275', fontWeight: 'bold' }}>
                Overview of Metrics
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
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
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                backgroundColor: 'white',
                height: '100%'
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, color: '#360275', fontWeight: 'bold' }}>
                User Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
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

          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                backgroundColor: 'white'
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, color: '#360275', fontWeight: 'bold' }}>
                Application Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={report.applicationsByApprovalStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={160}
                    dataKey="count"
                    label={renderLabel}
                  >
                    {report.applicationsByApprovalStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default SiteReport;
