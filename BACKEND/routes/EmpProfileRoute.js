// routes/profileRoute.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const EmployeeProfile = require('../model/EmployeeProfile');
const pdfParse = require('pdf-parse');
const fs = require('fs');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // File name format
  },
});

// Add file validation middleware
const fileFilter = (req, file, cb) => {
  // Allow only specific file types
  if (file.fieldname === 'photo') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
  } else if (file.fieldname === 'resume') {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
    }
  } else {
    cb(null, false);
  }
};

// Update multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Add error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Add the RESUME_CRITERIA constant from EmployeePage.jsx
const RESUME_CRITERIA = {
  keywords: [
    // Contact & Personal Info
    'email', 'phone', 'linkedin',
    'date of birth', 'gender', 'nationality',
    'languages', 'english', 'malayalam',
    'kerala', 'indian',
    
    // Educational Qualifications
    'master of computer applications', 'mca',
    'bachelor of computer applications', 'bca',
    'plus two', 'tenth',
    'cgpa', 'ktu university',
    'bangalore north university',
    'amal jyothi college',
    'autonomous', 'engineering',
    'kerala state board',
    
    // Technical Skills
    'web development', 'mern stack',
    'html', 'css', 'javascript', 'react',
    'node js', 'mysql', 'mongodb',
    'python', 'c', 'c++',
    'windows', 'linux',
    'full stack development',
    
    // Projects
    'careerconnect', 'autocare hub',
    'edutrack', 'management system',
    'service management',
    'student management',
    
    // Professional Traits
    'dedicated', 'committed',
    'honest', 'hard working',
    'team player', 'leadership',
    'communication skills',
    'positive attitude',
    'competitive', 'challenging',
    
    // Certifications & Achievements
    'ict academy', 'nptel',
    'internet of things',
    'full stack', 'specialist',
    'azure coordinator',
    'cultural fest',
    
    // Hobbies
    'cycling', 'swimming',
    
    // Career Keywords
    'career objective',
    'growth', 'success',
    'organization',
    'knowledge', 'contribute'
  ],
  
  sections: [
    'contact details',
    'technical skills',
    'career objective',
    'achievements',
    'certifications',
    'personal details',
    'education',
    'projects',
    'hobbies'
  ],
  
  actionVerbs: [
    'contributed', 'served',
    'developed', 'managed',
    'certified', 'organized',
    'executed', 'working',
    'adapt', 'contribute'
  ],

  industryPatterns: {
    contact: [
      /\+91\s*\d{10}/,                    // Phone
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i,  // Email
      /linkedin\.com\/in\/[\w-]+/i,        // LinkedIn
      /kerala|kottayam|pin:\s*\d{6}/i      // Address
    ],
    education: [
      /(?:cgpa|percentage):\s*\d+\.?\d*/i,  // CGPA/Percentage
      /(?:20\d\d-20\d\d|20\d\d)/i,         // Year
      /(?:university|college|school)/i,      // Institution
      /(?:mca|bca|plus two|tenth)/i         // Qualification
    ],
    skills: [
      /html|css|javascript|react|node|python|c\+\+/i,  // Technical skills
      /mern stack|full stack/i,                        // Stack
      /windows|linux/i                                 // OS
    ],
    projects: [
      /scope\s*:/i,                        // Project scope
      /project|system/i,                   // Project keywords
      /management system/i                 // System type
    ]
  }
};

