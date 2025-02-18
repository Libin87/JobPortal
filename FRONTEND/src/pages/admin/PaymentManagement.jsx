import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box
} from '@mui/material';
import NavbarAdmin from './NavbarAdmin';
import Footer from '../../components/Footer';
import axios from 'axios';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/payment/receipts');
        setPayments(response.data);
        
        // Calculate total amount from successful payments
        const total = response.data
          .filter(payment => payment.status === 'success')
          .reduce((sum, payment) => sum + (payment.amount || 0), 0);
        setTotalAmount(total);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div>
      <NavbarAdmin />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: '15px' }}>
          <Typography variant="h4" sx={{ mb: 3, color: '#360275', fontWeight: 'bold' }}>
            Payment Management
          </Typography>
          
          {/* Add Total Amount Summary */}
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Typography variant="h6" sx={{ color: '#360275' }}>
              Total Revenue:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              ₹{totalAmount.toLocaleString('en-IN')}
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Employer Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>{payment.jobId?.jobTitle}</TableCell>
                    <TableCell>{payment.employerId?.name}</TableCell>
                    <TableCell>{payment.amount} {payment.currency}</TableCell>
                    <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                    <TableCell>{payment.status}</TableCell>
                    <TableCell>{payment.paymentId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default PaymentManagement; 