const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendWelcomeEmail } = require('../services/emailService');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    let welcomeEmailSent = false;
    let welcomeEmailMessage = 'Welcome email not sent';

    try {
      const result = await sendWelcomeEmail(user);
      welcomeEmailSent = Boolean(result?.sent);
      if (result?.sent === false) {
        welcomeEmailMessage = result.reason || 'email-not-sent';
        console.warn(`[email] welcome mail not sent for ${user.email}: ${welcomeEmailMessage}`);
      } else {
        welcomeEmailMessage = 'Welcome email sent';
      }
    } catch (err) {
      welcomeEmailMessage = err.message || 'email-send-failed';
      console.error('[email] welcome mail error:', welcomeEmailMessage);
    }

    res.status(201).json({
      token,
      user: {
        _id: user._id, name: user.name, email: user.email,
        isOnboarded: user.isOnboarded, avatar: user.avatar
      },
      welcomeEmailSent,
      welcomeEmailMessage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);
    res.json({
      token,
      user: {
        _id: user._id, name: user.name, email: user.email,
        isOnboarded: user.isOnboarded, avatar: user.avatar,
        college: user.college, branch: user.branch,
        targetPackage: user.targetPackage, targetCompanies: user.targetCompanies
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/onboard
router.post('/onboard', protect, async (req, res) => {
  try {
    const {
      college, branch, graduationYear, targetPackage,
      targetCompanies, placementDate, dailyGoal
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        college, branch, graduationYear, targetPackage,
        targetCompanies, placementDate, dailyGoal,
        isOnboarded: true
      },
      { new: true }
    );

    // Send welcome email with full details
    sendWelcomeEmail(user)
      .then((result) => {
        if (result?.sent === false) {
          console.warn(`[email] onboarding mail not sent for ${user.email}: ${result.reason}`);
        }
      })
      .catch((err) => console.error('[email] onboarding mail error:', err.message));

    res.json({ message: 'Onboarding complete', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/resend-welcome
router.post('/resend-welcome', protect, async (req, res) => {
  try {
    const result = await sendWelcomeEmail(req.user);
    if (result?.sent === false) {
      return res.status(400).json({
        message: 'Could not send welcome email',
        reason: result.reason || 'email-not-sent'
      });
    }
    return res.json({ message: 'Welcome email sent successfully' });
  } catch (err) {
    console.error('[email] resend welcome mail error:', err.message);
    return res.status(500).json({ message: err.message || 'Failed to resend welcome email' });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

// Google OAuth placeholder (configure with passport)
router.get('/google', (req, res) => {
  res.json({ message: 'Configure Google OAuth with passport-google-oauth20' });
});

module.exports = router;
