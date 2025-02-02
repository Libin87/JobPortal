const mongoose = require('mongoose');

// Define the schema for the question bank
const questionBankSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: true 
  },
  options: [{ 
    type: String, 
    required: true 
  }],
  correctAnswer: { 
    type: String, // String format matches indices in your sampleQuestions
    required: true 
  },
  marks: { 
    type: Number, 
    required: true 
  },
  level: { 
    type: String,
    enum: ['Easy', 'Intermediate', 'Advanced', 'Expert'], // Adjusted to match the sampleQuestions
    required: true
  },
  category: { 
    type: String,
    required: true
  }
});

// Export the updated model
module.exports = mongoose.model('QuestionBank', questionBankSchema);
