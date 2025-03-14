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
const EmployeeProfile = require('../model/EmployeeProfile');
const jobMatcher = require('../utils/jobMatcher');

// POST route to create a new job post
router.post('/create', async (req, res) => {
  try {
    const {
      jobTitle,
      location,
      salary,
      jobType,
      qualifications,
      skills,
      jobDescription,
      experience,
      contactDetails,
      lastDate,
      vaccancy,
      atsScoreRequirement,
      userId,
      companyName,
      logoUrl
    } = req.body;

    // Basic validation
    if (!jobTitle || !location || !jobType) {
      return res.status(400).json({ 
        message: 'Required fields are missing' 
      });
    }

    // Validate atsScoreRequirement
    const atsScore = parseInt(atsScoreRequirement);
    if (isNaN(atsScore) || atsScore < 10 || atsScore > 100) {
      return res.status(400).json({
        message: 'ATS Score must be a number between 10 and 100'
      });
    }

    // Create new job with validated data
    const newJob = new Job({
      jobTitle: jobTitle.trim(),
      location: location.trim(),
      salary,
      jobType,
      qualifications: Array.isArray(qualifications) ? qualifications : [],
      skills: Array.isArray(skills) ? skills : [],
      jobDescription,
      experience: {
        years: parseInt(experience.years) || 0,
        months: parseInt(experience.months) || 0
      },
      contactDetails,
      lastDate,
      vaccancy: parseInt(vaccancy),
      atsScoreRequirement: atsScore, // Use the validated score
      userId,
      companyName,
      logoUrl,
      approvalStatus: 'Pending',
      paymentStatus: 'Pending',
      status: 'active'
    });

    console.log('Creating job with ATS requirement:', req.body.atsScoreRequirement);

    const savedJob = await newJob.save();
    
    res.status(201).json({ 
      message: 'Job posted successfully!', 
      job: savedJob 
    });

  } catch (error) {
    console.error('Error posting job:', error);
    
    // Send more specific error messages
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to post job', 
      error: error.message 
    });
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
    const jobs = await Job.find({
      status: 'active',
      approvalStatus: 'approved',
      paymentStatus: 'Completed'
    });
    res.status(200).json(jobs);
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
    const {
      userId,
      employerId,
      jobId,
      name,
      email,
      experience,
      degree,
      jobTitle,
      resume,
      address,
      skills,
      jobPreferences,
      photo,
      dob,
      phone,
      companyName,
      atsScore
    } = req.body;

    // Check if already applied
    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job.' });
    }

    // Create new application
    const application = new Application({
      userId,
      jobId,
      employerId,
      name,
      email,
      experience: parseFloat(experience) || 0,
      degree: Array.isArray(degree) ? degree : [degree].filter(Boolean),
      jobTitle,
      resume,
      address,
      skills: Array.isArray(skills) ? skills : skills?.split(',').filter(Boolean) || [],
      jobPreferences: Array.isArray(jobPreferences) ? jobPreferences : jobPreferences?.split(',').filter(Boolean) || [],
      photo,
      dob: dob ? new Date(dob) : null,
      phone,
      companyName,
      approvalStatus: 'Pending',
      testStatus: 'Pending',
      appliedAt: new Date(),
      atsScore
    });

    await application.save();

    // Create notification for employer
    const notification = new Notification({
      userId: employerId,
      title: 'New Job Application',
      message: `New application received for ${jobTitle} from ${name}`,
      type: 'application',
      read: false
    });
    await notification.save();

    res.status(201).json({ 
      message: 'Successfully applied for the job!',
      application 
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ 
      message: 'Error applying for job', 
      error: error.message 
    });
  }
});

// Add check-application route
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