// Add ATS scoring function
const calculateATSScore = async (resumeText) => {
  try {
    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error('Resume text is empty or invalid');
    }

    if (!RESUME_CRITERIA || !RESUME_CRITERIA.keywords) {
      throw new Error('Resume criteria not properly configured');
    }

    const resumeLower = resumeText.toLowerCase();
    let scores = {
      keywords: 0,
      sections: 0,
      actionVerbs: 0,
      patterns: 0
    };

    // Scoring logic with error checking
    if (Array.isArray(RESUME_CRITERIA.keywords)) {
      RESUME_CRITERIA.keywords.forEach(keyword => {
        if (resumeLower.includes(keyword.toLowerCase())) {
          scores.keywords += 1;
        }
      });
    }

    if (Array.isArray(RESUME_CRITERIA.sections)) {
      RESUME_CRITERIA.sections.forEach(section => {
        if (resumeLower.includes(section.toLowerCase())) {
          scores.sections += 1;
        }
      });
    }

    if (Array.isArray(RESUME_CRITERIA.actionVerbs)) {
      RESUME_CRITERIA.actionVerbs.forEach(verb => {
        if (resumeLower.includes(verb.toLowerCase())) {
          scores.actionVerbs += 1;
        }
      });
    }

    if (RESUME_CRITERIA.industryPatterns) {
      Object.values(RESUME_CRITERIA.industryPatterns).forEach(patternList => {
        if (Array.isArray(patternList)) {
          patternList.forEach(pattern => {
            if (pattern.test(resumeText)) {
              scores.patterns += 1;
            }
          });
        }
      });
    }

    // Calculate scores with validation
    const keywordScore = RESUME_CRITERIA.keywords.length > 0 
      ? (scores.keywords / RESUME_CRITERIA.keywords.length) * 100 
      : 0;
    const sectionScore = RESUME_CRITERIA.sections.length > 0 
      ? (scores.sections / RESUME_CRITERIA.sections.length) * 100 
      : 0;
    const verbScore = RESUME_CRITERIA.actionVerbs.length > 0 
      ? (scores.actionVerbs / RESUME_CRITERIA.actionVerbs.length) * 100 
      : 0;
    const patternScore = (scores.patterns / 12) * 100;

    const finalScore = (
      keywordScore * 0.35 +
      sectionScore * 0.30 +
      verbScore * 0.20 +
      patternScore * 0.15
    );

    // Generate feedback
    let suggestions = [];
    if (keywordScore < 60) suggestions.push('Add more relevant technical skills and qualifications');
    if (sectionScore < 60) suggestions.push('Ensure all important sections are properly labeled');
    if (verbScore < 60) suggestions.push('Use more action words to describe your achievements and projects');
    if (patternScore < 60) suggestions.push('Include contact details and education information in proper format');

    return {
      score: finalScore,
      details: {
        skillsScore: keywordScore,
        structureScore: sectionScore,
        experienceScore: verbScore,
        formatScore: patternScore,
        suggestions
      }
    };
  } catch (error) {
    console.error('ATS Score calculation error:', error);
    throw error;
  }
};

// Add function to extract text from PDF
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};

// Add function to extract text from resume
const extractTextFromResume = async (filePath) => {
  try {
    const fileExtension = path.extname(filePath).toLowerCase();
    
    if (fileExtension === '.pdf') {
      return await extractTextFromPDF(filePath);
    } else if (fileExtension === '.doc' || fileExtension === '.docx') {
      // For now, we'll just return an error for doc/docx files
      throw new Error('DOC/DOCX files are not supported yet');
    }
    
    throw new Error('Unsupported file type');
  } catch (error) {
    console.error('Error extracting text from resume:', error);
    throw error;
  }
};

router.post('/create', 
  upload.fields([{ name: 'photo' }, { name: 'resume' }]),
  handleUploadError,
  async (req, res) => {
    try {
      console.log(req.files); // Log the uploaded files to check if both are received

      const { name, email, phone, address, degree, experienceYears, experienceMonths, skills, dob, jobPreferences, userId } = req.body;
      
      // If files (photo and resume) are uploaded
      const photo = req.files.photo ? req.files.photo[0].path : null;
      const resume = req.files.resume ? req.files.resume[0].path : null;

      let atsScore = 0;
      let atsDetails = {};
      
      // If resume is uploaded, calculate ATS score
      if (req.files.resume) {
        const resumePath = req.files.resume[0].path;
        // You'll need to implement a function to extract text from the resume
        const resumeText = await extractTextFromResume(resumePath);
        const atsResults = await calculateATSScore(resumeText);
        atsScore = atsResults.score;
        atsDetails = atsResults.details;
      }

      // Create a new employee profile
      const newProfile = new EmployeeProfile({
        name,
        email,
        phone,
        address,
        degree,
        experienceYears,
        experienceMonths,
        skills: skills.split(','),
        dob,
        jobPreferences: jobPreferences.split(','),
        photo,
        resume,
        userId,
        atsScore,
        atsDetails
      });

      // Save the profile in the database
      const profile = await newProfile.save();

      res.status(201).json({
        message: 'Profile created successfully',
        profile,
      });
    } catch (error) {
      console.error('Profile creation error:', error);
      res.status(400).json({
        message: 'Error creating profile',
        error: error.message
      });
    }
  }
);

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

