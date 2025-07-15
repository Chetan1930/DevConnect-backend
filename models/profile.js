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
        maxlength: 300, // this is something jiska merko phele nhi pta tha...ek aur new chij add hui h knowledge mei 
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
        default: 'https://www.gravatar.com/avatar/placeholder',
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Profile", profileSchema);


// so let me tell you about DataAssociation...