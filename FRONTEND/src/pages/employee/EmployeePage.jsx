import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Link, useNavigate } from 'react-router-dom';
import NavbarEmployee from './NavbarEmployee';
import Footer from '../../components/Footer';
import axios from 'axios';

const EmployeePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tests, setTests] = useState([]);
  const [hasPendingTests, setHasPendingTests] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (!role || role !== 'employee') {
      navigate('/login');
    }

    const fetchPendingTests = async () => {
      try {
        const employeeId = sessionStorage.getItem('userId');
        
        // First, check for applications with pending test status
        const applicationsResponse = await axios.get(
          `http://localhost:3000/jobs/applications`,
          {
            params: {
              userId: employeeId,
              testStatus: 'Pending'
            }
          }
        );

        console.log('Applications response:', applicationsResponse.data);

        if (applicationsResponse.data && applicationsResponse.data.length > 0) {
          setHasPendingTests(true);
          
          // If there are pending applications, fetch the associated tests
          const testsResponse = await axios.get(
            `http://localhost:3000/test/employee-tests/${employeeId}`
          );
          
          console.log('Tests response:', testsResponse.data);
          
          if (testsResponse.data.hasTests) {
            setTests(testsResponse.data.tests);
          } else {
            setTests([]);
          }
        } else {
          setHasPendingTests(false);
          setTests([]);
        }
      } catch (error) {
        console.error('Error fetching pending tests:', error);
        setHasPendingTests(false);
        setTests([]);
      }
    };

    fetchPendingTests();
  }, [navigate]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNotificationClick = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleTakeTest = (testId) => {
    navigate(`/take-test/${testId}`);
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
            <Link to="/employeeProfile" style={{ textDecoration: 'none' }}>
              <Button variant="contained" fullWidth style={{ backgroundColor: '#0D6EFD' }}>
                Profile
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Link to="/jobApplications" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="secondary" fullWidth>
                Job Applications
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Button
              variant="contained"
              fullWidth
              style={{ 
                backgroundColor: 'green', 
                position: 'relative',
              }}
              onClick={handleNotificationClick}
            >
              Notifications
              {hasPendingTests && (
                <span
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: red[500],
                    borderRadius: '50%',
                    display: 'block'
                  }}
                />
              )}
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Link to="/savedJobs" style={{ textDecoration: 'none' }}>
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
      </Container>

      {/* Dialog for Tests */}
      <Dialog open={openPopup} onClose={handleClosePopup} maxWidth="md" fullWidth>
        <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
          Pending Selection Tests
        </DialogTitle>
        <DialogContent>
          {tests.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Test Name</TableCell>
                    <TableCell>Job Title</TableCell>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Duration (mins)</TableCell>
                    <TableCell>Total Marks</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test._id}>
                      <TableCell>{test.testName}</TableCell>
                      <TableCell>{test.jobTitle}</TableCell>
                      <TableCell>{test.companyName}</TableCell>
                      <TableCell>{test.duration}</TableCell>
                      <TableCell>{test.totalMarks}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleTakeTest(test._id)}
                        >
                          Take Test
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography align="center" style={{ padding: '20px' }}>
              No pending tests available at the moment.
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default EmployeePage;
