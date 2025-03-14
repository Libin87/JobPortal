const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { TestResult } = require('../model/testResultModel');
const Job = require('../model/job'); // Add this import
const { Test } = require('../model/testModel');
const Application = require('../model/applicationModel'); // Add this import
const EmployeeProfile = require('../model/EmployeeProfile'); // Fix: correct path to EmployeeProfile model



router.post('/createTest', async (req, res) => {
  try {
    const { 
      testName, 
      employerId, 
      jobId, 
      duration, 
      passingMarks, 
      totalMarks, 
      questions, 
      lastDate,
      difficultyLevel
    } = req.body;

    // Validate input
    if (!testName || !duration || !passingMarks || !totalMarks || !questions || !Array.isArray(questions) || !lastDate || !difficultyLevel) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    // Validate last date
    const testLastDate = new Date(lastDate);
    const today = new Date();
    if (testLastDate < today) {
      return res.status(400).json({ message: 'Last date cannot be in the past' });
    }

    // If jobId is provided, check if a test already exists for this job
    if (jobId) {
      const existingTest = await Test.findOne({ jobId });
      if (existingTest) {
        return res.status(400).json({ 
          message: 'A test already exists for this job. Each job can have only one test.' 
        });
      }
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
      lastDate: testLastDate,
      difficultyLevel,
      testStatus: 'Active'
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
    console.log('\n=== Starting Test Access Check ===');
    console.log('Employee ID:', employeeId);

    // 1. Get user's ATS score first
    const userProfile = await EmployeeProfile.findOne({ userId: employeeId });
    if (!userProfile) {
      console.log('❌ User profile not found');
      return res.json([]);
    }

    const userAtsScore = parseFloat(userProfile.atsScore) || 0;
    console.log('👤 User Profile Found:');
    console.log('- ATS Score:', userAtsScore, '%');

    // 2. Get all pending applications
    const applications = await Application.find({
      userId: employeeId,
      testStatus: 'Pending'
    });

    if (!applications.length) {
      console.log('No pending applications found');
      return res.json([]);
    }

    // 3. Get jobs for these applications
    const jobIds = applications.map(app => app.jobId);
    const Job = mongoose.model('jobs'); // Get the model this way
    const jobs = await Job.find({ _id: { $in: jobIds } });

    // 4. Filter eligible jobs
    const eligibleJobIds = jobs
      .filter(job => {
        const isEligible = userAtsScore >= (job.atsScoreRequirement || 0);
        console.log(`\nJob ${job.jobTitle}:`);
        console.log(`Required ATS: ${job.atsScoreRequirement}%`);
        console.log(`User ATS: ${userAtsScore}%`);
        console.log(`Eligible: ${isEligible ? '✅ Yes' : '❌ No'}`);
        return isEligible;
      })
      .map(job => job._id);

    console.log('\n✨ Eligible Jobs:', eligibleJobIds.length);

    // 5. Get tests for eligible jobs
    const tests = await Test.find({
      jobId: { $in: eligibleJobIds },
      testStatus: 'Active'
    });

    // 6. Format response with job details
    const formattedTests = await Promise.all(tests.map(async test => {
      const job = jobs.find(j => j._id.toString() === test.jobId.toString());
      return {
        _id: test._id,
        testName: test.testName,
        jobTitle: job?.jobTitle,
        companyName: job?.companyName,
        duration: test.duration,
        totalMarks: test.totalMarks,
        lastDate: test.lastDate,
        jobId: test.jobId,
        atsRequired: job?.atsScoreRequirement,
        userAtsScore: userAtsScore
      };
    }));

    console.log('\n=== Test Access Check Complete ===');
    console.log(`Returning ${formattedTests.length} eligible tests\n`);

    return res.json(formattedTests);

  } catch (error) {
    console.error('\n❌ Error in employee-tests route:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      message: 'Error fetching tests',
      error: error.message,
      stack: error.stack
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
    
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ message: 'Invalid test ID format' });
    }

    const test = await Test.findById(testId);
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Add console log to debug
    console.log('Test from database:', {
      testName: test.testName,
      difficultyLevel: test.difficultyLevel,
      // ... other relevant fields
    });

    // Format the test data for the frontend
    const formattedTest = {
      _id: test._id,
      testName: test.testName,
      duration: test.duration,
      totalMarks: test.totalMarks,
      passingMarks: test.passingMarks,
      jobId: test.jobId,
      numberOfQuestions: test.questions.length,
      difficultyLevel: test.difficultyLevel,
      lastDate: test.lastDate,
      questions: test.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        marks: q.marks,
        correctAnswer: q.correctAnswer
      }))
    };

    // If there's a jobId, fetch job details
    if (test.jobId) {
      const job = await Job.findById(test.jobId);
      if (job) {
        formattedTest.jobTitle = job.jobTitle;
        formattedTest.companyName = job.companyName;
      }
    }

    // Add console log before sending response
    console.log('Sending formatted test:', formattedTest);

    res.json(formattedTest);
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({ 
      message: 'Error fetching test details',
      error: error.message 
    });
  }
});

