const express = require('express');
const passport = require('passport');
const generateToken = require('../utils/generateToken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const cookies = require('cookie-parser');
const { login, register } = require('../controllers/authControllers');

const router = express.Router();

// Register
router.post('/register', register);

// Login using Passport-Local
router.post('/login', login);

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/dashboard' // OR send token/client redirect from here
  })
);



module.exports = router;