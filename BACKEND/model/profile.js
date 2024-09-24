
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String },
  tagline: { type: String },
  website: { type: String },
  logoUrl: { type: String },
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
