
const mongoose=require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.uri)
.then(()=>{
    console.log("Connection successfull")
})
.catch((err)=>{
    console.log("Error cannot connect to DB",err)
})