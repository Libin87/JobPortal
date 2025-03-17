const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderType'
  },
  senderType: {
    type: String,
    required: true,
    enum: ['Employee', 'Employer']
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverType'
  },
  receiverType: {
    type: String,
    required: true,
    enum: ['Employee', 'Employer']
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  fileUrl: {
    type: String,
    required: false
  },
  fileType: {
    type: String,
    required: false
  }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
