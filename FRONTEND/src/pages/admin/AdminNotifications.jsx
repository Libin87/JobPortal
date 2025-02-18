import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  IconButton,
  Badge
} from '@mui/material';
import NavbarAdmin from './NavbarAdmin';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DownloadIcon from '@mui/icons-material/Download';
import NotificationsIcon from '@mui/icons-material/Notifications';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [responseDialog, setResponseDialog] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3000/notifications/admin');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      try {
        await axios.put(`http://localhost:3000/notifications/${notification._id}/read`);
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleDownload = async (documentUrl) => {
    try {
      const response = await axios.get(documentUrl, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'document');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const handleResponse = async () => {
    try {
      await axios.post(`http://localhost:3000/notifications/respond/${selectedNotification._id}`, {
        response: responseMessage
      });
      toast.success('Response sent successfully');
      setResponseDialog(false);
      setResponseMessage('');
      fetchNotifications();
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    }
  };

  return (
    <>
      <NavbarAdmin />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Notifications
          </Typography>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </Box>

        <Paper elevation={3}>
          <List>
            {notifications.map((notification) => (
              <React.Fragment key={notification._id}>
                <ListItem 
                  button 
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'rgba(54, 2, 117, 0.05)',
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2">{notification.message}</Typography>
                        <Typography variant="caption">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                        {notification.documentUrl && (
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(notification.documentUrl);
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        )}
                      </Box>
                    }
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNotification(notification);
                      setResponseDialog(true);
                    }}
                  >
                    Respond
                  </Button>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>

        <Dialog open={responseDialog} onClose={() => setResponseDialog(false)}>
          <DialogTitle>Respond to Notification</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Response Message"
              fullWidth
              multiline
              rows={4}
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResponseDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleResponse}
              variant="contained"
              color="primary"
              disabled={!responseMessage.trim()}
            >
              Send Response
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default AdminNotifications; 