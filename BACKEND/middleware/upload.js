const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create separate folders for different file types
    let uploadPath = 'uploads/';
    if (file.fieldname === 'resume') {
      uploadPath += 'resumes/';
    } else if (file.fieldname === 'document') {
      uploadPath += 'documents/';
    } else if (file.fieldname === 'logo') {
      uploadPath += 'logos/';
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    // Allow only PDF and Word documents for resumes
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed for resumes'));
    }
  } else if (file.fieldname === 'document' || file.fieldname === 'logo') {
    // Allow images and PDFs for other documents
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  } else {
    cb(new Error('Unexpected field name'));
  }
};

// Create multer instance with size limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload; 