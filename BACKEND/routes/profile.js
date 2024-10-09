
// const express = require('express');
// const multer = require('multer');
// const Profile = require('../model/profile');
// const router = express.Router();

// // Multer config for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Fetch existing profile
// router.get('/', async (req, res) => {
//   try {
//     const profile = await Profile.findOne();
//     res.json(profile);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching profile', error });
//   }
// });

// // Create or update profile
// router.post('/create', upload.single('logo'), async (req, res) => {
//   try {
//     const logoUrl = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;
//     const profileData = { ...req.body, logoUrl };

//     const newProfile = new Profile(profileData);
//     await newProfile.save();
//     res.status(201).json(newProfile);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating profile', error });
//   }
// });

// router.post('/update', upload.single('logo'), async (req, res) => {
//   try {
//     const logoUrl = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;
//     const updatedData = { ...req.body, logoUrl };

//     const updatedProfile = await Profile.findOneAndUpdate({}, updatedData, { new: true });
//     res.json(updatedProfile);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating profile', error });
//   }
// });

// module.exports = router;

// const express = require('express');
// const multer = require('multer');
// const Profile = require('../model/profile');
// const router = express.Router();

// // Multer config for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Fetch profile by userId
// router.get('/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const profile = await Profile.findOne({ userId });
//     if (!profile) {
//       return res.status(404).json({ message: 'Profile not found' });
//     }
//     res.json(profile);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching profile', error });
//   }
// });

// // Create profile for a user
// router.post('/create', upload.single('logoUrl'), async (req, res) => {
//   try {
//     const { userId,cname, email, address, tagline, website } = req.body;
//     const logoUrl = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;

//     // Check if profile already exists for this userId
//     const existingProfile = await Profile.findOne({ userId });
//     if (existingProfile) {
//       return res.status(400).json({ message: 'Profile already exists for this user' });
//     }

//     const profileData = { userId,cname, email, address, tagline, website, logoUrl };
//     const newProfile = new Profile(profileData);
//     await newProfile.save();
//     res.status(201).json(newProfile);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating profile', error });
//   }
// });

// // Update profile by userId
// router.post('/update/:userId', upload.single('logoUrl'), async (req, res) => {
//   try {
//     const { userId,cname,email, address, tagline, website } = req.body;
//     const logoUrl = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;

//     // Prepare the fields for updating
//     const updatedData = { cname,email, address, tagline, website };
//     if (logoUrl) updatedData.logoUrl = logoUrl;

//     // Find and update the profile based on userId
//     const updatedProfile = await Profile.findOneAndUpdate(
//       { userId },
//       updatedData,
//       { new: true }
//     );

//     if (!updatedProfile) {
//       return res.status(404).json({ message: 'Profile not found' });
//     }

//     res.json(updatedProfile);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating profile', error });
//   }
// });

// module.exports = router;


// routes/profileRoute.js


// const express = require('express');
// const multer = require('multer');
// const Profile = require('../model/profile');
// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// const upload = multer({ storage });
// router.post('/create', upload.single('logoUrl'), async (req, res) => {
//   const { userId, cname, email, address, tagline, website } = req.body;
//   try {
//     const profile = new Profile({
//       userId,
//       cname,
//       email,
//       address,
//       tagline,
//       website,
//       logoUrl: req.file ? req.file.path : ''
//     });
//     await profile.save();
//     res.status(201).json({ message: 'Profile created successfully', profile });
//   } catch (error) {
//     console.error('Error creating profile:', error);
//     res.status(500).json({ error: 'Error creating profile' });
//   }
// });

// // Update Profile
// router.post('/update/:userId', upload.single('logoUrl'), async (req, res) => {
//   const { userId } = req.params;
//   const { cname, email, address, tagline, website } = req.body;
//   try {
//     const updateData = {
//       cname,
//       email,
//       address,
//       tagline,
//       website
//     };

//     // Include logo only if a new one was uploaded
//     if (req.file) {
//       updateData.logoUrl = req.file.path;
//     }

//     const updatedProfile = await Profile.findOneAndUpdate({ userId }, updateData, { new: true });
//     if (!updatedProfile) {
//       return res.status(404).json({ error: 'Profile not found' });
//     }
//     res.status(200).json({ message: 'Profile updated successfully', updatedProfile });
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     res.status(500).json({ error: 'Error updating profile' });
//   }
// });

// // Get Profile by User ID
// router.get('/:userId', async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const profile = await Profile.findOne({ userId });
//     if (!profile) {
//       return res.status(404).json({ error: 'Profile not found' });
//     }
//     res.status(200).json(profile);
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     res.status(500).json({ error: 'Error fetching profile' });
//   }
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const Profile = require('../model/profile');
const router = express.Router();
const path = require('path');

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

const upload = multer({ storage });

router.post('/create', upload.single('logoUrl'), async (req, res) => {
  const { userId, cname, email, address, tagline, website } = req.body;
  try {
    const profile = new Profile({
      userId,
      cname,
      email,
      address,
      tagline,
      website,
      logoUrl: req.file ? `uploads/${req.file.filename}` : ''
    });
    await profile.save();
    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Error creating profile' });
  }
});

// Update Profile
router.post('/update/:userId', upload.single('logoUrl'), async (req, res) => {
  const { userId } = req.params;
  const { cname, email, address, tagline, website } = req.body;
  try {
    const updateData = { cname, email, address, tagline, website };

    // Include logo only if a new one was uploaded
    if (req.file) {
      updateData.logoUrl = `uploads/${req.file.filename}`;
    }

    const updatedProfile = await Profile.findOneAndUpdate({ userId }, updateData, { new: true });
    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json({ message: 'Profile updated successfully', updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Get Profile by User ID
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

module.exports = router;

