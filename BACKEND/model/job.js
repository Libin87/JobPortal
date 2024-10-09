// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  companyName:{type:String},
  location: { type: String, required: true },
  salary: { type: String, required: true },
  jobType: { type: String, required: true },
  qualifications: { type: String, required: true },
  skills: { type: String, required: true },
  jobDescription: { type: String, required: true },
  experience: { type: String, required: true },
  contactDetails: { type: String, required: true },
  lastDate: { type: Date, required: true },
  datePosted: { type: Date, default: Date.now },
  status: { type: String, default: 'active' },
  approvalStatus: { type: String, default: 'pending' },
  approvedBy: { type: String, default: null },
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: 'users'
  },
});

module.exports = mongoose.model('jobs', jobSchema);


