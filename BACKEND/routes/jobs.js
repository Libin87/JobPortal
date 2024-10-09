// routes/jobs.js
const express = require('express');
const router = express.Router();
const Job = require('../model/job'); // Import Job model

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
    userId,
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
      approvalStatus: 'pending'
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
router.get('/pending', async (req, res) => {
  try {
    const jobs = await Job.find({ approvalStatus: 'pending' });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending jobs' });
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
    const approvedJob = await Job.findByIdAndUpdate(
      jobId,
      { approvalStatus: 'approved', approvedBy: req.body.adminId },
      { new: true }
    );
    if (!approvedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job approved successfully!', job: approvedJob });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve job', error });
  }
});
router.get('/approved', async (req, res) => {
  try {
    const jobs = await Job.find({ approvalStatus: 'approved' });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch approved jobs', error });
  }
});



module.exports = router;
