const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobTitle: String,
    companyName: String,
    // ... other fields
});

module.exports = mongoose.model('Job', jobSchema); 