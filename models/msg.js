const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: String,
  username: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', messageSchema);
