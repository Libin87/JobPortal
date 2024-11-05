// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const applicationSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Reference to the user applying
//   jobId: { type: Schema.Types.ObjectId, ref: 'jobs', required: true },   // Reference to the job
//   appliedAt: { type: Date, default: Date.now },                         // Date of application
// });

// const Application = mongoose.model('Application', applicationSchema);
// module.exports = Application;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users' }, 
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

});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
