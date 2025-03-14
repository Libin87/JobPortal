const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const upload = require('../middleware/upload');
const Profile = require('../model/profile');
const Job = require('../model/job');

// Route for getting job recommendations
router.post('/suggest-jobs', async (req, res) => {
  try {
    const { userId, skills, experience, jobPreferences, qualifications } = req.body;
    
    // Fetch user profile to get resume text and ATS score
    const userProfile = await Profile.findOne({ userId }).select({
      skills: 1,
      resume: 1,
      atsScore: 1,
      atsDetails: 1,
      experienceYears: 1,
      experienceMonths: 1,
      jobPreferences: 1,
      degree: 1
    });

    if (!userProfile) {
      return res.status(404).json({ 
        message: 'User profile not found'
      });
    }

    // Validate input data
    if (!userProfile.skills || userProfile.skills.length === 0) {
      return res.status(400).json({ 
        message: 'Please add skills to your profile to get job suggestions'
      });
    }

    // Get active jobs
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
      minimumAtsScore: 1 // Add this field if you have it in your Job model
    });

    if (!activeJobs.length) {
      return res.status(200).json({
        message: 'No active jobs available for matching',
        matches: []
      });
    }

    // Prepare data for Python script
    const inputData = {
      resumeText: userProfile.resume,
      atsScore: userProfile.atsScore,
      atsDetails: userProfile.atsDetails,
      skills: userProfile.skills,
      experience: {
        years: userProfile.experienceYears || 0,
        months: userProfile.experienceMonths || 0
      },
      jobPreferences: userProfile.jobPreferences,
      qualifications: userProfile.degree || [],
      jobs: activeJobs.map(job => ({
        id: job._id.toString(),
        title: job.jobTitle,
        description: job.jobDescription,
        companyName: job.companyName,
        location: job.location || 'N/A',
        salary: job.salary || 'N/A',
        jobType: job.jobType,
        requiredSkills: job.skills || [],
        experience: {
          years: job.experience?.years || 0,
          months: job.experience?.months || 0
        },
        requiredExperience: job.experience || { years: 0, months: 0 },
        qualifications: job.qualifications || [],
        logoUrl: job.logoUrl ? `uploads/${job.logoUrl}` : '',
        lastDate: job.lastDate,
        contactDetails: job.contactDetails,
        vaccancy: job.vaccancy,
        minimumAtsScore: job.minimumAtsScore || 0
      }))
    };

    // Call Python script for job matching
    const pythonProcess = spawn('python', [path.join(__dirname, '../job_matcher.py')]);
    let resultData = '';
    let errorData = '';

    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
        try {
            // Try to parse each chunk as JSON
            resultData += data.toString();
        } catch (e) {
            console.error('Error processing Python output:', e);
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        // Log debug messages to console
        console.log('Python debug:', data.toString());
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error('Python process error:', errorData);
            return res.status(500).json({
                message: 'Error in job matching process',
                error: errorData
            });
        }

        try {
            // Only try to parse the final result
            const matches = JSON.parse(resultData);
            console.log(`Returning ${matches.length} matches`);
            res.json(matches);
        } catch (error) {
            console.error('Error parsing matches:', error, 'Raw data:', resultData);
            res.status(500).json({
                message: 'Error parsing job matches',
                error: error.message
            });
        }
    });

  } catch (error) {
    console.error('Error in job matcher route:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
