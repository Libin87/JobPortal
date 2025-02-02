const express = require('express');
const router = express.Router();
const User = require('../model/userData');
const Job = require('../model/job');
const Application = require('../model/applicationModel');
const { Test } = require('../model/testModel');

// Route to get site report with additional application details
router.get('/siteReport', async (req, res) => {
  try {
    // Fetch the total number of users
    const totalUsers = await User.countDocuments();

    // Fetch the count for each user type (assuming a 'role' field exists)
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const totalEmployers = await User.countDocuments({ role: 'employer' });

    // Fetch the total number of jobs and active jobs
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });

    // Fetch total number of tests
    const totalTests = await Test.countDocuments();

    // Aggregate applications data by approval status
    const applicationsReport = await Application.aggregate([
      {
        $group: {
          _id: "$approvalStatus",  // Group by approval status
          count: { $sum: 1 }  // Count applications for each approval status
        }
      }
    ]);

    // Convert applications report to the desired format
    const applicationsByApprovalStatus = applicationsReport.map(item => ({
      status: item._id,
      count: item.count,
    }));

    // Get total applications count
    const totalApplications = applicationsReport.reduce((sum, item) => sum + item.count, 0);

    // Aggregate applications data by employer
    const applicationsByEmployer = await Application.aggregate([
      {
        $group: {
          _id: "$employerId",  // Group by employer ID
          count: { $sum: 1 }  // Count applications for each employer
        }
      }
    ]);

    // Respond with all the collected data
    res.status(200).json({
      totalUsers,
      totalJobs,
      activeJobs,
      applications: totalApplications,
      totalApplications,
      totalTests,
      applicationsByApprovalStatus,
      applicationsByEmployer,
      totalEmployees,
      totalEmployers
    });
  } catch (error) {
    console.error('Error fetching site report data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
