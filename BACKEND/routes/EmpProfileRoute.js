// routes/profileRoute.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const EmployeeProfile = require('../model/EmployeeProfile');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // File name format
  },
});

const upload = multer({ storage: storage });

// // POST route for creating an employee profile
// router.post('/create', upload.fields([{ name: 'photo' }, { name: 'resume' }]), async (req, res) => {
//   try {
//     const { name, email, phone, address, degree, experience, skills, dob, jobPreferences } = req.body;
    
//     // If files (photo and resume) are uploaded
//     const photo = req.files.photo ? req.files.photo[0].path : null;
//     const resume = req.files.resume ? req.files.resume[0].path : null;

//     // Create a new employee profile
//     const newProfile = new EmployeeProfile({
//       name,
//       email,
//       phone,
//       address,
//       degree,
//       experience,
//       skills: skills.split(','), // Convert comma-separated string to array
//       dob,
//       jobPreferences: jobPreferences.split(','), // Convert comma-separated string to array
//       photo,
//       resume,
//     });

//     // Save the profile in the database
//     const profile = await newProfile.save();

//     res.status(201).json({
//       message: 'Profile created successfully',
//       profile,
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: error.message,
//     });
//   }
// });

// module.exports = router;


router.post('/create', upload.fields([{ name: 'photo' }, { name: 'resume' }]), async (req, res) => {
  try {
    console.log(req.files); // Log the uploaded files to check if both are received

    const { name, email, phone, address, degree, experience, skills, dob, jobPreferences,userId } = req.body;
    
    // If files (photo and resume) are uploaded
    const photo = req.files.photo ? req.files.photo[0].path : null;
    const resume = req.files.resume ? req.files.resume[0].path : null;

    // Create a new employee profile
    const newProfile = new EmployeeProfile({
      name,
      email,
      phone,
      address,
      degree,
      experience,
      skills: skills.split(','), // Convert comma-separated string to array
      dob,
      jobPreferences: jobPreferences.split(','), // Convert comma-separated string to array
      photo,
      resume,
      userId
    });

    // Save the profile in the database
    const profile = await newProfile.save();

    res.status(201).json({
      message: 'Profile created successfully',
      profile,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

// Route to fetch employee profile by userId
router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = await EmployeeProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Include the resume field in the response
    const profileData = {
      ...profile.toObject(),
      resume: profile.resume // Make sure resume is included
    };
    
    res.status(200).json(profileData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error });
  }
});


// router.put('/update/:userId', upload.fields([{ name: 'photo' }, { name: 'resume' }]), async (req, res) => {
//   const { userId } = req.params;

//   console.log('Incoming data:', req.body); // Debugging

//   // Prepare the update data
//   const updateData = {
//     name: req.body.name,
//     email: req.body.email,
//     phone: req.body.phone,
//     address: req.body.address,
//     degree: req.body.degree,
//     experience: req.body.experience,
//     dob: req.body.dob,
//     userId: userId,
//     skills: req.body.skills ? req.body.skills.split(',') : [], // Convert if exists
//     jobPreferences: req.body.jobPreferences ? req.body.jobPreferences.split(',') : [],
//   };

//   // Update photo and resume if they are included in the request
//   if (req.files) {
//     if (req.files.photo) {
//       updateData.photo = req.files.photo[0].path; // Update with the new photo path
//     }
//     if (req.files.resume) {
//       updateData.resume = req.files.resume[0].path; // Update with the new resume path
//     }
//   }

//   try {
//     const updatedProfile = await EmployeeProfile.findOneAndUpdate(
//       { userId },
//       updateData, // Use the prepared update data
//       { new: true } // Returns the updated document
//     );

//     if (!updatedProfile) {
//       return res.status(404).json({ message: 'Profile not found' });
//     }
//     res.status(200).json({ message: 'Profile updated successfully', updatedProfile });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating profile', error });
//   }
// });


router.put('/update/:userId', upload.fields([{ name: 'photo' }, { name: 'resume' }]), async (req, res) => {
  const { userId } = req.params;

  console.log('Incoming data:', req.body); // Debugging

  // Prepare the update data
  const updateData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    degree: req.body.degree,
    experience: req.body.experience,
    dob: req.body.dob,
    userId: userId,
    skills: req.body.skills ? req.body.skills.split(',') : [], // Convert if exists
    jobPreferences: req.body.jobPreferences ? req.body.jobPreferences.split(',') : [],
  };

  // Update photo and resume if they are included in the request
  if (req.files) {
    if (req.files.photo) {
      updateData.photo = req.files.photo[0].path; // Update with the new photo path
    }
    if (req.files.resume) {
      updateData.resume = req.files.resume[0].path; // Update with the new resume path
    }
  }

  try {
    const updatedProfile = await EmployeeProfile.findOneAndUpdate(
      { userId },
      updateData, // Use the prepared update data
      { new: true } // Returns the updated document
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json({ message: 'Profile updated successfully', updatedProfile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
});



module.exports = router;
