const express = require('express');
const router = express.Router();
const Message = require('../model/chatModel');
const User = require('../model/userData');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/chat'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// Get chat history between two users
router.get('/messages/:senderId/:receiverId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.params.senderId, receiver: req.params.receiverId },
        { sender: req.params.receiverId, receiver: req.params.senderId }
      ]
    }).sort({ timestamp: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      { 
        sender: req.params.receiverId, 
        receiver: req.params.senderId,
        read: false
      },
      { $set: { read: true } }
    );
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a new message
router.post('/messages', async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.sender || !req.body.receiver || !req.body.content) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: req.body 
      });
    }

    // Convert role to proper case
    const senderType = req.body.senderType.charAt(0).toUpperCase() + req.body.senderType.slice(1);
    const receiverType = req.body.receiverType.charAt(0).toUpperCase() + req.body.receiverType.slice(1);

    const message = new Message({
      sender: req.body.sender,
      senderType: senderType,
      receiver: req.body.receiver,
      receiverType: receiverType,
      content: req.body.content.trim(),
      fileUrl: req.body.fileUrl || null
    });

    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      details: error.errors 
    });
  }
});

// Update the mark messages as read route - the current one has a different path than what's being called
router.put('/mark-read/:senderId/:receiverId', async (req, res) => {
  try {
    await Message.updateMany(
      { 
        sender: req.params.senderId, 
        receiver: req.params.receiverId,
        read: false
      },
      { $set: { read: true } }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Modified: Get available users for chat sorted by most recent message
router.get('/chat-users', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Find all users except the current user
    const users = await User.find({ 
      _id: { $ne: userId }
    }).select('name role _id');
    
    // For each user, find their last message with the current user
    const usersWithLastMessage = await Promise.all(users.map(async (user) => {
      const lastMessage = await Message.findOne({
        $or: [
          { sender: userId, receiver: user._id },
          { sender: user._id, receiver: userId }
        ]
      })
      .sort({ timestamp: -1 })
      .limit(1);
      
      const unreadCount = await Message.countDocuments({
        sender: user._id,
        receiver: userId,
        read: false
      });
      
      return {
        _id: user._id,
        name: user.name,
        role: user.role,
        lastMessage: lastMessage,
        lastMessageTime: lastMessage ? lastMessage.timestamp : new Date(0),
        unreadCount
      };
    }));
    
    // Sort users by their last message timestamp (most recent first)
    usersWithLastMessage.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    
    res.json(usersWithLastMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add file upload route
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/chat/${req.file.filename}`;
    res.json({ fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get last message between two users
router.get('/last-message/:userId/:otherId', async (req, res) => {
  try {
    const message = await Message.findOne({
      $or: [
        { sender: req.params.userId, receiver: req.params.otherId },
        { sender: req.params.otherId, receiver: req.params.userId }
      ]
    })
    .sort({ timestamp: -1 })
    .limit(1);

    const unreadCount = await Message.countDocuments({
      sender: req.params.otherId,
      receiver: req.params.userId,
      read: false
    });

    res.json({ message, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Modified: Get all last messages sorted by timestamp
router.get('/all-last-messages/:userId', async (req, res) => {
  try {
    // Get all users except current user
    const users = await User.find({ 
      _id: { $ne: req.params.userId }
    }).select('_id name role');
    
    // Get last messages and unread counts for all users
    const results = await Promise.all(users.map(async (user) => {
      const message = await Message.findOne({
        $or: [
          { sender: req.params.userId, receiver: user._id },
          { sender: user._id, receiver: req.params.userId }
        ]
      })
      .sort({ timestamp: -1 })
      .limit(1);

      const unreadCount = await Message.countDocuments({
        sender: user._id,
        receiver: req.params.userId,
        read: false
      });

      return { 
        user: {
          _id: user._id,
          name: user.name,
          role: user.role
        },
        lastMessage: message,
        lastMessageTime: message ? message.timestamp : new Date(0),
        unreadCount
      };
    }));
    
    // Sort results by last message timestamp (most recent first)
    results.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this new route to get total unread count for a user
router.get('/unread-count/:userId', async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.params.userId,
      read: false
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;