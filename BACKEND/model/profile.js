const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cname:String,
  email: String,
  address: String,
  tagline: String,
  website: String,
  logoUrl: String,
});
module.exports = mongoose.model('Profile', ProfileSchema);
