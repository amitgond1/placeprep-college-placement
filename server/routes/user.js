const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const MockSession = require('../models/MockSession');
const AptitudeMockResult = require('../models/AptitudeMockResult');
const { protect } = require('../middleware/auth');

// Avatar upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/avatars');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// GET /api/user/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('solvedQuestions', 'title difficulty topic');

    // Get mock history
    const mocks = await MockSession.find({ user: req.user._id, completed: true })
      .sort({ createdAt: -1 }).limit(10).select('company roundType overallScore createdAt');

    // Get ATS scores from resume
    const ResumeData = require('../models/ResumeData');
    const resume = await ResumeData.findOne({ user: req.user._id }).select('atsScores');
    const atsScores = resume?.atsScores?.slice(-3) || [];

    // Aptitude stats
    const aptResults = await AptitudeMockResult.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    const aptStats = {
      attempted: aptResults.length,
      best: aptResults.length ? Math.max(...aptResults.map(r => r.score)) : 0,
      average: aptResults.length ? Math.round(aptResults.reduce((a, b) => a + b.score, 0) / aptResults.length) : 0,
      latest: aptResults.length ? aptResults[0].score : 0,
      history: aptResults.slice(0, 10).map(r => ({ mockId: r.mockId, score: r.score, date: r.createdAt }))
    };

    res.json({ user, mocks, atsScores, aptStats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/user/profile
router.patch('/profile', protect, async (req, res) => {
  try {
    const allowed = ['name', 'college', 'branch', 'graduationYear', 'targetPackage',
      'targetCompanies', 'placementDate', 'dailyGoal', 'linkedinUrl', 'githubUrl',
      'leetcodeUsername', 'emailReminders', 'weeklyReport'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/user/avatar
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl }, { new: true });
    res.json({ avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/user/leetcode/:username
router.get('/leetcode/:username', protect, async (req, res) => {
  try {
    const { username } = req.params;
    const query = `{ matchedUser(username: "${username}") { submitStats { acSubmissionNum { difficulty count } } } }`;
    const response = await require('axios').post('https://leetcode.com/graphql', { query }, {
      headers: { 'Content-Type': 'application/json' }
    });
    const stats = response.data?.data?.matchedUser?.submitStats?.acSubmissionNum || [];
    const total = stats.find(s => s.difficulty === 'All')?.count || 0;
    await User.findByIdAndUpdate(req.user._id, { leetcodeSolved: total });
    res.json({ solved: total, breakdown: stats });
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch LeetCode data', solved: 0 });
  }
});

// GET /api/user/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const user = req.user;
    const daysUntilPlacement = user.placementDate
      ? Math.max(0, Math.ceil((new Date(user.placementDate) - new Date()) / (1000 * 60 * 60 * 24)))
      : null;

    // Company readiness
    const mocks = await MockSession.find({ user: user._id, completed: true });
    const companyReadiness = {};
    (user.targetCompanies || []).forEach(company => {
      const compMocks = mocks.filter(m => m.company === company);
      const avgScore = compMocks.length
        ? compMocks.reduce((a, m) => a + m.overallScore, 0) / compMocks.length : 0;
      const dsaFactor = Math.min(100, (user.dsaSolvedTotal / 100) * 50);
      companyReadiness[company] = Math.round((avgScore * 0.5) + dsaFactor);
    });

    res.json({ daysUntilPlacement, companyReadiness, streak: user.currentStreak });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
