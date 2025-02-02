const express = require('express');
const router = express.Router();
const QuestionBank = require('../model/questionBank');
const seedQuestionBank = require('../utils/seedQuestionBank');

// Seed questions route
router.post('/seed', async (req, res) => {
  try {
    const result = await seedQuestionBank();
    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(500).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error seeding question bank' });
  }
});

// Get questions by level
router.get('/questions/:level', async (req, res) => {
  try {
    const { level } = req.params;
    const { count = 10 } = req.query;

    const questions = await QuestionBank.aggregate([
      { $match: { level } },
      { $sample: { size: parseInt(count) } }
    ]);

    console.log(`Found ${questions.length} questions for level: ${level}`); // Debug log

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Get all questions (for debugging)
router.get('/all', async (req, res) => {
  try {
    const questions = await QuestionBank.find({});
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all questions' });
  }
});

// Add more routes for CRUD operations on question bank
module.exports = router; 