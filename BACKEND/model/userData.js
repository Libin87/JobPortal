const mongoose=require('mongoose')
const bcrypt = require('bcryptjs');
const userSchema=mongoose.Schema({
    name:String,
    username:String,
    password:String,
    email:String,
    phone:Number,
    role: { type: String,
         enum: ['employee', 'employer'] },
    createdAt:{
        type:Date,
        default:new Date()
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
})
const userModel=mongoose.model('users',userSchema);
module.exports=userModel;

