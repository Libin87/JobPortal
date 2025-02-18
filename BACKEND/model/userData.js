const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

// Define notification schema separately
const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['suspension', 'activation'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }
});

const userSchema = mongoose.Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    phone: Number,
    role: { 
        type: String,
        enum: ['employee', 'employer'] 
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    accountStatus: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    },
    notifications: [notificationSchema] // Use the notification schema here
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;

