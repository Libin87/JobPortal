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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(7);
  const [profileStatuses, setProfileStatuses] = useState({});
  const [openSuspendDialog, setOpenSuspendDialog] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [usersResponse, profilesResponse] = await Promise.all([
          axios.get('http://localhost:3000/user/users'),
          axios.get('http://localhost:3000/profile/all-profiles')
        ]);

        const users = usersResponse.data;
        const profiles = profilesResponse.data;

        const statusMap = profiles.reduce((acc, profile) => {
          acc[profile.userId] = profile.verificationStatus || 'Not Submitted';
          return acc;
        }, {});

        setProfileStatuses(statusMap);
        setUsers(users);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users.');
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/user/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.success('User deleted successfully!');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete the user.');
      toast.error('Failed to delete the user.');
    }
  };

  const handleToggleSuspension = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      
      let response;
      if (newStatus === 'suspended') {
        if (!suspensionReason.trim()) {
          toast.error('Please provide a reason for suspension');
          return;
        }
        response = await axios.put(`http://localhost:3000/user/users/${userId}/status`, {
          status: newStatus,
          reason: suspensionReason.trim()
        });
      } else {
        // For activation, no reason needed
        response = await axios.put(`http://localhost:3000/user/users/${userId}/status`, {
          status: 'active' // Directly set to active
        });
      }

      if (response.data) {
        setUsers(prevUsers => prevUsers.map(user => 
          user._id === userId 
            ? { ...user, accountStatus: newStatus }
            : user
        ));
        
        setOpenSuspendDialog(false);
        setSuspensionReason('');
        toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully!`);
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleSuspendClick = (userId) => {
    setSelectedUserId(userId);
    setOpenSuspendDialog(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
      <NavbarAdmin />
      <Typography variant="h4" style={{ textAlign: 'center', marginTop: '40px', color: '#360275' }}>
        Manage Users
      </Typography>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table style={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>#</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Name</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Email</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Phone</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Created On</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Role</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Verification Status</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Account Status</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                <StyledTableRow key={user._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{user.name}</StyledTableCell>
                  <StyledTableCell>{user.email}</StyledTableCell>
                  <StyledTableCell>{user.phone}</StyledTableCell>
                  <StyledTableCell>{new Date(user.createdAt).toLocaleDateString()}</StyledTableCell>
                  <StyledTableCell>{user.role}</StyledTableCell>
                  <StyledTableCell>
                    {user.role === 'employer' ? (
                      <Chip
                        label={profileStatuses[user._id] || 'Not Submitted'}
                        color={
                          profileStatuses[user._id] === 'Verified'
                            ? 'success'
                            : profileStatuses[user._id] === 'Rejected'
                              ? 'error'
                              : profileStatuses[user._id] === 'Pending'
                                ? 'warning'
                                : 'default'
                        }
                        size="small"
                      />
                    ) : (
                      <Chip
                        label="N/A"
                        color="default"
                        size="small"
                      />
                    )}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={user.accountStatus || 'active'}
                      color={user.accountStatus === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <ButtonContainer>
                      <Button
                        variant="contained"
                        color={user.accountStatus === 'active' ? 'error' : 'success'}
                        onClick={() => user.accountStatus === 'active' 
                          ? handleSuspendClick(user._id)  // For suspension
                          : handleToggleSuspension(user._id, 'suspended') // For activation
                        }
                        sx={{
                          minWidth: '120px',
                          bgcolor: user.accountStatus === 'active' ? '#d32f2f' : '#2e7d32',
                          '&:hover': {
                            bgcolor: user.accountStatus === 'active' ? '#c62828' : '#1b5e20'
                          }
                        }}
                      >
                        {user.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </ButtonContainer>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={5}>No users found.</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={users.length}
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
        <DialogTitle>Suspend User</DialogTitle>
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
          <Button 
            onClick={() => handleToggleSuspension(selectedUserId, 'active')}
            color="error"
          >
            Suspend
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Container>
  );
};

export default ManageUsers;
