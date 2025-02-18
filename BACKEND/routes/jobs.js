// routes/jobs.js
const express = require('express');
const router = express.Router();
const Job = require('../model/job'); 
const Application = require('../model/applicationModel');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const Profile = require('../model/profile');
const mongoose = require('mongoose');
const Notification = require('../model/notification');

// POST route to create a new job post
router.post('/create', async (req, res) => {
  try {
    const newJob = new Job({
      ...req.body,
      approvalStatus: 'Pending',
      paymentStatus: 'Pending',
      status: 'active' // Add default status when creating job
    });

    const savedJob = await newJob.save();
    res.status(201).json({ message: 'Job posted successfully!', job: savedJob });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ message: 'Failed to post job', error });
  }
});

router.get('/myjobs', async (req, res) => {
  const userId = req.query.userId;
  //const userId = req.params.userId; // Assuming you send the userId in query

  try {
    // Find jobs posted by this employer
    const jobs = await Job.find({ userId: userId });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});



// Update a job by ID
router.put('/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const updateData = req.body;

    // Ensure skills and qualifications are arrays
    if (updateData.skills) {
      updateData.skills = Array.isArray(updateData.skills) 
        ? updateData.skills 
        : updateData.skills.split(',').map(skill => skill.trim());
    }
    
    if (updateData.qualifications) {
      updateData.qualifications = Array.isArray(updateData.qualifications)
        ? updateData.qualifications
        : updateData.qualifications.split(',').map(qual => qual.trim());
    }

    // Remove any empty strings from arrays
    if (Array.isArray(updateData.skills)) {
      updateData.skills = updateData.skills.filter(skill => skill && skill.trim() !== '');
    }
    if (Array.isArray(updateData.qualifications)) {
      updateData.qualifications = updateData.qualifications.filter(qual => qual && qual.trim() !== '');
    }

    console.log('Updating job with data:', updateData); // Debug log

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ 
      message: 'Error updating job', 
      error: error.message,
      details: error.stack 
    });
  }
});

// Replace the delete route with suspend route
router.put('/suspend/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Create notification for employer
    const notification = new Notification({
      userId: job.userId,
      title: 'Job Suspended',
      message: `Your job "${job.jobTitle}" has been suspended. Reason: ${reason}`,
      type: 'job',
      actionLink: '/contact-admin', // Link to contact admin page
      jobId: jobId
    });
    await notification.save();

    // Update job status
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        $set: {
          status: 'suspended',
          suspensionReason: reason,
          suspendedAt: new Date(),
          suspendedBy: 'admin'
        }
      },
      { new: true }
    );

    // Update related applications
    await Application.updateMany(
      { jobId: jobId },
      { 
        $set: { 
          approvalStatus: 'suspended',
          statusMessage: 'Job has been suspended by admin'
        }
      }
    );

    res.json({ 
      message: 'Job suspended successfully',
      job: updatedJob 
    });
  } catch (error) {
    console.error('Error suspending job:', error);
    res.status(500).json({ message: 'Error suspending job', error: error.message });
  }
});

// Update the reactivate route to include notification
router.put('/reactivate/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update job status
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        {
          $set: {
            status: 'active',
            suspensionReason: null,
            suspendedAt: null,
            suspendedBy: null
          }
        },
        { new: true, session }
      );

      if (!updatedJob) {
        await session.abortTransaction();
        return res.status(404).json({ message: 'Job not found' });
      }

      // Create notification for employer
      const notification = new Notification({
        userId: updatedJob.userId,
        title: 'Job Reactivated',
        message: `Your job "${updatedJob.jobTitle}" has been reactivated by admin.`,
        type: 'job',
        jobId: updatedJob._id,
        isAdminNotification: true
      });

      await notification.save({ session });

      // Update related applications
      await Application.updateMany(
        { jobId: jobId },
        { 
          $set: { 
            approvalStatus: 'pending',
            statusMessage: 'Job has been reactivated'
          }
        },
        { session }
      );

      await session.commitTransaction();

      res.json({ 
        message: 'Job reactivated successfully',
        job: updatedJob 
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error reactivating job:', error);
    res.status(500).json({ message: 'Error reactivating job', error: error.message });
  }
});

