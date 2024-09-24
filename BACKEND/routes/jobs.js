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
    });
    

    // Save the new job to the database
    const savedJob = await newJob.save();
    res.status(201).json({ message: 'Job posted successfully!', job: savedJob });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ message: 'Failed to post job', error });
  }
});

module.exports = router;
