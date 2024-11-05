// routes/jobs.js
const express = require('express');
const router = express.Router();
const Job = require('../model/job'); 
const Application = require('../model/applicationModel');

// POST route to create a new job post
router.post('/create', async (req, res) => {
  const {
    jobTitle,
    companyName,
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
    userId,
    logoUrl
  } = req.body;

  try {
    const newJob = new Job({
      jobTitle,
      companyName,
      location,
      salary,
      jobType,
      qualifications,
      skills,
      jobDescription,
      experience,
      contactDetails,
      lastDate,
      userId,
      vaccancy,
      logoUrl,
      approvalStatus: 'Pending',
      paymentStatus:'Pending'
      // response:'Pending'
    });
    

    // Save the new job to the database
    const savedJob = await newJob.save();
    res.status(201).json({ message: 'Job posted successfully!', job: savedJob });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ message: 'Failed to post job', error });
  }
});

router.get('/myjobs', async (req, res) => {
  const userId = req.query.userId; // Assuming you send the userId in query

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
  console.log("Employer ID from query:", employerId); // Additional logging

  try {
    const jobs = await Job.find({ approvalStatus: 'approved', userId: employerId });
    res.json(jobs);
  } catch (error) {
    console.error("Database query error:", error); // More detailed error logging
    res.status(500).json({ message: 'Failed to fetch approved jobs for the employer', error });
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
    // Fetch all jobs with 'approved' approval status and 'completed' payment status
    const jobs = await Job.find({
      approvalStatus: 'approved',
      paymentStatus: 'Completed'
    });
    res.json(jobs);
  } catch (error) {
    console.error("Database query error:", error); // More detailed error logging
    res.status(500).json({ message: 'Failed to fetch approved jobs with completed payments', error });
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
      approvalStatus: 'Pending'
    });

    // Save the application
    await application.save();

    res.status(201).json({ message: 'Successfully applied for the job!' });
  } catch (error) {
    res.status(500).json({ message: 'Error applying for job', error });
  }
});


router.get('/applications', async (req, res) => {
  const { userId, jobId, employerId } = req.query;

  try {
    // Define a filter object
    const filter = {};
    if (userId) filter.userId = userId;
    if (jobId) filter.jobId = jobId;
    if (employerId) filter.employerId = employerId; // Correctly filter by employerId

    // Fetch applications based on the filter
    const applications = await Application.find(filter);
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve applications' });
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

    res.status(200).json({ message: 'Application deleted successfully' });
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




module.exports = router;
