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
  IconButton,
  Avatar,
  Card,
  Box,
  CircularProgress,
  Chip,
  Dialog as ConfirmDialog,
  DialogActions,
  Dialog as TestResultDialog,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import NavbarEmployee from './NavbarEmployee';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PendingIcon from '@mui/icons-material/Pending';

const StyledTableCell = styled(TableCell)({
  textAlign: 'center',
  padding: '10px',
});

const StyledTableRow = styled(TableRow)({
  backgroundColor: '#f2f2f2',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [companyProfileOpen, setCompanyProfileOpen] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [applicationToCancel, setApplicationToCancel] = useState(null);
  const [testResultOpen, setTestResultOpen] = useState(false);
  const [selectedTestResult, setSelectedTestResult] = useState(null);

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/jobs/employee-applications`, {
          params: { userId }
        });
        
        // Filter out any null or invalid applications
        const validApplications = response.data.filter(app => 
          app && app.jobTitle && app.companyName
        );
        
        console.log('Applications fetched:', validApplications);
        setApplications(validApplications);
        setError('');
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to fetch applications');
        toast.error("Error fetching applications");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchApplications();
    }
  }, [userId]);

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setOpen(true);
  };

  const fetchCompanyDetails = async (employerId) => {
    try {
      const response = await axios.get(`http://localhost:3000/profile/${employerId}`);
      setCompanyDetails(response.data);
      setCompanyProfileOpen(true);
    } catch (error) {
      toast.error("Error fetching company details");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedApplication(null);
  };

  const handleCompanyProfileClose = () => {
    setCompanyProfileOpen(false);
    setCompanyDetails(null);
  };

  const handleCancelClick = (application) => {
    // Additional validation before allowing cancellation
    if (application.approvalStatus !== 'Pending') {
      toast.warning('Cannot cancel an application that has been processed');
      return;
    }
    
    if (application.testStatus === 'Completed') {
      toast.warning('Cannot cancel an application after completing the test');
      return;
    }

    setApplicationToCancel(application);
    setConfirmCancel(true);
  };

  const handleCancelConfirm = async () => {
    if (!applicationToCancel) return;

    try {
      const response = await axios.delete(
        `http://localhost:3000/jobs/cancel-application/${applicationToCancel._id}`,
        { data: { userId } }
      );

      if (response.status === 200) {
        setApplications(applications.filter(app => app._id !== applicationToCancel._id));
        toast.success('Application cancelled successfully');
      }
    } catch (error) {
      console.error('Error cancelling application:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel application');
    } finally {
      setConfirmCancel(false);
      setApplicationToCancel(null);
    }
  };

  const handleViewTestResult = async (application) => {
    try {
      const response = await axios.get(`http://localhost:3000/test/test-result/${application._id}`);
      setSelectedTestResult(response.data);
      setTestResultOpen(true);
    } catch (error) {
      console.error('Error fetching test result:', error);
      toast.error('Failed to fetch test result');
    }
  };

  // Function to format experience
  const formatExperience = (experience) => {
    if (typeof experience === 'object' && experience !== null) {
      const { years, months } = experience;
      return `${years} years ${months} months`;
    }
    return `${experience} years`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
      <NavbarEmployee />
      <Typography variant="h4" style={{ textAlign: 'center', marginTop: '40px', color: '#360275' }}>
        My Job Applications
      </Typography>

      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '40vh',
        width: '100%',
      }}>
        <TableContainer
          component={Paper}
          style={{
            margin: 'auto',
            width: '80%',
            maxWidth: '1200px',
          }}
        >
          <Table style={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>#</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Job Title</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Company</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Applied At</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Application Status</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Test Status</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.length > 0 ? (
                applications.map((application, index) => (
                  <StyledTableRow key={application._id || index}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{application.jobTitle || 'N/A'}</StyledTableCell>
                    <StyledTableCell>{application.companyName || 'N/A'}</StyledTableCell>
                    <StyledTableCell>
                      {application.appliedAt ? 
                        new Date(application.appliedAt).toLocaleDateString('en-GB') : 
                        'N/A'
                      }
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        label={application.approvalStatus || 'Pending'}
                        color={
                          application.approvalStatus === 'Accepted' ? 'success' :
                          application.approvalStatus === 'Rejected' ? 'error' :
                          'warning'
                        }
                        variant="outlined"
                        sx={{ fontWeight: 'medium' }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box 
                        onClick={() => application.testStatus === 'Completed' && handleViewTestResult(application)}
                        sx={{ 
                          cursor: application.testStatus === 'Completed' ? 'pointer' : 'default',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1
                        }}
                      >
                        <Chip
                          icon={application.testStatus === 'Completed' ? 
                            <AssignmentTurnedInIcon /> : 
                            <PendingIcon />
                          }
                          label={application.testStatus === 'Completed' ? 'View Result' : 'Pending'}
                          color={application.testStatus === 'Completed' ? 'success' : 'warning'}
                          variant="outlined"
                          sx={{ 
                            fontWeight: 'medium',
                            '&:hover': application.testStatus === 'Completed' ? {
                              backgroundColor: 'success.light',
                              color: 'white'
                            } : {}
                          }}
                        />
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1,
                        flexWrap: 'wrap',
                      }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleViewDetails(application)}
                        >
                          View Details
                        </Button>
                        {(application.approvalStatus === 'Pending' && 
                          application.testStatus !== 'Completed') && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleCancelClick(application)}
                            startIcon={<DeleteIcon />}
                          >
                            Cancel
                          </Button>
                        )}
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={7} style={{ textAlign: 'center' }}>
                    No applications found.
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Application Details Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#360275', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Application Details</Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, backgroundColor: '#f2f2f7' }}>
          <Card sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
            {selectedApplication && (
              <>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
                  {selectedApplication.jobTitle}
                </Typography>

                {[
                  { label: 'Company Name', value: selectedApplication.companyName },
                  { label: 'Location', value: selectedApplication.location },
                  { label: 'Job Type', value: selectedApplication.jobType },
                  { label: 'Qualifications', value: selectedApplication.qualifications },
                  { label: 'Experience', value: formatExperience(selectedApplication.experience) },
                  { label: 'Contact Details', value: selectedApplication.contactDetails },
                  { label: 'Last Date to Apply', value: selectedApplication.lastDate ? new Date(selectedApplication.lastDate).toLocaleDateString('en-GB') : 'N/A' }
                ].map((item, index) => (
                  <Typography key={index} variant="body2" gutterBottom sx={{ color: '#666', mb: 1 }}>
                    <strong>{item.label}:</strong> {item.value}
                  </Typography>
                ))}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => fetchCompanyDetails(selectedApplication.employerId)}
                  sx={{ mt: 2 }}
                >
                  View Company Profile
                </Button>
              </>
            )}
          </Card>
        </DialogContent>
      </Dialog>

      {/* Company Profile Dialog */}
      <Dialog open={companyProfileOpen} onClose={handleCompanyProfileClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#360275', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Company Profile</Typography>
          <IconButton onClick={handleCompanyProfileClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: '#f7f7f7', p: 3 }}>
          <Card sx={{ p: 2, display: 'flex', flexDirection: 'row', backgroundColor: '#fff', borderRadius: '10px' }}>
            {companyDetails ? (
              <>
                <div style={{ flex: 1, textAlign: 'left', marginRight: '20px' }}>
                  <Avatar
                    src={`http://localhost:3000/${companyDetails.logoUrl}`}
                    alt="Company Logo"
                    sx={{ width: 100, height: 100, mb: 1 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "path/to/default-image.png";
                    }}
                  />
                  <Typography variant="h5">{companyDetails.cname}</Typography>
                </div>

                <div style={{ flex: 2 }}>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    <strong>Email:</strong> {companyDetails.email}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    <strong>Website:</strong> {companyDetails.website}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    <strong>Address:</strong> {companyDetails.address}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    <strong>Tagline:</strong> {companyDetails.tagline}
                  </Typography>
                </div>
              </>
            ) : (
              <Typography variant="body1">Loading company details...</Typography>
            )}
          </Card>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
      >
        <DialogTitle>Cancel Application</DialogTitle>
        <DialogContent>
          Are you sure you want to cancel your application for {applicationToCancel?.jobTitle}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancel(false)} color="primary">
            No, Keep It
          </Button>
          <Button onClick={handleCancelConfirm} color="error" variant="contained">
            Yes, Cancel Application
          </Button>
        </DialogActions>
      </ConfirmDialog>

      {/* Test Result Dialog */}
      <TestResultDialog 
        open={testResultOpen} 
        onClose={() => setTestResultOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#360275', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">Test Result</Typography>
          <IconButton onClick={() => setTestResultOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 3 }}>
          {selectedTestResult && (
            <Box>
              <Card sx={{ p: 3, mb: 2 }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Score: {selectedTestResult.score}/{selectedTestResult.totalMarks}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Result: {selectedTestResult.result === 'Pass' ? 
                    <Chip label="Pass" color="success" size="small" /> : 
                    <Chip label="Fail" color="error" size="small" />
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time Taken: {selectedTestResult.timeTaken} minutes
                </Typography>
              </Card>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Performance Analysis
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(selectedTestResult.score / selectedTestResult.totalMarks) * 100}
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    mb: 1,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: selectedTestResult.result === 'Pass' ? 'success.main' : 'error.main'
                    }
                  }}
                />
                <Typography variant="body2" color="text.secondary" align="center">
                  {Math.round((selectedTestResult.score / selectedTestResult.totalMarks) * 100)}% Score
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </TestResultDialog>
      <ToastContainer />
    </Container>
  );
};

export default JobApplications;
