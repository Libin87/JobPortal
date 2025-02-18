const express = require('express');
const router = express.Router();
const Notification = require('../model/notification');
const mongoose = require('mongoose');

// Get admin notifications - Put this BEFORE the /:userId route
router.get('/admin/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      type: 'admin_contact',
      isAdminNotification: true 
    })
    .sort({ createdAt: -1 })
    .populate('userId', 'name email')
    .populate('jobId', 'jobTitle companyName')
    .populate('fromUserId', 'name email')
    .exec();

    // If no notifications found, return empty array instead of error
    res.json(notifications || []);
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    res.status(500).json({ 
      message: 'Error fetching notifications',
      error: error.message 
    });
  }
});

// Get notifications for a specific user
router.get('/:userId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const notifications = await Notification.find({
      userId: new mongoose.Types.ObjectId(req.params.userId),
      $or: [
        { isAdminNotification: true },
        { type: { $in: ['admin_contact', 'job', 'admin_response'] } }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('jobId', 'jobTitle companyName')
    .limit(50)
    .exec();

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ 
      message: 'Error fetching notifications',
      error: error.message 
    });
  }
});

// Mark notification as read
router.put('/:notificationId/read', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.notificationId)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }

    const notification = await Notification.findByIdAndUpdate(
      new mongoose.Types.ObjectId(req.params.notificationId),
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Error updating notification' });
  }
});

// Create admin response
router.post('/admin-response', async (req, res) => {
  try {
    const { userId, jobId, message, title } = req.body;
    
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(userId) || (jobId && !mongoose.Types.ObjectId.isValid(jobId))) {
      return res.status(400).json({ message: 'Invalid user ID or job ID' });
    }

    const notification = new Notification({
      userId: new mongoose.Types.ObjectId(userId),
      title: title || 'Admin Response',
      message,
      type: 'admin_response',
      isAdminNotification: true,
      jobId: jobId ? new mongoose.Types.ObjectId(jobId) : null,
      read: false
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating admin notification:', error);
    res.status(500).json({ message: 'Error creating notification' });
  }
});

// Add a route for admin to respond to notifications
router.post('/admin/respond', async (req, res) => {
  try {
    const { userId, jobId, message, originalNotificationId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Create notification for the employer
    const notification = new Notification({
      userId: new mongoose.Types.ObjectId(userId),
      title: 'Response from Admin',
      message,
      type: 'admin_response',
      isAdminNotification: true,
      jobId: jobId && mongoose.Types.ObjectId.isValid(jobId) ? new mongoose.Types.ObjectId(jobId) : null,
      read: false
    });

    await notification.save();

    // Mark the original notification as read if provided
    if (originalNotificationId && mongoose.Types.ObjectId.isValid(originalNotificationId)) {
      await Notification.findByIdAndUpdate(
        new mongoose.Types.ObjectId(originalNotificationId),
        { read: true }
      );
    }

    res.status(201).json({
      message: 'Response sent successfully',
      notification
    });
  } catch (error) {
    console.error('Error sending admin response:', error);
    res.status(500).json({ 
      message: 'Error sending response',
      error: error.message 
    });
  }
});

module.exports = router; 