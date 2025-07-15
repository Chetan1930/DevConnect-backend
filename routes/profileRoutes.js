const route = require('express').Router();
const {ensureAuth} = require('../middleware/protectRoute.js');
console.log("typeof ensureAuth:", typeof ensureAuth);
const Profile = require("../models/profile");

route.post('/', ensureAuth , async (req, res) => {
  const { bio, skills, github, linkedin, avatar } = req.body;
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
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = route;