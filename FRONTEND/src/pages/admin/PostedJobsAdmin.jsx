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
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Menu,
  Divider,
  MenuItem,
  Box,
  DialogContentText,
  Badge,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NavbarAdmin from './NavbarAdmin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { formatDate } from '../../utils/dateFormatter';

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

const PostedJobsAdmin = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(7);
  const [openSuspendDialog, setOpenSuspendDialog] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/jobs/viewjob');
        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs.');
      }
    };

    fetchJobs();
    fetchNotifications().catch(err => {
      // Only show error toast if it's not a 404 (no notifications)
      if (err.response?.status !== 404) {
        console.error('Error fetching notifications:', err);
      }
    });

    // Poll for new notifications every minute
    const interval = setInterval(() => {
      fetchNotifications().catch(err => {
        if (err.response?.status !== 404) {
          console.error('Error fetching notifications:', err);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3000/notifications/admin/notifications');
      const notifications = response.data;
      setNotifications(notifications);
      setUnreadCount(notifications.filter(notif => !notif.read).length);
    } catch (error) {
      // Only throw error if it's not a 404
      if (error.response?.status !== 404) {
        throw error;
      }
      // If no notifications found, set empty array
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:3000/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleViewResponse = (response) => {
    setSelectedResponse(response);
    setShowResponseDialog(true);
    handleNotificationRead(response._id);
  };

  const handleApproveResponse = async () => {
    try {
      await axios.put(`http://localhost:3000/jobs/reactivate/${selectedResponse.jobId}`, {
        status: 'active',
        approvalStatus: 'approved'
      });

      // Create notification for employer
      await axios.post('http://localhost:3000/notifications', {
        userId: selectedResponse.userId,
        title: 'Job Reactivated',
        message: 'Your job has been reactivated after reviewing your response.',
        type: 'job',
        jobId: selectedResponse.jobId
      });

      toast.success('Job reactivated successfully');
      setShowResponseDialog(false);
      setSelectedResponse(null);
      // Refresh jobs list
      const response = await axios.get('http://localhost:3000/jobs/viewjob');
      setJobs(response.data);
    } catch (error) {
      console.error('Error approving response:', error);
      toast.error('Failed to reactivate job');
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`http://localhost:3000/jobs/${jobId}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      toast.success('Job deleted successfully!');
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete the job.');
      toast.error('Failed to delete the job.');
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    // If salary doesn't start with ₹, add it
    return salary.startsWith('₹') ? salary : `₹${salary}`;
  };

  const formatExperience = (exp) => {
    if (!exp) return 'Not specified';
    const years = exp.years || 0;
    const months = exp.months || 0;
    
    if (years === 0 && months === 0) return 'Fresher';
    if (years === 0) return `${months} month${months > 1 ? 's' : ''}`;
    if (months === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
  };

  const getJobStatus = (job) => {
    const currentDate = new Date();
    const lastDate = new Date(job.lastDate);
    
    if (job.status === 'expired' || lastDate < currentDate) {
      return <span style={{ color: 'red' }}>Expired</span>
    }
    
    // Calculate days remaining                   
    const daysRemaining = Math.ceil((lastDate - currentDate) / (1000 * 60 * 60 * 24));
    return (
      <span style={{ color: daysRemaining <= 5 ? 'orange' : 'green' }}>
        {daysRemaining} days remaining
      </span>
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSuspendClick = (jobId) => {
    setSelectedJobId(jobId);
    setOpenSuspendDialog(true);
  };

  const handleSuspendConfirm = async () => {
    try {
      await axios.put(`http://localhost:3000/jobs/suspend/${selectedJobId}`, {
        reason: suspensionReason
      });
      
      setJobs(prevJobs => prevJobs.map(job => 
        job._id === selectedJobId 
          ? { ...job, status: 'suspended' }
          : job
      ));
      
      toast.success('Job suspended successfully');
      setOpenSuspendDialog(false);
      setSuspensionReason('');
      setSelectedJobId(null);
    } catch (error) {
      console.error('Error suspending job:', error);
      toast.error('Failed to suspend job');
    }
  };

  const handleReactivate = async (jobId) => {
    try {
      await axios.put(`http://localhost:3000/jobs/reactivate/${jobId}`);
      
      setJobs(prevJobs => prevJobs.map(job => 
        job._id === jobId 
          ? { ...job, status: 'active' }
          : job
      ));
      
      toast.success('Job reactivated successfully');
    } catch (error) {
      console.error('Error reactivating job:', error);
      toast.error('Failed to reactivate job');
    }
  };

  const handleAdminResponse = async (notification, responseMessage) => {
    try {
      await axios.post('http://localhost:3000/notifications/admin/respond', {
        userId: notification.fromUserId._id,
        jobId: notification.jobId?._id,
        message: responseMessage,
        originalNotificationId: notification._id
      });

      toast.success('Response sent successfully');
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    }
  };

  return (
    <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
      <NavbarAdmin />
      <Typography variant="h4" style={{ textAlign: 'center', marginTop: '40px', color: '#360275' }}>
        Posted Jobs
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
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Salary</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Job Type</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Qualifications</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Skills</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Experience</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Vacancy</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Last Date</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Posted Date</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Status</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Days Remaining</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Approval Status</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Payment Status</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length > 0 ? (
              jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((job, index) => (
                <StyledTableRow key={job._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{job.jobTitle}</StyledTableCell>
                  <StyledTableCell>{job.companyName}</StyledTableCell>
                  <StyledTableCell>{job.location}</StyledTableCell>
                  <StyledTableCell>{formatSalary(job.salary)}</StyledTableCell>
                  <StyledTableCell>{job.jobType}</StyledTableCell>
                  <StyledTableCell>{job.qualifications}</StyledTableCell>
                  <StyledTableCell>{job.skills.join(', ')}</StyledTableCell>
                  <StyledTableCell>{formatExperience(job.experience)}</StyledTableCell>
                  <StyledTableCell>{job.vaccancy}</StyledTableCell>
                  <StyledTableCell>{formatDate(job.lastDate)}</StyledTableCell>
                  <StyledTableCell>{formatDate(job.datePosted)}</StyledTableCell>
                  <StyledTableCell>{job.status}</StyledTableCell>
                  <StyledTableCell>{getJobStatus(job)}</StyledTableCell>
                  <StyledTableCell>{job.approvalStatus}</StyledTableCell>
                  <StyledTableCell>{job.paymentStatus}</StyledTableCell>
                  <StyledTableCell>
                    <ButtonContainer>
                      {job.status === 'suspended' ? (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleReactivate(job._id)}
                        >
                          Reactivate
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleSuspendClick(job._id)}
                          disabled={job.status === 'Expired'}
                        >
                          Suspend
                        </Button>
                      )}
                    </ButtonContainer>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={16}>No jobs posted.</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

      <Dialog open={openSuspendDialog} onClose={() => setOpenSuspendDialog(false)}>
        <DialogTitle>Suspend Job</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Suspension"
            fullWidth
            multiline
            rows={4}
            value={suspensionReason}
            onChange={(e) => setSuspensionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSuspendDialog(false)}>Cancel</Button>
          <Button onClick={handleSuspendConfirm} color="error">
            Suspend
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Icon */}
      <Box sx={{ position: 'fixed', top: 75, right: 20, zIndex: 1000 }}>
        <IconButton
          onClick={handleNotificationClick}
          size="large"
          sx={{
            backgroundColor: 'white',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon sx={{ color: '#360275' }} />
          </Badge>
        </IconButton>
      </Box>

      {/* Notifications Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: '300px',
            mt: 1.5,
          },
        }}
      >
        <Typography sx={{ p: 2, fontWeight: 'bold', color: '#360275' }}>
          Notifications
        </Typography>
        <Divider />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => {
                if (notification.type === 'job_response') {
                  handleViewResponse(notification);
                }
                handleNotificationRead(notification._id);
              }}
              sx={{
                backgroundColor: notification.read ? 'transparent' : 'rgba(54, 2, 117, 0.05)',
                whiteSpace: 'normal',
                padding: 2,
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {new Date(notification.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Response Dialog */}
      <Dialog open={showResponseDialog} onClose={() => setShowResponseDialog(false)}>
        <DialogTitle>Employer Response</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedResponse?.message}
          </DialogContentText>
          {selectedResponse?.documentUrl && (
            <Button
              href={selectedResponse.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mt: 2 }}
            >
              View Attached Document
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResponseDialog(false)}>Close</Button>
          <Button onClick={handleApproveResponse} color="primary" variant="contained">
            Approve & Reactivate Job
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Container>
  );
};

export default PostedJobsAdmin;
