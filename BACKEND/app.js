
// // const express=require('express')
// // const mongoose=require('mongoose')
// // const morgan =require('morgan')
// // const cors=require('cors');
// // require("./db/connection")
// // const app=express();
// // require('dotenv').config();
// // app.use(morgan('dev'));
// // app.use(cors());


// // const api1=require('./routes/userRoute');
// // app.use('/user',api1)

// // const PORT=process.env.PORT;
// // app.listen(PORT,()=>{
// //     console.log(`Server running on PORT ${PORT}`)
// // })

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
app.use(cors({ origin: '*' }));
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});

