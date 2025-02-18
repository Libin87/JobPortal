const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const EmployeeProfile = require('../model/EmployeeProfile'); // Updated import

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    console.log('File upload attempt:', {
        originalname: file.originalname,
        mimetype: file.mimetype
    });

    // Check file extension first
    const allowedExtensions = /\.(pdf|doc|docx)$/i;
    if (!file.originalname.match(allowedExtensions)) {
        return cb(new Error('Invalid file extension. Only PDF and Word documents are allowed.'), false);
    }

    // Also check MIME types as a secondary validation
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/x-pdf',
        'application/vnd.ms-word',
        'application/octet-stream'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // If extension is valid but MIME type isn't in our list, still accept it
        // This helps with inconsistent MIME type reporting across different systems
        console.log('Warning: Unknown MIME type but valid extension, accepting file');
        cb(null, true);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Route to handle resume upload and processing
router.post('/upload-resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('Processing file:', {
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        const file = req.file;
        let resumeText = '';

        // Check file extension
        const fileExtension = file.originalname.split('.').pop().toLowerCase();

        // Process based on file extension instead of mimetype
        if (fileExtension === 'pdf') {
            const dataBuffer = fs.readFileSync(file.path);
            const data = await pdf(dataBuffer);
            resumeText = data.text;
        }
        else if (['doc', 'docx'].includes(fileExtension)) {
            const result = await mammoth.extractRawText({ path: file.path });
            resumeText = result.value;
        }
        else {
            throw new Error('Unsupported file format');
        }

        // Update user's profile with the resume text
        if (!req.body.userId) {
            throw new Error('User ID is required');
        }

        // Find the employee profile using userId field
        const updatedEmployee = await EmployeeProfile.findOneAndUpdate(
            { userId: req.body.userId }, // Search by userId instead of _id
            { resume: resumeText },
            { new: true }
        );

        if (!updatedEmployee) {
            throw new Error('Employee profile not found');
        }

        // Clean up the uploaded file
        fs.unlinkSync(file.path);

        res.status(200).json({ 
            message: 'Resume uploaded and processed successfully',
            resumeText: resumeText
        });

    } catch (error) {
        console.error('Error processing resume:', error);
        
        // Clean up file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ 
            message: 'Error processing resume', 
            error: error.message 
        });
    }
});

// Get employee profile
router.get('/:userId', async (req, res) => {
    try {
        // Find employee profile using userId field
        const employee = await EmployeeProfile.findOne({ userId: req.params.userId });
        if (!employee) {
            return res.status(404).json({ message: 'Employee profile not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee profile', error: error.message });
    }
});

module.exports = router;
