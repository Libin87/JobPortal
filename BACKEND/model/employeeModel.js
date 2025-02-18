const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    resume: String // Ensure this field matches what you're updating
});

module.exports = mongoose.model('Employee', employeeSchema);
