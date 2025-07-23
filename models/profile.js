const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 300,  
        default: ''
    },
    skills: {
        type: [String], // array of strings
        default: [],
    },
    github: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        match: /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/
    },
    linkedin: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        match: /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/
    },
    avatar: {
        type: String,
        default: 'https://i.pinimg.com/736x/36/ae/a4/36aea442f9694a4df7aff88f1d6c28f6.jpg',
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Profile", profileSchema);


// so let me tell you about DataAssociation...