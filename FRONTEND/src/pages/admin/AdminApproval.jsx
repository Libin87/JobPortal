import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NavbarAdmin from './NavbarAdmin';
import axios from 'axios';
import { toast } from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

const AdminApproval = () => {
  const [tabValue, setTabValue] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [jobsRes, profilesRes] = await Promise.all([
        axios.get('http://localhost:3000/jobs/pending-jobs'),
        axios.get('http://localhost:3000/profile/pending-profiles')
      ]);
      
      const filteredJobs = jobsRes.data.filter(job => 
        ['Pending', 'Rejected'].includes(job.approvalStatus)
      );
      
      setJobs(filteredJobs);
      setProfiles(profilesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewDocument = (profile) => {
    setSelectedProfile(profile);
    setOpenDocumentDialog(true);
  };

  const handleVerify = async (profileId, status) => {
    try {
      if (status === 'Rejected' && !rejectReason) {
        setSelectedProfile({ _id: profileId });
        setOpenRejectDialog(true);
        return;
      }

      const payload = {
        status: status,
        message: status === 'Rejected' ? rejectReason : 
                 status === 'suspended' ? 'Account suspended by admin' : ''
      };

      await axios.put(`http://localhost:3000/profile/verify/${profileId}`, payload);

      toast.success(`Profile ${status.toLowerCase()} successfully`);
      fetchData();
      setOpenRejectDialog(false);
      setRejectReason('');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Error updating profile status');
    }
  };

  const handleJobApproval = async (jobId, status) => {
    try {
      if (status === 'Rejected' && !rejectReason) {
        setSelectedJob({ _id: jobId });
        setOpenRejectDialog(true);
        return;
      }

      const endpoint = status === 'Approved' ? 'approve' : 'reject';
      const payload = status === 'Rejected' ? { message: rejectReason } : {};

      await axios.put(`http://localhost:3000/jobs/${endpoint}/${jobId}`, payload);
      
      toast.success(`Job ${status.toLowerCase()} successfully`);
      fetchData();
      setOpenRejectDialog(false);
      setRejectReason('');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(error.response?.data?.message || 'Error updating job status');
    }
  };

  return (
    <Container maxWidth="xl">
      <NavbarAdmin />
      <Box sx={{ width: '100%', mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label={`Job Approvals (${jobs.length})`} />
          <Tab label={`Employer Approvals (${profiles.length})`} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Posted Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell>{job.jobTitle}</TableCell>
                    <TableCell>{job.companyName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={job.approvalStatus}
                        color={job.approvalStatus === 'Pending' ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(job.datePosted).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleJobApproval(job._id, 'Approved')}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      {job.approvalStatus !== 'Rejected' && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            setSelectedJob(job);
                            setOpenRejectDialog(true);
                          }}
                        >
                          Reject
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Website</TableCell>
                  <TableCell>Document</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile._id}>
                    <TableCell>{profile.cname}</TableCell>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>
                      <a href={profile.website} target="_blank" rel="noopener noreferrer">
                        {profile.website}
                      </a>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleViewDocument(profile)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleVerify(profile._id, 'Verified')}
                      >
                        Verify
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleVerify(profile._id, 'suspended')}
                        sx={{ ml: 1 }}
                      >
                        Suspend
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                          setSelectedProfile(profile);
                          setOpenRejectDialog(true);
                        }}
                        sx={{ ml: 1 }}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Document Viewer Dialog */}
        <Dialog
          open={openDocumentDialog}
          onClose={() => setOpenDocumentDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Company Document
            <IconButton
              onClick={() => setOpenDocumentDialog(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedProfile?.documentUrl && (
              <iframe
                src={`http://localhost:3000/profile/file/${selectedProfile.documentUrl.split('/').pop()}`}
                width="100%"
                height="500px"
                style={{ border: 'none' }}
                title="Company Document"
              />
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
              required
              error={!rejectReason && openRejectDialog}
              helperText={!rejectReason && openRejectDialog ? 'Rejection reason is required' : ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
            <Button 
              onClick={() => handleVerify(selectedProfile?._id, 'Rejected')}
              color="error"
              disabled={!rejectReason}
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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

export default AdminApproval; 