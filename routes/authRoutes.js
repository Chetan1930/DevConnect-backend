const express = require('express');
const passport = require('passport');
const generateToken = require('../utils/generateToken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: hashed });

    const token = generateToken(user);
    res.status(201).json({ token, user });
});

// Login using Passport-Local
router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) return res.status(401).json({ message: info?.message || 'Login failed' });

        const token = generateToken(user);
        res.status(200).json({ token, user });
    })(req, res, next);
});


module.exports = router;