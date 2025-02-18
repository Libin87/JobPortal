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
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  IconButton,
  Box,
  Card,
  CardContent,
  Avatar,
  Tabs,
  Tab,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NavbarAdmin from './NavbarAdmin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BusinessIcon from '@mui/icons-material/Business';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
  padding: '16px',
  verticalAlign: 'top',
  '&.details-cell': {
    minWidth: '250px',
  }
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

const NoJobsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  backgroundColor: '#f5f5f5',
  borderRadius: theme.spacing(2),
  minHeight: '200px'
}));

const AdminJobApproval = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(7);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [openCompanyDialog, setOpenCompanyDialog] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectedProfiles, setRejectedProfiles] = useState([]);
  const [openJobRejectDialog, setOpenJobRejectDialog] = useState(false);
  const [jobRejectReason, setJobRejectReason] = useState('');
  const [selectedJobForReject, setSelectedJobForReject] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError('');
      
      const [jobsRes, profilesRes] = await Promise.all([
        axios.get('http://localhost:3000/jobs/pending-jobs'),
        axios.get('http://localhost:3000/profile/pending-profiles')
      ]);

      if (jobsRes.data) {
        const filteredJobs = jobsRes.data.filter(job => 
          ['Pending', 'Rejected'].includes(job.approvalStatus)
        );

        const sortedJobs = filteredJobs.sort((a, b) => {
          if (a.approvalStatus === 'Pending' && b.approvalStatus === 'Rejected') return -1;
          if (a.approvalStatus === 'Rejected' && b.approvalStatus === 'Pending') return 1;
          return new Date(b.datePosted) - new Date(a.datePosted);
        });
        
        setJobs(sortedJobs);
      }

      if (profilesRes.data) {
        setProfiles(profilesRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
      toast.error('Error fetching data');
    }
  };

  const fetchCompanyProfile = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/profile/${userId}`);
      setCompanyProfile(response.data);
      setOpenCompanyDialog(true);
    } catch (error) {
      console.error('Error fetching company profile:', error);
      toast.error('Failed to load company profile');
    }
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setOpenJobDialog(true);
  };

  const handleViewCompany = (userId) => {
    fetchCompanyProfile(userId);
  };

  const handleApprove = async (jobId) => {
    try {
      const approvalDate = new Date().toISOString();
      const response = await axios.put(`http://localhost:3000/jobs/approve/${jobId}`, { 
        approvalDate,
        status: 'approved'
      });

      if (response.data) {
        const updatedJobs = jobs.map(job => 
          job._id === jobId 
            ? { ...job, approvalStatus: 'approved', approvalDate }
            : job
        );
        
        setJobs(updatedJobs);
      toast.success('Job approved successfully!');
      }
    } catch (err) {
      console.error('Error approving job:', err);
      toast.error('Failed to approve the job.');
    }
  };

  const handleReject = async (jobId) => {
    try {
      if (!jobRejectReason) {
        setSelectedJobForReject({ _id: jobId });
        setOpenJobRejectDialog(true);
        return;
      }

      const response = await axios.put(`http://localhost:3000/jobs/reject/${jobId}`, {
        message: jobRejectReason
      });

      if (response.data) {
        const updatedJobs = jobs.map(job => 
          job._id === jobId 
            ? { ...job, approvalStatus: 'Rejected', verificationMessage: jobRejectReason }
            : job
        );
        
        setJobs(updatedJobs);
        setOpenJobRejectDialog(false);
        setJobRejectReason('');
      toast.success('Job rejected successfully!');
      }
    } catch (err) {
      console.error('Error rejecting job:', err);
      toast.error('Failed to reject the job.');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewDocument = (profile) => {
    setSelectedProfile(profile);
    setOpenDocumentDialog(true);
  };

  const handleVerify = async (profileId, status) => {
    try {
      await axios.put(`http://localhost:3000/profile/verify/${profileId}`, {
        status: status
      });
      
      toast.success(`Employer ${status === 'Verified' ? 'verified' : 'rejected'} successfully`);
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error verifying profile:', error);
      toast.error('Failed to update verification status');
    }
  };

  const handleDelete = async (profileId) => {
    try {
      await axios.delete(`http://localhost:3000/profile/${profileId}`);
      toast.success('Profile deleted successfully');
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete profile');
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:3000/jobs/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Error deleting job');
    }
  };

  const handleReactivate = async (jobId) => {
    try {
      const response = await axios.put(`http://localhost:3000/jobs/reactivate/${jobId}`);
      if (response.data) {
        toast.success('Job reactivated successfully!');
        fetchData(); // Refresh the jobs list
      }
    } catch (error) {
      console.error('Error reactivating job:', error);
      toast.error('Failed to reactivate job');
    }
  };

  return (
    <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
      <NavbarAdmin />
      <Typography variant="h4" style={{ textAlign: 'center', marginTop: '40px', color: '#360275' }}>
        Approval Management
      </Typography>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <Box sx={{ width: '100%', mt: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label={`Job Approvals (${jobs.length})`} />
          <Tab label={`Employer Approvals (${profiles.length})`} />
        </Tabs>

        {/* Job Approvals Tab */}
        <TabPanel value={tabValue} index={0}>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
          <TableHead>
            <TableRow>
                  <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Sl No</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Job Title</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Company</StyledTableCell>
                  <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Details</StyledTableCell>
                  <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Status</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                {jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((job, index) => (
                <StyledTableRow key={job._id}>
                    <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                    
                    {/* Job Details Column */}
                    <StyledTableCell className="details-cell">
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        gap: 1 
                      }}>
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 'bold', 
                          color: '#360275',
                          textAlign: 'center' 
                        }}>
                          {job.jobTitle}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'text.secondary',
                          textAlign: 'center' 
                        }}>
                          {job.companyName}
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: 'center' }}>
                          📍 {job.location}
                        </Typography>
                        <Box sx={{ 
                          mt: 1,
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 1 
                        }}>
                          <Chip 
                            label={job.jobType} 
                            size="small"
                            color="primary"
                            sx={{ minWidth: '80px' }}
                          />
                          <Chip 
                            label={`₹${job.salary}`} 
                            size="small"
                            color="success"
                            sx={{ minWidth: '80px' }}
                          />
                        </Box>
                      </Box>
                    </StyledTableCell>

                    {/* Requirements Column */}
                    <StyledTableCell className="details-cell">
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        gap: 2 
                      }}>
                        {/* Experience and Vacancy */}
                        <Box sx={{ 
                          width: '100%',
                          textAlign: 'center' 
                        }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Experience:</strong>{' '}
                            {job.experience.years} years {job.experience.months} months
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Vacancies:</strong>{' '}
                            {job.vaccancy}
                          </Typography>
                        </Box>

                        {/* Skills Section */}
                        <Box sx={{ 
                          width: '100%',
                          textAlign: 'center' 
                        }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Required Skills</strong>
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 0.5,
                            justifyContent: 'center'
                          }}>
                            {job.skills.slice(0, 3).map((skill, idx) => (
                              <Chip 
                                key={idx} 
                                label={skill} 
                                size="small" 
                                variant="outlined"
                                sx={{
                                  borderColor: '#360275',
                                  color: '#360275',
                                  '& .MuiChip-label': {
                                    px: 1
                                  }
                                }}
                              />
                            ))}
                            {job.skills.length > 3 && (
                              <Chip 
                                label={`+${job.skills.length - 3}`} 
                                size="small" 
                                variant="outlined"
                                sx={{
                                  borderColor: '#360275',
                                  color: '#360275'
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </StyledTableCell>

                    {/* Additional Info Column */}
                    <StyledTableCell className="details-cell">
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        gap: 2 
                      }}>
                        <Box sx={{ textAlign: 'center', width: '100%' }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Qualifications</strong>
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            {job.qualifications.slice(0, 2).map((qual, idx) => (
                              <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                                • {qual}
                              </Typography>
                            ))}
                            {job.qualifications.length > 2 && (
                              <Typography variant="body2" color="text.secondary">
                                +{job.qualifications.length - 2} more...
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ textAlign: 'center' }}>
                          <strong>Last Date:</strong><br />
                          {new Date(job.lastDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </StyledTableCell>

                    {/* Status Column */}
                    <StyledTableCell>
                      <Chip
                        label={job.approvalStatus}
                        color={
                          job.approvalStatus === 'approved' 
                            ? 'success' 
                            : job.approvalStatus === 'Rejected'
                              ? 'error'
                              : 'warning'
                        }
                        size="small"
                      />
                      {job.approvalStatus === 'Rejected' && job.verificationMessage && (
                        <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                          Reason: {job.verificationMessage}
                        </Typography>
                      )}
                    </StyledTableCell>

                    {/* Actions Column */}
                  <StyledTableCell>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        {job.status === 'suspended' ? (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleReactivate(job._id)}
                            sx={{ mr: 1 }}
                          >
                            Reactivate
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleApprove(job._id)}
                              sx={{ mr: 1 }}
                            >
                              Approve
                            </Button>
                            {job.approvalStatus !== 'Rejected' && (
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  setSelectedJobForReject(job);
                                  setOpenJobRejectDialog(true);
                                }}
                              >
                                Reject
                              </Button>
                            )}
                          </>
                        )}
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Employer Approvals Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>#</StyledTableCell>
                  <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Company Name</StyledTableCell>
                  <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Email</StyledTableCell>
                  <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Website</StyledTableCell>
                  <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Document</StyledTableCell>
                  <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Status</StyledTableCell>
                  <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profiles.map((profile, index) => (
                  <StyledTableRow key={profile._id}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{profile.cname}</StyledTableCell>
                    <StyledTableCell>{profile.email}</StyledTableCell>
                    <StyledTableCell>
                      <a href={profile.website} target="_blank" rel="noopener noreferrer">
                        {profile.website}
                      </a>
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        onClick={() => handleViewDocument(profile)}
                        color="primary"
                        title="View Document"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        label={profile.verificationStatus}
                        color={
                          profile.verificationStatus === 'Verified' 
                            ? 'success' 
                            : profile.verificationStatus === 'Rejected'
                              ? 'error'
                              : 'warning'
                        }
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2
                      }}>
                        {profile.verificationStatus === 'Pending' ? (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleVerify(profile._id, 'Verified')}
                              sx={{ minWidth: '100px' }}
                            >
                              Verify
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleVerify(profile._id, 'Rejected')}
                              sx={{ minWidth: '100px' }}
                      >
                        Reject
                      </Button>
                          </>
                        ) : profile.verificationStatus === 'Rejected' && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleVerify(profile._id, 'Verified')}
                              sx={{ minWidth: '100px' }}
                            >
                              Verify
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleDelete(profile._id)}
                              sx={{ minWidth: '100px' }}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </Box>
                  </StyledTableCell>
                </StyledTableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
        </TabPanel>
      </Box>

      {jobs.length > 0 && (
      <TablePagination
        component="div"
        count={jobs.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[7]}
        sx={{
          '.MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon': {
            display: 'none',
          },
        }}
      />
      )}

      {/* Company Profile Dialog */}
      <Dialog 
        open={openCompanyDialog} 
        onClose={() => setOpenCompanyDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle 
          sx={{ 
            bgcolor: '#360275', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Company Profile
          <IconButton 
            onClick={() => setOpenCompanyDialog(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {companyProfile && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    src={`http://localhost:3000/${companyProfile.logoUrl}`}
                    sx={{ width: 100, height: 100, mr: 3 }}
                  />
                  <Box>
                    <Typography variant="h5">{companyProfile.cname}</Typography>
                    <Typography color="textSecondary">{companyProfile.tagline}</Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                    <Typography>{companyProfile.email}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                    <Typography>{companyProfile.address}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Website</Typography>
                    <Typography>
                      <a href={companyProfile.website} target="_blank" rel="noopener noreferrer">
                        {companyProfile.website}
                      </a>
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog
        open={openDocumentDialog}
        onClose={() => setOpenDocumentDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#360275', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Company Document
          <IconButton 
            onClick={() => setOpenDocumentDialog(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, height: '80vh' }}>
          {selectedProfile?.documentUrl ? (
            <iframe
              src={`http://localhost:3000/profile/file/${selectedProfile.documentUrl.split('/').pop()}`}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Company Document"
            />
          ) : (
            <Typography variant="body1" color="error" align="center">
              No document available
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
      >
        <DialogTitle>Rejection Reason</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for rejection"
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => handleVerify(selectedProfile?._id, 'Rejected')}
            color="error"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Job Reject Dialog */}
      <Dialog
        open={openJobRejectDialog}
        onClose={() => setOpenJobRejectDialog(false)}
      >
        <DialogTitle>Rejection Reason</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for rejection"
            fullWidth
            multiline
            rows={4}
            value={jobRejectReason}
            onChange={(e) => setJobRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJobRejectDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => handleReject(selectedJobForReject?._id)}
            color="error"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Container>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default AdminJobApproval;
