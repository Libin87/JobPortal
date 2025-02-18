const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  jobType: { type: String, required: true },
  qualifications: { type: [String], required: true },
  skills: { type: [String], required: true },
  jobDescription: { type: String, required: true },
  experience: {
    years: {
      type: Number,
      min: 0,
      max: 60,
      required: true
    },
    months: {
      type: Number,
      min: 0,
      max: 11,
      required: true
    }
  },
  contactDetails: { type: String, required: true },
  vaccancy: { type: String, required: true },
  lastDate: { type: Date, required: true },
  datePosted: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['active', 'Expired', 'suspended'],
    default: 'active'
  },
  suspensionReason: {
    type: String
  },
  suspendedAt: {
    type: Date
  },
  suspendedBy: {
    type: String
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'approved', 'Rejected'],
    default: 'Pending'
  },
  verificationMessage: String,
  approvalDate: { type: Date },
  approvedBy: { type: String, default: null },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users' // Ensure this refers to the correct collection name
  },
  logoUrl: { type: String, required: true },
  paymentStatus: { type: String, default: 'Pending' },
  testStatus: {
    type: String,
    enum: ['Pending', 'Completed'], // Specify possible values
    default: 'Pending' // Default value
  }
});

module.exports = mongoose.model('jobs', jobSchema);
