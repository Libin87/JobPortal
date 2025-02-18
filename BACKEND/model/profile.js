const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  cname: String,
  email: String,
  address: String,
  tagline: String,
  website: String,
  logoUrl: String,
  documentUrl: String,
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected', 'suspended'],
    default: 'Pending'
  },
  verificationMessage: String
});

module.exports = mongoose.model('Profile', ProfileSchema);
