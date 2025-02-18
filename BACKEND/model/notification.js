const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['application', 'job', 'profile', 'other', 'admin_contact', 'admin_response'],
    default: 'other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  actionLink: {
    type: String
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'jobs'
  },
  isAdminNotification: {
    type: Boolean,
    default: false
  },
  documentUrl: String,
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }
});

module.exports = mongoose.model('Notification', notificationSchema); 