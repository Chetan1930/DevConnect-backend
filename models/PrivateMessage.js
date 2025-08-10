// models/PrivateMessage.js
const mongoose = require("mongoose");

const PrivateMessageSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PrivateMessage", PrivateMessageSchema);