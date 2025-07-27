const route = require('express').Router();
const {ensureAuth} = require('../middlewares/protectRoute.js');
const parser = require('../middlewares/multer');
const Profile = require("../models/profile");

route.post('/' , ensureAuth ,  parser.single('avatar')  , async (req, res) => {
  const { bio, skills, github, linkedin } = req.body;
  const avatar = req.file?.path;
  const userId = req.user._id;

  try {
    const existingProfile = await Profile.findOne({ userId });

    if (existingProfile) {
      // Update
      existingProfile.bio = bio;
      existingProfile.skills = skills;
      existingProfile.github = github;
      existingProfile.linkedin = linkedin;
      existingProfile.avatar = avatar;
      await existingProfile.save();
      return res.status(200).json(existingProfile);
    }

    // Create new profile
    const profile = await Profile.create({
      userId,
      bio,
      skills,
      github,
      linkedin,
      avatar
    });

    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// GET /api/profile/:id
route.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.id }).populate('userId', 'username email');
    if (!profile) {
      return res.status(404).json({
        message: 'Profile not created yet. Would you like to create one?',
        createPrompt: true 
      });
    }
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = route;