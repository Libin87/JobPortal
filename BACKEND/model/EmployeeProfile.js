
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeProfileSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  degree: {
    type: String,
  },
  experience: {
    type: Number,
  },
  skills: {
    type: [String], 
  },
  dob: {
    type: Date,
    required: true,
  },
  jobPreferences: {
    type: [String], 
  },
  photo: {
    type: String,
  },
  resume: {
    type: String,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('EmployeeProfile', EmployeeProfileSchema);
