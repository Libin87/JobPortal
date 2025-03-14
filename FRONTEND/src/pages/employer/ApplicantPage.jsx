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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Card,
  Box,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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

const ApplicantList = () => {
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const employerId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        console.log('Fetching applications for employerId:', employerId); // Debug log

        const response = await axios.get('http://localhost:3000/jobs/applications', {
          params: { employerId }
        });

        console.log('Applications response:', response.data); // Debug log
        
        if (response.data && Array.isArray(response.data)) {
          setApplicants(response.data);
          setError('');
        } else {
          setError('Invalid data received from server');
          toast.error('Error loading applications');
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setError('Failed to fetch applicants. Please try again.');
        toast.error('Failed to fetch applicants');
      } finally {
        setLoading(false);
      }
    };

    if (employerId) {
      fetchApplicants();
    } else {
      setError('No employer ID found. Please login again.');
      toast.error('Please login again');
    }
  }, [employerId]);

  const handleViewDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedApplicant(null);
  };

  const handleApprove = async () => {
    if (!selectedApplicant) return;

    try {
      const response = await axios.put(`http://localhost:3000/jobs/updateApplications/${selectedApplicant._id}`, {
        approvalStatus: 'Approved',
      });
      setApplicants((prevApplicants) =>
        prevApplicants.map((applicant) =>
          applicant._id === selectedApplicant._id ? { ...applicant, approvalStatus: 'Approved' } : applicant
        )
      );
      toast.success('Application Approved Successfully');
      handleClose();
    } catch (error) {
      toast.error('Error approving application');
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedApplicant) return;

    try {
      const response = await axios.put(`http://localhost:3000/jobs/updateApplications/${selectedApplicant._id}`, {
        approvalStatus: 'Rejected',
      });
      setApplicants((prevApplicants) =>
        prevApplicants.map((applicant) =>
          applicant._id === selectedApplicant._id ? { ...applicant, approvalStatus: 'Rejected' } : applicant
        )
      );
      toast.success('Application Rejected Successfully');
      handleClose();
    } catch (error) {
      toast.error('Error rejecting application');
      console.error('Error rejecting application:', error);
    }
  };

  return (
    <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
      <NavbarEmployer />
      <Typography variant="h4" style={{ textAlign: 'center', marginTop: '40px', color: '#360275' }}>
        New Applicants
      </Typography>

      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table style={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>#</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Job Title</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Photo</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Name</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Email</StyledTableCell>              
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Resume</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Approval Status</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applicants.length > 0 ? (
                applicants.map((applicant, index) => (
                  <StyledTableRow key={applicant._id}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{applicant.jobTitle}</StyledTableCell>
                    <StyledTableCell>
                      {applicant.photo ? (
                        <img
                          src={`http://localhost:3000/${applicant.photo}`}
                          alt={`${applicant.name}'s photo`}
                          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/path/to/default-avatar.png";
                          }}
                        />
                      ) : (
                        <Avatar sx={{ width: 50, height: 50 }}>
                          {applicant.name?.charAt(0)}
                        </Avatar>
                      )}
                    </StyledTableCell>
                    <StyledTableCell>{applicant.name}</StyledTableCell>
                    <StyledTableCell>{applicant.email}</StyledTableCell>
                    <StyledTableCell>
                      {applicant.resume ? (
                        <a 
                          href={`http://localhost:3000/${applicant.resume}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          View Resume
                        </a>
                      ) : (
                        'No resume'
                      )}
                    </StyledTableCell>
                    <StyledTableCell>{applicant.approvalStatus}</StyledTableCell>
                    <StyledTableCell>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleViewDetails(applicant)}
                      >
                        View Details
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={8} align="center">
                    No applicants available.
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle style={{ position: 'relative', backgroundColor: '#360275', color: 'white' }}>
          <Typography variant="h5">Applicant Profile</Typography>
          <IconButton onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8, color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent style={{ padding: '20px', backgroundColor: '#f2f2f7' }}>
          <Card style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
            {selectedApplicant ? (
              <>
                <Box style={{
                  flex: 1,
                  textAlign: 'center',
                  marginRight: '20px',
                  padding: '10px',
                  borderRight: '1px solid #e0e0e0',
                }}>
                  <Avatar
                    src={selectedApplicant.photo ? `http://localhost:3000/${selectedApplicant.photo}` : '/default-avatar.png'}
                    alt={selectedApplicant.name || 'Applicant'}
                    style={{
                      width: '100px',
                      height: '100px',
                      marginBottom: '10px',
                      borderRadius: '50%',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Typography variant="h6" style={{ 
                    color: '#360275', 
                    fontWeight: 'bold', 
                    marginTop: '10px' 
                  }}>
                    {selectedApplicant.name || 'N/A'}
                  </Typography>
                  
                  {selectedApplicant.resume && (
                    <Button
                      variant="contained"
                      color="primary"
                      href={`http://localhost:3000/${selectedApplicant.resume}`}
                      target="_blank"
                      style={{ marginTop: '10px' }}
                    >
                      View Resume
                    </Button>
                  )}
                </Box>

                <Box style={{ flex: 2, paddingLeft: '20px' }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Email:</strong> {selectedApplicant.email || 'N/A'}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Experience:</strong> {selectedApplicant.experience ? `${selectedApplicant.experience} years` : 'N/A'}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Degree:</strong> {selectedApplicant.degree || 'N/A'}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Job Title:</strong> {selectedApplicant.jobTitle || 'N/A'}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Address:</strong> {selectedApplicant.address || 'N/A'}
                  </Typography>
                  {selectedApplicant.skills && selectedApplicant.skills.length > 0 && (
                    <Typography variant="body1" gutterBottom>
                      <strong>Skills:</strong> {selectedApplicant.skills.join(', ')}
                    </Typography>
                  )}
                  {selectedApplicant.jobPreferences && selectedApplicant.jobPreferences.length > 0 && (
                    <Typography variant="body1" gutterBottom>
                      <strong>Job Preferences:</strong> {selectedApplicant.jobPreferences.join(', ')}
                    </Typography>
                  )}
                </Box>
              </>
            ) : (
              <Typography variant="body1">No applicant selected</Typography>
            )}
          </Card>
        </DialogContent>

        <DialogActions style={{ justifyContent: 'space-between', padding: '20px', backgroundColor: '#f2f2f7' }}>
          <Button variant="outlined" color="primary" onClick={handleReject} style={{ marginRight: '10px', backgroundColor: '#e53935', color: 'white' }}>
            Reject
          </Button>
          <Button variant="contained" color="primary" onClick={handleApprove} style={{ backgroundColor: '#43a047', color: 'white' }}>
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </Container>
  );
};

export default ApplicantList;
