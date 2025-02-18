import React from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Typography,
    Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';

const SuspensionNotice = ({ message, open, onClose }) => {
    const navigate = useNavigate();

    const handleContactAdmin = () => {
        onClose(); // Close the dialog first
        navigate('/contactus', { replace: true }); // Use replace to prevent back navigation
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: 3
                }
            }}
        >
            <DialogTitle 
                sx={{ 
                    bgcolor: '#d32f2f', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <ErrorIcon /> Account Suspended
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    gap: 2,
                    py: 2 
                }}>
                    <Typography variant="h6" color="error" align="center">
                        {message || 'Your account has been suspended.'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center">
                        Please contact our admin team for support and further information regarding your account status.
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleContactAdmin}
                    sx={{ 
                        bgcolor: '#360275',
                        '&:hover': { bgcolor: '#2c0261' }
                    }}
                >
                    Contact Admin
                </Button>
                <Button 
                    variant="outlined" 
                    onClick={onClose}
                    sx={{ 
                        color: '#360275',
                        borderColor: '#360275',
                        '&:hover': { 
                            borderColor: '#2c0261',
                            bgcolor: 'rgba(54, 2, 117, 0.04)'
                        }
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SuspensionNotice;