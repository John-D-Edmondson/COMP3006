const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  timeSent: {
    type: Date,
    default: Date.now,
  },
  userID: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
