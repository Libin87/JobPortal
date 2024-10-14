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
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NavbarAdmin from './NavbarAdmin';
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

const ButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  height: '100%',
});

const AdminJobApproval = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/jobs/pending');
        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs.');
      }
    };

    fetchJobs();
  }, []);

  const handleApprove = async (jobId) => {
    const approvalDate = new Date().toISOString(); // Capture current date and time
    console.log(approvalDate)
    try {
      await axios.put(`http://localhost:3000/jobs/approve/${jobId}`, { approvalDate });
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      toast.success('Job approved successfully!');
    } catch (err) {
      console.error('Error approving job:', err);
      setError('Failed to approve the job.');
      toast.error('Failed to approve the job.');
    }
  };
  

  const handleReject = async (jobId) => {
    try {
      await axios.delete(`http://localhost:3000/jobs/reject/${jobId}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      toast.success('Job rejected successfully!');
    } catch (err) {
      console.error('Error rejecting job:', err);
      setError('Failed to reject the job.');
      toast.error('Failed to reject the job.');
    }
  };

  return (
    <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
      <NavbarAdmin />
      <Typography variant="h4" style={{ textAlign: 'center', marginTop: '40px', color: '#360275' }}>
        Approve Job Postings
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
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <StyledTableRow key={job._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{job.jobTitle}</StyledTableCell>
                  <StyledTableCell>{job.companyName}</StyledTableCell>
                  <StyledTableCell>{job.location}</StyledTableCell>
                  <StyledTableCell>
                    <ButtonContainer>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApprove(job._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleReject(job._id)}
                      >
                        Reject
                      </Button>
                    </ButtonContainer>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={5}>No pending job postings.</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ToastContainer />
    </Container>
  );
};

export default AdminJobApproval;
