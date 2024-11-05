

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Container,
//   Typography,
//   Grid,
//   Paper,
//   Divider
// } from '@mui/material';
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import NavbarAdmin from '../admin/NavbarAdmin';
// import Footer from '../../components/Footer';

// const COLORS = ['#360275', '#0D6EFD', '#FF8042', '#00C49F'];
// const USER_COLORS = ['#360275', '#FF8042'];

// const SiteReport = () => {
//   const [report, setReport] = useState({
//     totalUsers: 0,
//     totalJobs: 0,
//     activeJobs: 0,
//     applications: 0,
//     totalEmployees: 0,
//     totalEmployers: 0
//   });
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchReportData = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/siteReport');
//         setReport(response.data);
//       } catch (err) {
//         console.error('Error fetching site report data:', err);
//         setError('Failed to load site report.');
//       }
//     };

//     fetchReportData();
//   }, []);

//   const mainData = [
//     { name: 'Total Users', value: report.totalUsers },
//     { name: 'Total Jobs', value: report.totalJobs },
//     { name: 'Active Jobs', value: report.activeJobs },
//     { name: 'Applications', value: report.applications },
//   ];

//   const userTypeData = [
//     { name: 'Employees', value: report.totalEmployees },
//     { name: 'Employers', value: report.totalEmployers },
//   ];

//   return (
//     <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
//       <NavbarAdmin />
//       <Typography variant="h3" style={{ textAlign: 'center', marginTop: '40px', color: '#360275' }}>
//         Site Report
//       </Typography>

//       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

//       <Grid container spacing={4} justifyContent="center" style={{ marginTop: '30px' }}>
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} style={{ padding: '20px' }}>
//             <Typography variant="h4" style={{ textAlign: 'center', color: '#360275' }}>
//               Overview of Metrics
//             </Typography>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={mainData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="value"
//                   label
//                 >
//                   {mainData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend verticalAlign="bottom" />
//               </PieChart>
//             </ResponsiveContainer>
//           </Paper>
//         </Grid>

//         {/* Pie Chart for Total Users Breakdown */}
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} style={{ padding: '20px' }}>
//             <Typography variant="h4" style={{ textAlign: 'center', color: '#360275' }}>
//               Total Users 
//             </Typography>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={userTypeData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="value"
//                   label
//                 >
//                   {userTypeData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={USER_COLORS[index % USER_COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend verticalAlign="bottom" />
//               </PieChart>
//             </ResponsiveContainer>
//           </Paper>
//         </Grid>

//         {/* Additional Details Section */}
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} style={{ padding: '20px' }}>
//             <Typography variant="h4" style={{ textAlign: 'center', color: '#360275' }}>
//               Detailed Information
//             </Typography>
//             <Divider style={{ margin: '10px 0' }} />
//             <Grid container spacing={2} direction="column" style={{ paddingLeft: '10px' }}>
//               <Grid item>
//                 <Typography variant="body1" style={{ color: '#360275', fontSize: '1.6rem' }}>
//                   <strong>Total Users:</strong> {report.totalUsers}
//                 </Typography>
//               </Grid>
//               <Grid item>
//                 <Typography variant="body1" style={{ color: '#0D6EFD', fontSize: '1.6rem' }}>
//                   <strong>Total Jobs:</strong> {report.totalJobs}
//                 </Typography>
//               </Grid>
//               <Grid item>
//                 <Typography variant="body1" style={{ color: '#FF8042', fontSize: '1.6rem' }}>
//                   <strong>Active Jobs:</strong> {report.activeJobs}
//                 </Typography>
//               </Grid>
//               <Grid item>
//                 <Typography variant="body1" style={{ color: '#00C49F', fontSize: '1.6rem' }}>
//                   <strong>Applications Submitted:</strong> {report.applications}
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Grid>
//       </Grid>

//       <Footer />
//     </Container>
//   );
// };

// export default SiteReport;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NavbarAdmin from '../admin/NavbarAdmin';
import Footer from '../../components/Footer';

const COLORS = ['#360275', '#0D6EFD', '#FF8042', '#00C49F'];
const USER_COLORS = ['#360275', '#FF8042'];

const SiteReport = () => {
  const [report, setReport] = useState({
    totalUsers: 0,
    totalJobs: 0,
    activeJobs: 0,
    applications: 0,
    totalEmployees: 0,
    totalEmployers: 0,
    totalApplications: 0,
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

  const mainData = report.totalUsers || report.totalJobs || report.activeJobs || report.applications || report.totalApplications
    ? [
        { name: 'Total Users', value: report.totalUsers },
        { name: 'Total Jobs', value: report.totalJobs },
        { name: 'Active Jobs', value: report.activeJobs },
        { name: 'Total Applications', value: report.applications },
        
      ]
    : [];

  const userTypeData = report.totalEmployees || report.totalEmployers
    ? [
        { name: 'Employees', value: report.totalEmployees },
        { name: 'Employers', value: report.totalEmployers },
      ]
    : [];
    const renderLabel = (entry) => {
    return `${entry.status}: ${entry.count}`; // Format label to show status and count
  };

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
                  data={mainData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {mainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pie Chart for Total Users Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h4" style={{ textAlign: 'center', color: '#360275' }}>
              Total Users
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={USER_COLORS[index % USER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" style={{ textAlign: 'center', color: '#360275' }}>
          Applications by Approval Status
        </Typography>
        <Divider style={{ margin: '10px 0' }} />
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={report.applicationsByApprovalStatus}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="count"
              label={renderLabel} // Custom label rendering
            >
              {report.applicationsByApprovalStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
           
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>
        {/* Detailed Information Section */}
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
                  <strong>Total Applications:</strong> {report.totalApplications}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Applications by Approval Status */}
        

        {/* Applications by Employer */}
        

      </Grid>

      <Footer />
    </Container>
  );
};

export default SiteReport;
