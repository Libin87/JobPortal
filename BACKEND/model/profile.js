const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  cname:String,
  email: String,
  address: String,
  tagline: String,
  website: String,
  logoUrl: String,
});
module.exports = mongoose.model('Profile', ProfileSchema);
