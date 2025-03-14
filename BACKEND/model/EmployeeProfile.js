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
    type: [String],
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
  experienceYears: {
    type: Number,
    default: 0,
  },
  experienceMonths: {
    type: Number,
    default: 0,
  },
  atsScore: {
    type: Number,
    default: 0
  },
  atsDetails: {
    type: Object,
    default: {
      skillsScore: 0,
      structureScore: 0,
      experienceScore: 0,
      formatScore: 0,
      suggestions: []
    }
  },
});

// Export the model only if it hasn't been compiled yet
module.exports = mongoose.models.EmployeeProfile || mongoose.model('EmployeeProfile', EmployeeProfileSchema);