router.get('/viewjob', async (req, res) => {
  try {
    const jobs = await Job.find(); // Fetch all jobs from the database
    res.status(200).json(jobs); // Send the jobs as a JSON response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// router.get('/Pending', async (req, res) => {
//   try {
//     const jobs = await Job.find({ approvalStatus: 'Pending' });
//     res.json(jobs);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch Pending jobs' });
//   }
// });
router.get('/approved', async (req, res) => {
  const { employerId } = req.query;
  try {
    // Update expired jobs first
    const currentDate = new Date();
    await Job.updateMany(
      { 
        lastDate: { $lt: currentDate }, 
        status: 'active'
      },
      { 
        $set: { status: 'Expired' } 
      }
    );

    // Then fetch the employer's jobs
    const jobs = await Job.find({ 
      approvalStatus: 'approved', 
      userId: employerId 
    });
    res.json(jobs);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: 'Failed to fetch jobs', error });
  }
});


router.get('/approvedHome', async (req, res) => {
  try {
    // First update any expired jobs
    const currentDate = new Date();
    await Job.updateMany(
      { 
        lastDate: { $lt: currentDate }, 
        status: 'active'
      },
      { 
        $set: { status: 'Expired' } 
      }
    );

    // Then fetch active jobs
    const jobs = await Job.find({
      approvalStatus: 'approved',
      paymentStatus: 'Completed',
      status: 'active'
    });
    res.json(jobs);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: 'Failed to fetch jobs', error });
  }
});





router.post('/apply', async (req, res) => {
  try {
    const { userId, jobId, jobTitle, companyName } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create new application with test status always set to Pending
    const newApplication = new Application({
      userId,
      jobId,
      jobTitle,
      companyName,
      approvalStatus: 'Pending',
      testStatus: 'Pending' // Always set to Pending
    });

    await newApplication.save();
    res.status(201).json({ 
      message: 'Application submitted successfully',
      testRequired: job.hasTest
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ 
      message: 'Error submitting application',
      error: error.message 
    });
  }
});



router.get('/applications', async (req, res) => {
  try {
    const { employerId } = req.query;
    
    if (!employerId) {
      return res.status(400).json({ error: 'Employer ID is required' });
    }

    // Find all applications where employerId matches
    const applications = await Application.find({ employerId })
      .populate('jobId') // Populate job details if needed
      .sort({ createdAt: -1 }); // Sort by newest first

    console.log('Found applications:', applications.length); // Debug log
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ 
      message: 'Error fetching applications', 
      error: error.message 
    });
  }
});

// DELETE route for deleting an application by applicationId
router.delete('/deletApplication/:applicationId', async (req, res) => {
  const { applicationId } = req.params;

  try {
    // Attempt to delete the application with the specified ID
    const deletedApplication = await Application.findByIdAndDelete(applicationId);

    // Check if the application was found and deleted
    if (!deletedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({ message: 'Application canceled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// PUT route for updating an application by applicationId
router.put('/updateApplications/:applicationId', async (req, res) => {
  const { applicationId } = req.params;
  const updateData = req.body; // The updated data will come from the request body

  try {
    // Update the application with the specified ID
    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true, runValidators: true } // Options to return the updated document and enforce validation
    );

    // Check if the application was found and updated
    if (!updatedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application' });
  }
});


router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const searchRegex = new RegExp(query, 'i');

    // Update expired jobs first
    const currentDate = new Date();
    await Job.updateMany(
      { 
        lastDate: { $lt: currentDate }, 
        status: 'active'
      },
      { 
        $set: { status: 'Expired' } 
      }
    );

    const jobs = await Job.find({
      $and: [
        { 
          paymentStatus: 'Completed', 
          approvalStatus: 'approved',
          status: 'active'
        },
        {
          $or: [
            { jobTitle: searchRegex },
            { companyName: searchRegex },
            { location: searchRegex },
            { skills: searchRegex }
          ]
        }
      ]
    });

    res.json(jobs);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: 'Failed to search jobs', error });
  }
});

