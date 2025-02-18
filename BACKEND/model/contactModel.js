const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: function() {
      return this.type !== 'general_inquiry';
    }
  },
  name: {
    type: String,
    required: function() {
      return this.type === 'general_inquiry';
    }
  },
  email: {
    type: String,
    required: function() {
      return this.type === 'general_inquiry';
    }
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'jobs'
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['job_suspension', 'general_inquiry', 'other'],
    required: true,
    default: 'general_inquiry'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded'],
    default: 'new'
  },
  documentUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema); 