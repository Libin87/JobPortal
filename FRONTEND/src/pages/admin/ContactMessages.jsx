import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
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
  TextField,
  Chip,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import NavbarAdmin from './NavbarAdmin';
import Footer from '../../components/Footer';
import moment from 'moment';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [response, setResponse] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:3000/contact/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setAlert({
        open: true,
        message: 'Error fetching messages',
        severity: 'error'
      });
    }
  };

  const handleRespond = (message) => {
    setSelectedMessage(message);
    setOpenDialog(true);
  };

  const handleSendResponse = async () => {
    try {
      await axios.post(`http://localhost:3000/contact/respond/${selectedMessage._id}`, {
        response,
        email: selectedMessage.email
      });

      setAlert({
        open: true,
        message: 'Response sent successfully',
        severity: 'success'
      });
      
      setOpenDialog(false);
      setResponse('');
      fetchMessages(); // Refresh the messages list
    } catch (error) {
      setAlert({
        open: true,
        message: 'Error sending response',
        severity: 'error'
      });
    }
  };

  const handleViewDocument = (documentUrl) => {
    if (documentUrl) {
      const fullUrl = `http://localhost:3000${documentUrl}`;
      window.open(fullUrl, '_blank');
    }
  };

  return (
    <>
      <NavbarAdmin />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, backgroundColor: '#4B647D', borderRadius: '15px' }}>
          <Typography variant="h4" sx={{ mb: 4, color: 'white', textAlign: 'center' }}>
            Contact Messages
          </Typography>
        </Paper>

        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Message</strong></TableCell>
                <TableCell><strong>Document</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message._id}>
                  <TableCell>
                    {moment(message.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.message}</TableCell>
                  <TableCell>
                    {message.documentUrl ? (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DescriptionIcon />}
                        endIcon={<OpenInNewIcon />}
                        onClick={() => handleViewDocument(message.documentUrl)}
                        sx={{
                          borderColor: '#360275',
                          color: '#360275',
                          '&:hover': {
                            borderColor: '#2A0163',
                            backgroundColor: 'rgba(54, 2, 117, 0.04)'
                          }
                        }}
                      >
                        View Document
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No document
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={message.status}
                      color={message.status === 'new' ? 'warning' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<EmailIcon />}
                      onClick={() => handleRespond(message)}
                      disabled={message.status === 'responded'}
                      sx={{ mr: 1 }}
                    >
                      Respond
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Respond to {selectedMessage?.name}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2, mt: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Original Message:
              </Typography>
              <Typography>{selectedMessage?.message}</Typography>
              
              {selectedMessage?.documentUrl && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Attached Document:
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DescriptionIcon />}
                    onClick={() => handleViewDocument(selectedMessage.documentUrl)}
                    sx={{
                      mt: 1,
                      borderColor: '#360275',
                      color: '#360275',
                      '&:hover': {
                        borderColor: '#2A0163',
                        backgroundColor: 'rgba(54, 2, 117, 0.04)'
                      }
                    }}
                  >
                    View Document
                  </Button>
                </Box>
              )}
            </Box>
            <TextField
              fullWidth
              label="Your Response"
              multiline
              rows={4}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSendResponse}
              variant="contained"
              color="primary"
              disabled={!response.trim()}
            >
              Send Response
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={() => setAlert(prev => ({ ...prev, open: false }))}
        >
          <Alert 
            onClose={() => setAlert(prev => ({ ...prev, open: false }))} 
            severity={alert.severity}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </>
  );
};

export default ContactMessages; 