// Add this new route for filtering
router.get('/filter', async (req, res) => {
  try {
    const { jobType, location, experience, salary } = req.query;
    
    // Update expired jobs first
    const currentDate = new Date();
    await Job.updateMany(
      { 
        lastDate: { $lt: currentDate }, 
        status: 'active'
      },
      { 
        $set: { status: 'Expired' } 
      }
    );

    let query = {
      approvalStatus: 'approved',
      paymentStatus: 'Completed',
      status: 'active'
    };

    if (jobType) query.jobType = jobType;
    if (location) query.location = { $regex: location, $options: 'i' };
    
    if (experience) {
      if (experience === '0') {
        query.experience = { $lte: 1 };
      } else if (experience === '1-2') {
        query.experience = { $gt: 0, $lte: 2 };
      } else if (experience === '3-5') {
        query.experience = { $gt: 2, $lte: 5 };
      } else if (experience === '5+') {
        query.experience = { $gt: 5 };
      }
    }

    if (salary) {
      const [min, max] = salary.split('-').map(Number);
      if (max) {
        query.salary = { $gte: min, $lte: max };
      } else {
        query.salary = { $gte: min };
      }
    }

    const jobs = await Job.find(query);
    res.json(jobs);
  } catch (error) {
    console.error('Filter error:', error);
    res.status(500).json({ message: 'Error filtering jobs' });
  }
});

// Add this route to get unique locations
router.get('/locations', async (req, res) => {
  try {
    const locations = await Job.distinct('location', {
      approvalStatus: 'approved',
      paymentStatus: 'Completed'
    });
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Error fetching locations' });
  }
});

