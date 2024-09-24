
// const express=require('express')
// const mongoose=require('mongoose')
// const morgan =require('morgan')
// const cors=require('cors');
// require("./db/connection")
// const app=express();
// require('dotenv').config();
// app.use(morgan('dev'));
// app.use(cors());


// const api1=require('./routes/userRoute');
// app.use('/user',api1)

// const PORT=process.env.PORT;
// app.listen(PORT,()=>{
//     console.log(`Server running on PORT ${PORT}`)
// })

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
require('./db/connection'); 
const jobRoutes = require('./routes/jobs');
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});