// Add this new route to check if a test exists for a job
router.get('/check-test/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const existingTest = await Test.findOne({ jobId });
    
    if (existingTest) {
      res.json(existingTest);
    } else {
      res.status(404).json({ message: 'No test found for this job' });
    }
  } catch (error) {
    console.error('Error checking test:', error);
    res.status(500).json({ message: 'Error checking test', error: error.message });
  }
});

// ... existing code ...

// Get all tests created by an employer
router.get('/employer-tests/:employerId', async (req, res) => {
  try {
    const { employerId } = req.params;
    
    const tests = await Test.aggregate([
      {
        $match: { employerId: new mongoose.Types.ObjectId(employerId) }
      },
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'jobDetails'
        }
      },
      {
        $unwind: {
          path: '$jobDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          testName: 1,
          duration: 1,
          totalMarks: 1,
          passingMarks: 1,
          createdAt: 1,
          testStatus: 1,
          lastDate: 1,
          jobTitle: '$jobDetails.jobTitle',
          numberOfQuestions: { $size: '$questions' },
          difficultyLevel: 1
        }
      }
    ]);

    res.json(tests);
  } catch (error) {
    console.error('Error fetching employer tests:', error);
    res.status(500).json({ 
      message: 'Error fetching tests', 
      error: error.message 
    });
  }
});

// Delete a test
router.delete('/delete-test/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    await Test.findByIdAndDelete(testId);
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({ 
      message: 'Error deleting test', 
      error: error.message 
    });
  }
});

// ... rest of existing code ...
// ... existing code ...

// Route to update a test
router.put('/update-test/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    const { 
      testName, 
      duration, 
      totalMarks, 
      passingMarks, 
      numberOfQuestions, 
      difficultyLevel,
      questions,
      jobId,
      lastDate
    } = req.body;

    // Validate input
    if (!testName || !duration || !passingMarks || !totalMarks || !numberOfQuestions || !difficultyLevel || !lastDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate last date
    const testLastDate = new Date(lastDate);
    const today = new Date();
    if (testLastDate < today) {
      return res.status(400).json({ message: 'Last date cannot be in the past' });
    }

    // Find and update the test
    const updatedTest = await Test.findByIdAndUpdate(
      testId,
      {
        testName,
        duration,
        totalMarks,
        passingMarks,
        numberOfQuestions,
        difficultyLevel,
        questions: questions || [],
        jobId,
        lastDate: testLastDate,
        updatedAt: new Date()
      },
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Fetch associated job details for the response
    const job = await Job.findById(updatedTest.jobId);
    const testWithJobDetails = {
      ...updatedTest.toObject(),
      jobTitle: job ? job.jobTitle : null,
      companyName: job ? job.companyName : null
    };

    res.json({ 
      message: 'Test updated successfully', 
      test: testWithJobDetails 
    });
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({ 
      message: 'Error updating test', 
      error: error.message 
    });
  }
});