// Add this route to get unique job types
router.get('/jobtypes', async (req, res) => {
  try {
    const jobTypes = await Job.distinct('jobType', {
      approvalStatus: 'approved',
      paymentStatus: 'Completed'
    });
    res.json(jobTypes);
  } catch (error) {
    console.error('Error fetching job types:', error);
    res.status(500).json({ message: 'Error fetching job types' });
  }
});
router.put('/checkExpired', async (req, res) => {
  try {
    const currentDate = new Date();
    console.log('Checking for expired jobs at:', currentDate);

    const result = await Job.updateMany(
      { 
        lastDate: { $lt: currentDate }, 
        status: 'active'
      },
      { 
        $set: { status: 'Expired' } 
      }
    );

    console.log('Update result:', result);
    res.status(200).json({
      message: 'Job statuses updated successfully',
      updatedJobs: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error updating expired jobs:', error);
    res.status(500).json({ message: 'Error updating job statuses', error });
  }
});


router.get('/myjobs1', async (req, res) => {
  const userId = req.query.userId;

  try {
    // Find jobs posted by this employer that meet the given conditions
    const jobs = await Job.find({
      userId: userId,
      approvalStatus: 'approved',
      paymentStatus: 'Completed',
      status: 'active',
    });
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err); // Debugging log
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Update the suggest-jobs route
router.post('/suggest-jobs', async (req, res) => {
  try {
    const { resumeText, skills, experience, jobPreferences } = req.body;
    console.log('Received data:', { skills, experience, jobPreferences });

    const activeJobs = await Job.find({
      approvalStatus: 'approved',
      paymentStatus: 'Completed',
      status: 'active',
      lastDate: { $gte: new Date() }
    });

    const scoredJobs = activeJobs.map(job => {
      let score = 0;
      let matchedSkills = [];
      let matchReasons = [];

      // Skills matching (40% weight)
      const jobSkills = job.skills.map(s => s.toLowerCase());
      if (Array.isArray(skills)) {
        const skillMatches = skills.filter(skill => 
          jobSkills.includes(skill.toLowerCase())
        );
        const skillScore = (skillMatches.length / jobSkills.length) * 40;
        score += skillScore;
        matchedSkills = skillMatches;
        if (skillMatches.length > 0) {
          matchReasons.push(`Matches ${skillMatches.length} required skills`);
        }
      }

      // Experience matching (30% weight)
      if (experience && job.experience) {
        const userExp = parseInt(experience);
        const jobExp = job.experience.years + (job.experience.months / 12);
        const expDiff = Math.abs(jobExp - userExp);
        
        if (expDiff <= 1) {
          score += 30;
          matchReasons.push('Experience level is an excellent match');
        } else if (expDiff <= 2) {
          score += 20;
          matchReasons.push('Experience level is a good match');
        } else if (expDiff <= 3) {
          score += 10;
          matchReasons.push('Experience level is acceptable');
        }
      }

      // Job title/role matching (30% weight)
      if (Array.isArray(jobPreferences)) {
        jobPreferences.forEach(pref => {
          const prefLower = pref.toLowerCase();
          const titleLower = job.jobTitle.toLowerCase();
          if (titleLower.includes(prefLower) || prefLower.includes(titleLower)) {
            score += 30;
            matchReasons.push(`Matches your preferred role: ${pref}`);
          }
        });
      }

      // Location and salary consideration
      if (job.location && resumeText.toLowerCase().includes(job.location.toLowerCase())) {
        score += 10;
        matchReasons.push('Location matches your preference');
      }

      return {
        ...job.toObject(),
        matchScore: Math.min(Math.round(score), 100),
        matchedSkills: matchedSkills.map(s => s.toLowerCase()),
        matchReasons,
        skills: job.skills || []
      };
    });

    // Filter and sort results
    const suggestedJobs = scoredJobs
      .filter(item => item.matchScore > 20) // Lower threshold to show more matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 15); // Show more job matches

    console.log(`Found ${suggestedJobs.length} matching jobs`);
    res.json(suggestedJobs);
  } catch (error) {
    console.error('Error suggesting jobs:', error);
    res.status(500).json({ message: 'Error suggesting jobs', error: error.message });
  }
});


router.get('/applications1', async (req, res) => {
  try {
    const { userId, testStatus } = req.query;
    
    // Build query object
    const query = { userId: userId };
    if (testStatus) {
      query.testStatus = testStatus;
    }

    console.log('Fetching applications with query:', query); // Debug log

    const applications = await Application.find(query)
      .populate('jobId')
      .sort({ createdAt: -1 });

    console.log('Found applications:', applications.length); // Debug log
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// Route for employee's job applications
router.get('/employee-applications', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find all applications for this employee
    const applications = await Application.find({ userId })
      .populate({
        path: 'jobId',
        select: 'jobTitle companyName location jobType skills qualifications experience lastDate contactDetails userId'
      })
      .sort({ appliedAt: -1 });

    // Filter out applications where jobId is null and format the response
    const formattedApplications = applications
      .filter(app => app.jobId != null)
      .map(app => ({
        _id: app._id,
        jobId: app.jobId._id,
        jobTitle: app.jobId.jobTitle,
        companyName: app.jobId.companyName,
        location: app.jobId.location,
        jobType: app.jobId.jobType,
        skills: app.jobId.skills,
        qualifications: app.jobId.qualifications,
        experience: app.jobId.experience,
        lastDate: app.jobId.lastDate,
        contactDetails: app.jobId.contactDetails,
        appliedAt: app.appliedAt,
        approvalStatus: app.approvalStatus,
        testStatus: app.testStatus || 'Not Required', // Include test status
        testScore: app.testScore,
        employerId: app.jobId.userId
      }));

    console.log('Found applications:', formattedApplications.length);
    res.json(formattedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// Update the existing pending jobs route
router.get('/pending-jobs', async (req, res) => {
  try {
    const pendingJobs = await Job.find({
      approvalStatus: { $in: ['Pending', 'Rejected'] }
    }).sort({ datePosted: -1 });
    
    res.json(pendingJobs);
  } catch (error) {
    console.error('Error fetching pending jobs:', error);
    res.status(500).json({ message: 'Error fetching pending jobs' });
  }
});

// Update the approve route
router.put('/approve/:id', async (req, res) => {
  try {
    const { approvalDate } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { 
        approvalStatus: 'approved',
        approvalDate: approvalDate,
        verificationMessage: '' // Clear any rejection message
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ 
      message: 'Job approved successfully!', 
      job: updatedJob 
    });
  } catch (error) {
    console.error('Error approving job:', error);
    res.status(500).json({ message: 'Failed to approve job', error });
  }
});

// Update the reject route
router.put('/reject/:id', async (req, res) => {
  try {
    const { message } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { 
        approvalStatus: 'Rejected',
        verificationMessage: message 
      },
      { new: true }
    );
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job rejected successfully!', job: updatedJob });
  } catch (error) {
    console.error('Error rejecting job:', error);
    res.status(500).json({ message: 'Failed to reject job', error });
  }
});

// Add this middleware to check employer status
const checkEmployerStatus = async (req, res, next) => {
  try {
    const userId = req.body.userId || req.query.userId;
    const profile = await Profile.findOne({ userId });
    
    if (!profile || profile.verificationStatus === 'Rejected') {
      return res.status(403).json({ 
        message: 'Employer account is suspended or not verified' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking employer status' });
  }
};

// Add the middleware to relevant routes
router.post('/create', checkEmployerStatus, async (req, res) => {
  // Existing create job logic
});

// Add this route to update all jobs when employer is suspended
router.put('/employer-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, message } = req.body;

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update all jobs by this employer
      await Job.updateMany(
        { userId: userId },
        { 
          $set: { 
            status: status,
            verificationMessage: message
          }
        },
        { session }
      );

      // Update all applications for jobs by this employer
      const employerJobs = await Job.find({ userId: userId }, null, { session });
      if (employerJobs.length > 0) {
        const jobIds = employerJobs.map(job => job._id);
        await Application.updateMany(
          { jobId: { $in: jobIds } },
          { 
            $set: { 
              approvalStatus: status,
              statusMessage: 'Job suspended due to employer account suspension'
            }
          },
          { session }
        );
      }

      await session.commitTransaction();
      res.json({ message: 'Employer jobs and applications updated successfully' });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error updating employer jobs:', error);
    res.status(500).json({ 
      message: 'Error updating employer jobs and applications',
      error: error.message 
    });
  }
});

// Add this model if not already present
const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'jobs',
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Test Required'],
    default: 'Pending'
  }
});

// Add this route for cancelling applications
router.delete('/cancel-application/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const application = await Application.findOne({ _id: id, userId });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.approvalStatus !== 'Pending') {
      return res.status(400).json({ 
        message: 'Cannot cancel application that has been processed' 
      });
    }

    await Application.findByIdAndDelete(id);
    
    res.json({ message: 'Application cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling application:', error);
    res.status(500).json({ 
      message: 'Error cancelling application',
      error: error.message 
    });
  }
});

// Add this route to check if user has already applied
router.get('/check-application', async (req, res) => {
  try {
    const { userId, jobId } = req.query;
    const existingApplication = await Application.findOne({ userId, jobId });
    res.json({ hasApplied: !!existingApplication });
  } catch (error) {
    console.error('Error checking application:', error);
    res.status(500).json({ message: 'Error checking application status' });
  }
});

// Add this route for applying to suggested jobs
router.post('/apply-suggestion', async (req, res) => {
  try {
    const { userId, jobId, jobTitle, companyName } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ message: 'This job is no longer accepting applications' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Check application deadline
    if (new Date(job.lastDate) < new Date()) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    // Create new application
    const newApplication = new Application({
      userId,
      jobId,
      jobTitle,
      companyName,
      employerId: job.userId,
      approvalStatus: 'Pending',
      testStatus: 'Pending'
    });

    await newApplication.save();

    res.status(201).json({ 
      message: 'Application submitted successfully',
      application: newApplication
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ 
      message: 'Error submitting application',
      error: error.message 
    });
  }
});

module.exports = router;