// Update the update route to properly handle profile updates
router.put('/update/:userId', 
  upload.fields([{ name: 'photo' }, { name: 'resume' }]),
  handleUploadError,
  async (req, res) => {
    try {
      const { userId } = req.params;
      console.log('Updating profile for user:', userId);
      console.log('Request body:', req.body);
      console.log('Request files:', req.files);

      // Initialize update data with all fields from request body
      const updateData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        experienceYears: req.body.experienceYears || 0,
        experienceMonths: req.body.experienceMonths || 0,
        dob: req.body.dob
      };

      // Handle arrays properly
      if (req.body.skills) {
        updateData.skills = req.body.skills.split(',').filter(skill => skill.trim());
        console.log('Processed skills:', updateData.skills);
      }

      if (req.body.jobPreferences) {
        updateData.jobPreferences = req.body.jobPreferences.split(',').filter(pref => pref.trim());
        console.log('Processed job preferences:', updateData.jobPreferences);
      }

      if (req.body.degree) {
        updateData.degree = req.body.degree.split(',').filter(deg => deg.trim());
        console.log('Processed degrees:', updateData.degree);
      }

      // Handle file uploads
      if (req.files?.photo) {
        updateData.photo = req.files.photo[0].path;
        console.log('New photo path:', updateData.photo);
      }

      if (req.files?.resume) {
        updateData.resume = req.files.resume[0].path;
        console.log('New resume path:', updateData.resume);
        
        try {
          // Extract text from resume
          const resumeText = await extractTextFromResume(updateData.resume);
          console.log('Successfully extracted text from resume');
          
          if (resumeText) {
            // Calculate ATS score
            const atsResults = await calculateATSScore(resumeText);
            console.log('Calculated ATS score:', atsResults.score);
            
            updateData.atsScore = atsResults.score;
            updateData.atsDetails = atsResults.details;
          }
        } catch (error) {
          console.error('Error processing resume:', error);
          // Continue with update even if resume processing fails
        }
      }

      console.log('Final update data:', updateData);

      // Find the profile first to check if it exists
      const existingProfile = await EmployeeProfile.findOne({ userId });
      
      if (!existingProfile) {
        console.log('Profile not found, creating new profile');
        // Create new profile if it doesn't exist
        const newProfile = new EmployeeProfile({
          ...updateData,
          userId
        });
        
        const savedProfile = await newProfile.save();
        return res.status(201).json({
          message: 'Profile created successfully',
          profile: savedProfile
        });
      }
      
      // Update the existing profile
      console.log('Updating existing profile with ID:', existingProfile._id);
      const updatedProfile = await EmployeeProfile.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      console.log('Profile updated successfully:', updatedProfile);
      
      res.status(200).json({
        message: 'Profile updated successfully',
        updatedProfile
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({
        message: 'Error updating profile',
        error: error.message,
        stack: error.stack
      });
    }
  }
);

// Add a new route to get ATS score
router.get('/ats-score/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await EmployeeProfile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({
      atsScore: profile.atsScore,
      atsDetails: profile.atsDetails
    });
  } catch (error) {
    console.error('Error fetching ATS score:', error);
    res.status(500).json({ message: 'Error fetching ATS score', error: error.message });
  }
});

module.exports = router;