// ... rest of existing code ...

// Add this new route to get all test results for an employer
router.get('/employer-test-results/:employerId', async (req, res) => {
  try {
    const { employerId } = req.params;

    // Aggregate test results with job and candidate details
    const results = await TestResult.aggregate([
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'jobDetails'
        }
      },
      {
        $unwind: '$jobDetails'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'candidateDetails'
        }
      },
      {
        $unwind: '$candidateDetails'
      },
      {
        $match: {
          'jobDetails.userId': new mongoose.Types.ObjectId(employerId)
        }
      },
      {
        $project: {
          jobId: 1,
          jobTitle: '$jobDetails.jobTitle',
          candidateName: '$candidateDetails.name',
          score: 1,
          totalMarks: 1,
          result: 1,
          timeTaken: 1,
          submittedAt: 1
        }
      },
      {
        $sort: {
          jobId: 1,
          score: -1,
          timeTaken: 1
        }
      }
    ]);

    res.json(results);
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ 
      message: 'Error fetching test results', 
      error: error.message 
    });
  }
});

// Add this route to get test result for an application
router.get('/test-result/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const testResult = await TestResult.findOne({
      employeeId: application.userId,
      jobId: application.jobId
    });

    if (!testResult) {
      return res.status(404).json({ message: 'Test result not found' });
    }

    res.json({
      score: testResult.score,
      totalMarks: testResult.totalMarks,
      result: testResult.result,
      timeTaken: testResult.timeTaken,
      submittedAt: testResult.submittedAt
    });

  } catch (error) {
    console.error('Error fetching test result:', error);
    res.status(500).json({ 
      message: 'Error fetching test result',
      error: error.message 
    });
  }
});

// Add this route to get pending tests for an employee
router.get('/pending-tests/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Get all applications for this employee that require tests
    const applications = await Application.find({
      userId: employeeId,
      testStatus: 'Pending'
    }).populate('jobId');

    if (!applications.length) {
      return res.json([]);
    }

    // Get all tests for these applications
    const tests = await Test.find({
      jobId: { $in: applications.map(app => app.jobId._id) }
    });

    // Format test data with job details
    const formattedTests = tests.map(test => {
      const application = applications.find(
        app => app.jobId._id.toString() === test.jobId.toString()
      );
      
      return {
        _id: test._id,
        testName: test.testName,
        jobTitle: application?.jobId.jobTitle,
        companyName: application?.jobId.companyName,
        duration: test.duration,
        totalMarks: test.totalMarks,
        lastDate: test.lastDate,
        jobId: test.jobId
      };
    });

    res.json(formattedTests);
  } catch (error) {
    console.error('Error fetching pending tests:', error);
    res.status(500).json({ 
      message: 'Error fetching pending tests',
      error: error.message 
    });
  }
});

// Update the check-expired-tests route
router.put('/check-expired-tests', async (req, res) => {
  try {
    const currentDate = new Date();
    
    // Update test status to expired
    const result = await Test.updateMany(
      { 
        lastDate: { $lt: currentDate },
        testStatus: { $ne: 'Expired' }
      },
      { 
        $set: { testStatus: 'Expired' }
      }
    );

    // Also update related applications
    if (result.modifiedCount > 0) {
      await Application.updateMany(
        {
          testStatus: 'Pending',
          'test.lastDate': { $lt: currentDate }
        },
        {
          $set: { testStatus: 'Expired' }
        }
      );
    }

    res.json({
      message: 'Tests updated successfully',
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating expired tests:', error);
    res.status(500).json({ 
      message: 'Error updating expired tests', 
      error: error.message 
    });
  }
});

module.exports = router;
