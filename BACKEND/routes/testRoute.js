const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { TestResult } = require('../model/testResultModel');
const Job = require('../model/job'); // Add this import
const { Test } = require('../model/testModel');
const Application = require('../model/applicationModel'); // Add this import

// Route to create a test
router.post('/createTest', async (req, res) => {
  try {
    const { testName, employerId, jobId, duration, passingMarks, totalMarks, questions } = req.body;

    // Validate input
    if (!testName || !duration || !passingMarks || !totalMarks || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    // Validate questions
    for (const question of questions) {
      if (!question.question || !Array.isArray(question.options) || question.options.length === 0 || !question.correctAnswer || !question.marks) {
        return res.status(400).json({ message: 'Invalid question format' });
      }
    }

    const newTest = new Test({
      testName,
      employerId,
      jobId,
      duration,
      passingMarks,
      totalMarks,
      questions,
      testStatus:'Pending'
    });

    await newTest.save();
    res.status(201).json({ message: 'Test created successfully', test: newTest });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ message: 'Error creating test', error: error.message });
  }
});

// Route to submit a test result
router.post('/submitTest', async (req, res) => {
  try {
    const { testId, employeeId, answers } = req.body;

    const test = await Test.findById(testId);
    let score = 0;

    // Calculate score
    test.questions.forEach((question) => {
      if (answers[question._id] === question.correctAnswer) {
        score += question.marks;
      }
    });

    const passed = score >= test.passingMarks;

    // Here you can save the result to a results collection if needed

    res.status(201).json({ message: 'Test submitted successfully', score, passed });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ message: 'Error submitting test', error });
  }
});

// Get tests for a specific employee based on their job applications
router.get('/employee-tests/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Step 1: Find all pending job applications for the employee
    const pendingApplications = await Application.find({
      userId: employeeId,
      approvalStatus: 'Pending',
    }).select('jobId');

    if (pendingApplications.length === 0) {
      return res.json({
        hasTests: false,
        message: "No tests available. You haven't applied for any jobs or all tests have been completed.",
      });
    }

    // Extract job IDs from the applications
    const jobIds = pendingApplications.map((app) => app.jobId);

    // Step 2: Fetch tests associated with these jobs and ensure they haven't been taken
    const tests = await Test.aggregate([
      {
        $match: {
          jobId: { $in: jobIds },
        },
      },
      // Join with jobs collection to get job details
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'jobDetails',
        },
      },
      {
        $unwind: '$jobDetails',
      },
      // Check if the test hasn't been taken by this employee
      {
        $lookup: {
          from: 'testresults',
          let: { testId: '$_id', employeeId: new mongoose.Types.ObjectId(employeeId) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$testId', '$$testId'] },
                    { $eq: ['$employeeId', '$$employeeId'] },
                  ],
                },
              },
            },
          ],
          as: 'testResults',
        },
      },
      // Filter tests that have not been taken yet
      {
        $match: {
          testResults: { $size: 0 },
        },
      },
      // Select only the required fields for the response
      {
        $project: {
          _id: 1,
          testName: 1,
          duration: 1,
          totalMarks: 1,
          passingMarks: 1,
          jobTitle: '$jobDetails.jobTitle',
          companyName: '$jobDetails.companyName',
          createdAt: 1,
        },
      },
    ]);

    // Step 3: Return the response based on the test data
    if (tests.length === 0) {
      return res.json({
        hasTests: false,
        message: 'No tests available. Either you have completed all tests or no tests are assigned to your applications.',
      });
    }

    res.json({
      hasTests: true,
      tests,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while fetching tests.',
      error: error.message,
    });
  }
});

// Save test result
router.post('/save-result', async (req, res) => {
  try {
    const { 
      testId, 
      employeeId, 
      jobId,
      score, 
      totalMarks,
      result,
      answers, 
      timeTaken 
    } = req.body;

    // Validate required fields
    if (!testId || !employeeId || !jobId) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: { testId, employeeId, jobId }
      });
    }
    
    const testResult = new TestResult({
      testId,
      employeeId,
      jobId,
      score,
      totalMarks,
      result,
      answers,
      timeTaken,
      submittedAt: new Date()
    });

    await testResult.save();

    // Update the application's test status
    const updatedApplication = await Application.findOneAndUpdate(
      { 
        userId: employeeId,
        jobId: jobId 
      },
      { 
        testStatus: 'Completed',
        testScore: score,
        testResult: result
      },
      { new: true }
    );

    if (!updatedApplication) {
      console.warn('No application found to update');
    }

    res.status(201).json({ 
      message: 'Test result saved successfully',
      result: testResult 
    });
  } catch (error) {
    console.error('Error saving test result:', error);
    res.status(500).json({ 
      message: 'Error saving test result', 
      error: error.message,
      details: error.errors // Include validation errors if any
    });
  }
});

// Route to get a specific test
router.get('/get-test/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    
    const test = await Test.findById(testId);
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Format the test data for the frontend
    const formattedTest = {
      _id: test._id,
      testName: test.testName,
      duration: test.duration,
      totalMarks: test.totalMarks,
      passingMarks: test.passingMarks,
      jobId: test.jobId,
      questions: test.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        marks: q.marks
      }))
    };

    // If there's a jobId, fetch job details separately
    if (test.jobId) {
      const job = await Job.findById(test.jobId);
      if (job) {
        formattedTest.jobTitle = job.jobTitle;
        formattedTest.companyName = job.companyName;
      }
    }

    res.json(formattedTest);
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({ 
      message: 'Error fetching test details',
      error: error.message 
    });
  }
});

module.exports = router;