// Add route to get employee applications
router.get('/employee-applications', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const applications = await Application.find({ userId })
      .populate({
        path: 'jobId',
        select: 'jobTitle companyName location jobType skills qualifications experience lastDate contactDetails userId'
      })
      .sort({ appliedAt: -1 });

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
        testStatus: app.testStatus || 'Not Required',
        testScore: app.testScore,
        employerId: app.jobId.userId
      }));

    res.json(formattedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
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




// Route to check and update expired jobs
router.put("/check-expired-jobs", async (req, res) => {
  try {
    const today = new Date();
    
    // First check if there are any jobs that match the criteria
    const jobsToUpdate = await Job.find({ 
      expiryDate: { $lt: today }, 
      status: "active" 
    });
    
    if (jobsToUpdate.length === 0) {
      return res.status(200).json({ 
        message: "No expired jobs found to update.",
        updated: false,
        count: 0
      });
    }
    
    // Then update them
    const result = await Job.updateMany(
      { expiryDate: { $lt: today }, status: "active" },
      { $set: { status: "expired" } }
    );
    
    res.status(200).json({
      message: "Expired jobs updated successfully.",
      updated: true,
      count: result.modifiedCount
    });
  } catch (error) {
    console.error("Error checking expired jobs:", error);
    res.status(500).json({ message: "Error checking expired jobs", error: error.message });
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
    const { userId } = req.body;
    
    // Validate user exists and get profile
    const userProfile = await EmployeeProfile.findOne({ userId });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Get active jobs with all required fields
    const activeJobs = await Job.find({
      approvalStatus: 'approved',
      paymentStatus: 'Completed',
      status: 'active'
    }).select({
      _id: 1,
      jobTitle: 1,
      companyName: 1,
      location: 1,
      salary: 1,
      jobType: 1,
      skills: 1,
      experience: 1,
      jobDescription: 1,
      qualifications: 1,
      logoUrl: 1,
      lastDate: 1,
      contactDetails: 1,
      vaccancy: 1,
      atsScoreRequirement: 1
    });

    console.log('Found active jobs:', activeJobs.length);

    // Prepare data for matching
    const inputData = {
      resumeText: userProfile.resume || '',
      atsScore: userProfile.atsScore || 0,
      atsDetails: userProfile.atsDetails || {},
      skills: userProfile.skills || [],
      experience: {
        years: userProfile.experienceYears || 0,
        months: userProfile.experienceMonths || 0
      },
      jobPreferences: userProfile.jobPreferences || [],
      qualifications: userProfile.degree || [],
      jobs: activeJobs.map(job => ({
        id: job._id.toString(), // Ensure ID is included and converted to string
        title: job.jobTitle,
        description: job.jobDescription,
        companyName: job.companyName,
        location: job.location || 'N/A',
        salary: job.salary || 'N/A',
        jobType: job.jobType,
        requiredSkills: job.skills || [],
        requiredExperience: job.experience || { years: 0, months: 0 },
        qualifications: job.qualifications || [],
        logoUrl: job.logoUrl,
        lastDate: job.lastDate,
        contactDetails: job.contactDetails,
        vaccancy: job.vaccancy,
        minimumAtsScore: job.atsScoreRequirement || 0
      }))
    };

    console.log('Processing jobs with matcher...');
    const matches = await jobMatcher.matchJobs(inputData);
    console.log(`Returning ${matches.length} matches`);

    res.json(matches);
  } catch (error) {
    console.error('Error in job suggestions:', error);
    res.status(500).json({ 
      message: 'Error generating job suggestions',
      error: error.message 
    });
  }
});

// Add this route after your existing /apply route
router.post('/apply-suggestion', async (req, res) => {
  try {
    const {
      userId,
      jobId,
      jobTitle,
      companyName,
      employerId
    } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'This job is no longer available' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Fetch user profile data
    const userProfile = await EmployeeProfile.findOne({ userId: userId });
    if (!userProfile) {
      return res.status(400).json({ 
        message: 'Please complete your profile before applying' 
      });
    }

    // Calculate total experience
    const totalExperience = (userProfile.experienceYears || 0) + ((userProfile.experienceMonths || 0) / 12);

    // Create new application
    const application = new Application({
      userId,
      jobId,
      employerId: employerId || job.userId,
      name: userProfile.name,
      email: userProfile.email,
      experience: totalExperience,
      degree: Array.isArray(userProfile.degree) ? userProfile.degree : [userProfile.degree].filter(Boolean),
      jobTitle,
      resume: userProfile.resume,
      address: userProfile.address,
      skills: userProfile.skills || [],
      jobPreferences: userProfile.jobPreferences || [],
      photo: userProfile.photo,
      dob: userProfile.dob,
      phone: userProfile.phone,
      companyName,
      approvalStatus: 'Pending',
      testStatus: 'Pending',
      appliedAt: new Date()
    });

    await application.save();

    // Create notification for employer
    const notification = new Notification({
      userId: employerId || job.userId,
      title: 'New Job Application',
      message: `New application received for ${jobTitle} from ${userProfile.name}`,
      type: 'application',
      read: false
    });
    await notification.save();

    res.status(201).json({ 
      message: 'Successfully applied for the job!',
      application 
    });

  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ 
      message: 'Error applying for job', 
      error: error.message 
    });
  }
});


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

// Add this route to get pending jobs
router.get('/pending-jobs', async (req, res) => {
  try {
    const pendingJobs = await Job.find({
      approvalStatus: { $in: ['Pending', 'Rejected'] }
    }).sort({ datePosted: -1 });

    // Populate employer details if needed
    const populatedJobs = await Promise.all(pendingJobs.map(async (job) => {
      const employer = await Profile.findOne({ userId: job.userId });
      return {
        ...job.toObject(),
        companyName: employer?.cname || 'Unknown Company'
      };
    }));

    res.json(populatedJobs);
  } catch (error) {
    console.error('Error fetching pending jobs:', error);
    res.status(500).json({ 
      message: 'Error fetching pending jobs',
      error: error.message 
    });
  }
});

// Add this delete route
router.delete('/:id', async (req, res) => {
  try {
    const jobId = req.params.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        message: 'Job not found' 
      });
    }

    // Only allow deletion if job is not approved
    if (job.approvalStatus === 'approved') {
      return res.status(400).json({
        message: 'Cannot delete an approved job'
      });
    }

    // Delete the job
    await Job.findByIdAndDelete(jobId);

    // Delete any associated applications
    await Application.deleteMany({ jobId: jobId });

    res.status(200).json({ 
      message: 'Job deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ 
      message: 'Error deleting job', 
      error: error.message 
    });
  }
});

// Add job approval route
router.put('/approve/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const { approvalDate } = req.body;

    // Find and update the job
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ 
        message: 'Job not found' 
      });
    }

    // Update job status
    job.approvalStatus = 'approved';
    job.approvalDate = approvalDate || new Date();
    job.status = 'active';

    // Save the updated job
    const updatedJob = await job.save();

    // Create notification for employer
    const notification = new Notification({
      userId: job.userId,
      title: 'Job Approved',
      message: `Your job "${job.jobTitle}" has been approved.`,
      type: 'job',
      jobId: jobId
    });
    await notification.save();

    res.json({
      message: 'Job approved successfully',
      job: updatedJob
    });

  } catch (error) {
    console.error('Error approving job:', error);
    res.status(500).json({ 
      message: 'Error approving job', 
      error: error.message 
    });
  }
});

module.exports = router;
