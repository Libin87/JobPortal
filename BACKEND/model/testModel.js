const mongoose = require('mongoose');

// Question schema
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  marks: { type: Number, required: true }
});

// Test schema
const testSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  duration: { type: Number, required: true }, 
  passingMarks: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now },
  testStatus: {
    type: String,
    enum: ['Pending', 'Completed'], // Specify possible values
    default: 'Pending' // Default value
  }

});

const Test = mongoose.model('Test', testSchema);

module.exports = { Test };