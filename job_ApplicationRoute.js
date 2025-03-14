// routes/jobs.js
const express = require('express');
const router = express.Router();
const Job = require('../model/job'); 
const Application = require('../model/applicationModel');

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
  const jobId = req.params.id;
  const jobData = req.body; // Get job data from the request body

  try {
    const updatedJob = await Job.findByIdAndUpdate(jobId, jobData, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error });
  }
});

// Delete a job by ID
router.delete('/:id', async (req, res) => {
  const jobId = req.params.id;

  try {
    const deletedJob = await Job.findByIdAndDelete(jobId);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error });
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
router.get('/Pending', async (req, res) => {
  try {
    const jobs = await Job.find({ approvalStatus: 'Pending' });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Pending jobs' });
  }
});
router.delete('/reject/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const deletedJob = await Job.findByIdAndDelete(jobId);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job rejected successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject job', error });
  }
});

router.put('/approve/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const { approvalDate } = req.body; // Extract the approval date from the request body

    const approvedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        approvalStatus: 'approved',
        approvedBy: req.body.adminId,
        approvalDate, // Save the approval date
      },
      { new: true }
    );

    if (!approvedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job approved successfully!', job: approvedJob });
  } catch (error) {
    console.error('Error approving job:', error);
    res.status(500).json({ message: 'Failed to approve job', error });
  }
});


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

// router.get('/approvedHome', async (req, res) => {
//   try {
//     // Fetch all jobs with an 'approved' approval status
//     const jobs = await Job.find({ approvalStatus: 'approved' });
//     res.json(jobs);
//   } catch (error) {
//     console.error("Database query error:", error); // More detailed error logging
//     res.status(500).json({ message: 'Failed to fetch approved jobs', error });
//   }
// });
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
    } = req.body;

    // Check if the user has already applied for the job
    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      console.log('Existing application:', existingApplication);
      return res.status(400).json({ message: 'You have already applied for this job.' });
    }

    // Create new application with all fields from the schema
    const application = new Application({
      userId,
      jobId,
      employerId,
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
      approvalStatus: 'Pending',
      testStatus: 'Pending'
    });

    // Save the application
    await application.save();

    res.status(201).json({ message: 'Successfully applied for the job!' });
  } catch (error) {
    res.status(500).json({ message: 'Error applying for job', error });
  }
});


// router.get('/applications', async (req, res) => {
//   const { userId, jobId, employerId, testStatus } = req.query;

//   try {
//     const filter = {};
//     if (userId) filter.userId = userId;
//     if (jobId) filter.jobId = jobId;
//     if (employerId) filter.employerId = employerId; // Correctly filter by employerId
//     if (testStatus) filter.testStatus = testStatus;
//     // Fetch applications based on the filter
//     const applications = await Application.find(filter);
//     res.status(200).json(applications);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to retrieve applications' });
//   }
// });

router.get('/applications', async (req, res) => {
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


module.exports = router;
