// routes/siteReport.js
const express = require('express');
const router = express.Router();
const User = require('../model/userData');
const Job = require('../model/job'); // Assuming job status is stored here
// Import Application model if it's a separate model
// const Application = require('../model/application');

router.get('/siteReport', async (req, res) => {
  try {
    // Fetch the total number of users
    const totalUsers = await User.countDocuments();

    // Fetch the total number of jobs
    const totalJobs = await Job.countDocuments();

    // Fetch the number of active jobs
    const activeJobs = await Job.countDocuments({ status: 'active' });

    // Count applications by summing up the application count
    const applications = await Job.aggregate([
      {
        $group: {
          _id: null,
          totalApplications: { $sum: '$applications' } // replace 'applications' with the correct field name
        }
      }
    ]);

    // Respond with the aggregated data
    res.status(200).json({
      totalUsers,
      totalJobs,
      activeJobs,
      applications: applications[0]?.totalApplications || 0
    });
  } catch (error) {
    console.error('Error fetching site report data:', error);
    res.status(500).json({ message: 'Failed to load site report data' });
  }
});

module.exports = router;
