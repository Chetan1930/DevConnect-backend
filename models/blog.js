const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 50,
    },
    image: {
        type: String,
    },    
    writer: {
        type: String,
    },
    text: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
