const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendWelcomeEmail } = require('../services/emailService');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

function queueWelcomeEmail(user, context = 'welcome') {
  sendWelcomeEmail(user)
    .then((result) => {
      if (result?.sent === false) {
        console.warn(`[email] ${context} mail not sent for ${user.email}: ${result.reason}`);
      } else {
        console.log(`[email] ${context} mail sent to ${user.email}`);
      }
    })
    .catch((err) => console.error(`[email] ${context} mail error for ${user.email}:`, err.message));
}

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

    res.status(201).json({
      token,
      user: {
        _id: user._id, name: user.name, email: user.email,
        isOnboarded: user.isOnboarded, avatar: user.avatar
      },
      welcomeEmailSent: null,
      welcomeEmailMessage: 'Welcome email will be sent after onboarding'
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
      targetCompanies, placementDate, dailyGoal, emailReminders
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        college, branch, graduationYear, targetPackage,
        targetCompanies, placementDate, dailyGoal, emailReminders,
        isOnboarded: true
      },
      { new: true }
    );

    const emailResult = await sendWelcomeEmail(user).catch((mailErr) => {
      console.error('[email] onboarding welcome mail error:', mailErr.message);
      return { sent: false, reason: mailErr.message || 'email-send-error' };
    });

    let welcomeEmailSent = Boolean(emailResult?.sent);
    let welcomeEmailMessage = welcomeEmailSent
      ? 'Welcome email sent successfully'
      : (emailResult?.reason || 'email-not-sent');

    if (!welcomeEmailSent) {
      queueWelcomeEmail(user, 'onboarding-retry');
      if (welcomeEmailMessage === 'email-request-timeout') {
        welcomeEmailMessage = 'Email request timed out, retry queued in background';
      }
    }

    res.json({ message: 'Onboarding complete', user, welcomeEmailSent, welcomeEmailMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/resend-welcome
router.post('/resend-welcome', protect, async (req, res) => {
  try {
    const result = await sendWelcomeEmail(req.user).catch((mailErr) => {
      console.error('[email] resend welcome mail error:', mailErr.message);
      return { sent: false, reason: mailErr.message || 'email-send-error' };
    });

    if (result?.sent === false) {
      queueWelcomeEmail(req.user, 'resend-retry');
      return res.status(400).json({
        message: 'Could not send welcome email right now. Retry has been queued.',
        reason: result.reason || 'email-not-sent'
      });
    }
    return res.json({ message: 'Welcome email sent successfully' });
  } catch (err) {
    console.error('[email] resend welcome unexpected error:', err.message);
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
