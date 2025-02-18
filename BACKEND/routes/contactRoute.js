const express = require('express');
const router = express.Router();
const Contact = require('../model/contactModel');
const nodemailer = require('nodemailer');
const Notification = require('../model/notification');
const upload = require('../middleware/upload');

require('dotenv').config(); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Read from .env file
    pass: process.env.EMAIL_APP_PASSWORD // Read from .env file
  }
});

module.exports = transporter;



// Submit contact message
router.post('/submit-message', upload.single('document'), async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const newContact = new Contact({
      name,
      email,
      message,
      type: 'general_inquiry',
      documentUrl: req.file ? `/uploads/documents/${req.file.filename}` : null
    });

    await newContact.save();

    res.status(201).json({ 
      success: true,
      message: 'Message sent successfully! We will get back to you soon.' 
    });
  } catch (error) {
    console.error('Error submitting message:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending message. Please try again later.' 
    });
  }
});

// Get all messages (for admin)
router.get('/messages', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Add this to your existing contactRoute.js



// Route to respond to a message
router.post('/respond/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { response, email } = req.body;

    // Update message status in database
    const updatedMessage = await Contact.findByIdAndUpdate(
      messageId,
      { 
        status: 'Responded',
        response: response,
        respondedAt: new Date()
      },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Send email response
    const mailOptions = {
      from: 'your-email@gmail.com', // Replace with your email
      to: email,
      subject: 'Response to Your Contact Query - Job Portal',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Response to Your Message</h2>
          <p>Dear ${updatedMessage.name},</p>
          <p>Thank you for contacting us. Here is our response to your query:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            ${response}
          </div>
          <p>Original Message:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${updatedMessage.message}
          </div>
          <p>Best regards,<br>Job Portal Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Response sent successfully',
      updatedMessage 
    });
  } catch (error) {
    console.error('Error sending response:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending response' 
    });
  }
});

// Update the admin contact route
router.post('/admin', upload.single('document'), async (req, res) => {
  try {
    const { userId, jobId, message, type } = req.body;
    
    // Create a new contact record
    const contact = new Contact({
      userId: userId,
      jobId: jobId,
      message: message,
      type: type || 'job_suspension',
      status: 'new',
      documentUrl: req.file ? `/uploads/documents/${req.file.filename}` : null
    });
    
    const savedContact = await contact.save();

    // Create notification for admin
    const notification = new Notification({
      userId: userId,  // Store the sender's ID
      jobId: jobId,
      title: 'New Message from Employer',
      message: message,
      type: 'admin_contact',
      documentUrl: savedContact.documentUrl
    });
    
    await notification.save();

    res.json({ 
      success: true,
      message: 'Message sent successfully',
      contact: savedContact 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending message',
      error: error.message 
    });
  }
});

module.exports = router; 