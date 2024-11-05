// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'employee' }, // Default to employee
    googleId: { type: String, unique: true }, // Store Google UID to prevent duplicates
});

module.exports = mongoose.model('User', UserSchema);
