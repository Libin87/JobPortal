const express = require('express');
const multer = require('multer');
const Profile = require('../model/profile');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const Job = require('../model/job');
const Application = require('../model/applicationModel');

// Set static folder
router.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'logoUrl') {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Please upload an image file for logo'));
      }
    } else if (file.fieldname === 'documentUrl') {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Please upload a valid document file (PDF, DOC, DOCX)'));
      }
    }
    cb(null, true);
  }
});

// 1. First, place all specific routes
// Pending profiles route
router.get('/pending-profiles', async (req, res) => {
  try {
    const profiles = await Profile.find({
      verificationStatus: { $in: ['Pending', 'Rejected'] }
    }).select('cname email website documentUrl verificationStatus verificationMessage')
      .sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching pending profiles:', error);
    res.status(500).json({ error: 'Error fetching pending profiles' });
  }
});

// File serving route
router.get('/file/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, '..', 'uploads', filename));
});

// Company name route
router.get('/company/:userId', async (req, res) => {
  try {
    const company = await Profile.findOne({ userId: req.params.userId });
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json({ companyName: company.cname });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logo route
router.get('/logo/:userId', async (req, res) => {
  try {
    const company = await Profile.findOne({ userId: req.params.userId });
    if (!company || !company.logoUrl) return res.status(404).json({ error: 'Logo not found' });
    
    // Add caching headers
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.setHeader('Expires', new Date(Date.now() + 86400000).toUTCString());
    
    // Send the logo file
    res.sendFile(path.join(__dirname, '..', company.logoUrl));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify profile route
router.put('/verify/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update profile
      const updatedProfile = await Profile.findByIdAndUpdate(
        id,
        {
          $set: {
            verificationStatus: status,
            verificationMessage: message || ''
          }
        },
        { new: true, session }
      );

      if (!updatedProfile) {
        throw new Error('Profile not found');
      }

      // If the profile is suspended/rejected, update all associated jobs and applications
      if (status === 'suspended' || status === 'Rejected') {
        // Update all jobs by this employer
        await Job.updateMany(
          { userId: updatedProfile.userId },
          { 
            $set: { 
              status: 'suspended',
              verificationMessage: `Employer account ${status.toLowerCase()}`
            }
          },
          { session }
        );

        // Update all applications for jobs by this employer
        const employerJobs = await Job.find({ userId: updatedProfile.userId }, null, { session });
        if (employerJobs.length > 0) {
          const jobIds = employerJobs.map(job => job._id);
          await Application.updateMany(
            { jobId: { $in: jobIds } },
            { 
              $set: { 
                approvalStatus: 'suspended',
                statusMessage: `Job suspended due to employer account ${status.toLowerCase()}`
              }
            },
            { session }
          );
        }
      }

      // Commit the transaction
      await session.commitTransaction();

      res.json({
        message: `Profile ${status.toLowerCase()} successfully`,
        profile: updatedProfile
      });
    } catch (error) {
      // If there's an error, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error updating verification status:', error);
    res.status(500).json({ 
      message: 'Error updating verification status',
      error: error.message 
    });
  }
});

// Add this route to get all profiles
router.get('/all-profiles', async (req, res) => {
  try {
    const profiles = await Profile.find({}, 'userId verificationStatus');
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching all profiles:', error);
    res.status(500).json({ error: 'Error fetching profiles' });
  }
});

// Add this route to get pending verifications
router.get('/pending-verifications', async (req, res) => {
  try {
    // Count pending job approvals
    const pendingJobs = await Job.countDocuments({ approvalStatus: 'Pending' });
    
    // Count pending employer verifications
    const pendingEmployers = await Profile.countDocuments({ verificationStatus: 'Pending' });

    res.json({
      pendingJobs,
      pendingEmployers,
      total: pendingJobs + pendingEmployers
    });
  } catch (error) {
    console.error('Error fetching pending verifications:', error);
    res.status(500).json({ message: 'Error fetching pending verifications' });
  }
});

// 2. Then place the CRUD routes
// Create profile
router.post('/create', upload.fields([
  { name: 'logoUrl', maxCount: 1 },
  { name: 'documentUrl', maxCount: 1 }
]), async (req, res) => {
  try {
    const { userId, cname, email, address, tagline, website } = req.body;
    
    // Create profile object with verification status
    const profileData = {
      userId,
      cname,
      email,
      address,
      tagline,
      website,
      verificationStatus: 'Pending', // Set initial status
      logoUrl: req.files?.logoUrl ? `uploads/${req.files.logoUrl[0].filename}` : '',
      documentUrl: req.files?.documentUrl ? `uploads/${req.files.documentUrl[0].filename}` : ''
    };

    const profile = new Profile(profileData);
    const savedProfile = await profile.save();
    
    res.status(201).json({ 
      message: 'Profile created successfully', 
      profile: savedProfile 
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Error creating profile' });
  }
});

// Update profile
router.post('/update/:userId', upload.fields([
  { name: 'logoUrl', maxCount: 1 },
  { name: 'documentUrl', maxCount: 1 }
]), async (req, res) => {
  try {
    const { userId } = req.params;
    const { cname, email, address, tagline, website } = req.body;

    const updateData = { 
      cname, 
      email, 
      address, 
      tagline, 
      website 
    };

    if (req.files?.logoUrl) {
      updateData.logoUrl = `uploads/${req.files.logoUrl[0].filename}`;
    }

    if (req.files?.documentUrl) {
      updateData.documentUrl = `uploads/${req.files.documentUrl[0].filename}`;
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId }, 
      updateData, 
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({ 
      message: 'Profile updated successfully', 
      updatedProfile 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// 3. Finally, place the generic route
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Add this route for deleting profiles
router.delete('/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const deletedProfile = await Profile.findByIdAndDelete(profileId);
    
    if (!deletedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Error deleting profile' });
  }
});

// Add this route to update employer profile status
router.put('/employer-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, message } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          verificationStatus: status,
          verificationMessage: message
        }
      },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      message: 'Profile status updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile status:', error);
    res.status(500).json({ 
      message: 'Error updating profile status',
      error: error.message 
    });
  }
});

module.exports = router;

