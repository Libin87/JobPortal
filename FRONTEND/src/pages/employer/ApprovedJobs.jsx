import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NavbarEmployer from './NavbarEmployer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
  padding: '10px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#f2f2f2',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
}));

const ApprovedJobsAdmin = () => {
  const [approvedJobs, setApprovedJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApprovedJobs = async () => {
      const employerId = sessionStorage.getItem('userId'); // Retrieve the employer ID from session storage
  
      try {
        const response = await axios.get(`http://localhost:3000/jobs/approved`, { params: { employerId } });
        setApprovedJobs(response.data);
      } catch (err) {
        console.error('Error details:', err.response || err.message || err);
        setError('Failed to fetch approved jobs');
        toast.error('Failed to fetch approved jobs');
      }
      
    };
  
    fetchApprovedJobs();
  }, []);
  

  return (
    <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
      <NavbarEmployer />
      <Typography variant="h4" style={{ textAlign: 'center', marginTop: '40px', color: '#360275' }}>
        Approved Jobs
      </Typography>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table style={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>#</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Job Title</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Company</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Location</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Approved Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvedJobs.length > 0 ? (
              approvedJobs.map((job, index) => (
                <StyledTableRow key={job._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{job.jobTitle}</StyledTableCell>
                  <StyledTableCell>{job.companyName}</StyledTableCell>
                  <StyledTableCell>{job.location}</StyledTableCell>
                  <StyledTableCell>{new Date(job.approvalDate).toLocaleDateString()}</StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={5}>No approved jobs available.</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ToastContainer />
    </Container>
  );
};

export default ApprovedJobsAdmin;
