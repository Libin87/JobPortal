const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    name:String,
    username:String,
    password:String,
    email:String,
    phone:Number,
    role: { type: String, required: true,
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


