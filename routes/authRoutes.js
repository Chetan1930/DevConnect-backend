const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const router = express.Router();

// REGISTER (manual)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ 
  success: false, 
  message: "Email already registered" 
});

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashed });

    if(!newUser) return res.status(422).json({
  success: false,
  errors: {
    email: { message: "Invalid email format" },
    password: { message: "Password must be at least 6 characters" }
  }
});

    res.status(200).json({success: true, message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN (Passport Local Strategy, session-based)

router.get('/github', (req,res)=>{
  res.send("<h1>this feature will comming soon!</h2>")
})
router.get('/google', (req,res)=>{
  res.send("<h1>this feature will comming soon!</h2>")
})
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || 'Login failed' });

    // Log user in and create session
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: 'Login successful', user });
    });
  })(req, res, next);
});

// Google OAuth Route
router.post('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth Callback
router.post('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    // On success, redirect or respond with user
    res.redirect('/dashboard'); // or res.json(req.user)
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

module.exports = router;
