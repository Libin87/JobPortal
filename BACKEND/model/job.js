const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 4 && // Minimum 4 characters
        (v.match(/ /g) || []).length <= 2 && // Maximum 2 spaces
        /^[A-Za-z\s]+$/.test(v); // Only letters and spaces
      },
      message: 'Job title must be at least 4 characters long and can have maximum 2 spaces'
    }
  },
  companyName: { type: String, required: true },
  location: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 4 && // Minimum 4 characters
        (v.match(/ /g) || []).length <= 2 && // Maximum 2 spaces
        /^[A-Za-z\s]+$/.test(v); // Only letters and spaces
      },
      message: 'Location must be at least 4 characters long and can have maximum 2 spaces'
    }
  },
  salary: { type: String, required: true },
  jobType: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        if (!v) return false;
        const parts = v.split(',');
        return parts.length <= 2 && // Maximum 2 job types
               parts.every(part => part.trim().length > 0) && // No empty parts
               !/,\s*,/.test(v); // No consecutive commas
      },
      message: 'Job type format is invalid. Maximum 2 types allowed, separated by single comma'
    }
  },
  qualifications: { type: [String], required: true },
  skills: { type: [String], required: true },
  jobDescription: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Check for maximum 2 spaces per line and no repeated characters
        const lines = v.split('\n');
        return lines.every(line => {
          const spaceCount = (line.match(/ /g) || []).length;
          return spaceCount <= 2 && !/([a-zA-Z])\1{2}/.test(line);
        });
      },
      message: 'Job description can have maximum 2 spaces per line and no repeated characters'
    }
  },
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
  },
  atsScoreRequirement: {
    type: Number,
    required: true,
    min: 10,
    max: 100
  }
});

module.exports = mongoose.model('jobs', jobSchema);
