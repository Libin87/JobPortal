import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Paper, Divider } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NavbarAdmin from '../admin/NavbarAdmin';
import Footer from '../../components/Footer';

const COLORS = ['#360275', '#0D6EFD', '#FF8042', '#00C49F'];

const SiteReport = () => {
  const [report, setReport] = useState({
    totalUsers: 0,
    totalJobs: 0,
    activeJobs: 0,
    applications: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/siteReport');
        setReport(response.data);
      } catch (err) {
        console.error('Error fetching site report data:', err);
        setError('Failed to load site report.');
      }
    };

    fetchReportData();
  }, []);

  const data = [
    { name: 'Total Users', value: report.totalUsers },
    { name: 'Total Jobs', value: report.totalJobs },
    { name: 'Active Jobs', value: report.activeJobs },
    { name: 'Applications', value: report.applications },
  ];

  return (
    <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
      <NavbarAdmin />
      <Typography variant="h3" style={{ textAlign: 'center', marginTop: '40px', color: '#360275' }}>
        Site Report
      </Typography>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <Grid container spacing={4} justifyContent="center" style={{ marginTop: '30px' }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h4" style={{ textAlign: 'center', color: '#360275' }}>
              Overview of Metrics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Additional details */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h4" style={{ textAlign: 'center', color: '#360275' }}>
              Detailed Information
            </Typography>
            <Divider style={{ margin: '10px 0' }} />
            <Grid container spacing={2} direction="column" style={{ paddingLeft: '10px' }}>
              <Grid item>
                <Typography variant="body1" style={{ color: '#360275', fontSize: '1.6rem' }}>
                  <strong>Total Users:</strong> {report.totalUsers}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" style={{ color: '#0D6EFD', fontSize: '1.6rem' }}>
                  <strong>Total Jobs:</strong> {report.totalJobs}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" style={{ color: '#FF8042', fontSize: '1.6rem' }}>
                  <strong>Active Jobs:</strong> {report.activeJobs}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" style={{ color: '#00C49F', fontSize: '1.6rem' }}>
                  <strong>Applications Submitted:</strong> {report.applications}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Footer />
    </Container>
  );
};

export default SiteReport;
