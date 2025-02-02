const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users' }, // Reference to the user applying
  jobId: { type: Schema.Types.ObjectId, ref: 'jobs' },
  employerId: { type: Schema.Types.ObjectId, ref: 'jobs' }, 
  appliedAt: { type: Date, default: Date.now },
  name: { type: String },                               
  email: { type: String },                               
  experience: { type: Number },                           
  degree: { type: String },                               
  jobTitle: { type: String },                             
  resume: { type: String },                               
  address: { type: String },                             
  skills: { type: [String] },                           
  jobPreferences: { type: [String] },                 
  photo: { type: String },                                
  dob: { type: Date },                                 
  phone: { type: String } ,
  companyName:{ type: String } ,
  approvalStatus: { type: String, default: 'pending' },
  testStatus: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  testScore: {
    type: Number
  },
  testResult: {
    type: String,
    enum: ['Pass', 'Fail']
  }
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
