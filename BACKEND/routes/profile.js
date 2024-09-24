
const express = require('express');
const multer = require('multer');
const Profile = require('../model/profile');
const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Fetch existing profile
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
});

// Create or update profile
router.post('/create', upload.single('logo'), async (req, res) => {
  try {
    const logoUrl = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;
    const profileData = { ...req.body, logoUrl };

    const newProfile = new Profile(profileData);
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error creating profile', error });
  }
});

router.post('/update', upload.single('logo'), async (req, res) => {
  try {
    const logoUrl = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;
    const updatedData = { ...req.body, logoUrl };

    const updatedProfile = await Profile.findOneAndUpdate({}, updatedData, { new: true });
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
});

module.exports = router;

