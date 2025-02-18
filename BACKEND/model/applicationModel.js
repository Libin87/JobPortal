const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'jobs',
    required: true
  },
  employerId: { type: Schema.Types.ObjectId, ref: 'jobs' }, 
  appliedAt: { type: Date, default: Date.now },
  name: { type: String },                               
  email: { type: String },                               
  experience: { type: Number },                           
  degree: { type: String },                               
  jobTitle: {
    type: String,
    required: true
  },
  resume: { type: String },                               
  address: { type: String },                             
  skills: { type: [String] },                           
  jobPreferences: { type: [String] },                 
  photo: { type: String },                                
  dob: { type: Date },                                 
  phone: { type: String } ,
  companyName: {
    type: String,
    required: true
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'approved', 'rejected', 'suspended'],
    default: 'Pending'
  },
  statusMessage: { 
    type: String 
  },
  testStatus: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  testScore: {
    type: Number,
    default: null
  },
  testResult: {
    type: String,
    enum: ['Pass', 'Fail', null],
    default: null
  }
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
