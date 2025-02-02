
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
require('./db/connection'); 
const siteReportRoute = require('./routes/siteReport');
const jobRoutes = require('./routes/jobs');
const profileRoute = require('./routes/EmpProfileRoute'); // Import the route
const paymentRoutes=require('./routes/paymentRoutes');
const app = express();

app.use(morgan('dev'));  // Log requests
app.use(cors()); 
app.use(express.json());
const userRoutes = require('./routes/userRoute');
app.use('/user', userRoutes);
const profileRoutes = require('./routes/profile');
app.use('/profile', profileRoutes);  
app.use('/uploads', express.static('uploads'));
app.use('/jobs', jobRoutes);
app.use('/api/', siteReportRoute);
app.use('/Employeeprofile', profileRoute);
app.use('/api/payment', paymentRoutes);
app.use('/test', require('./routes/testRoute'));
app.use('/questionBank', require('./routes/questionBankRoute'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});

