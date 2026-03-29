const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const AptitudeQuestion = require('../models/AptitudeQuestion');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Simple string hash to number
function hashDateToIndex(dateStr, max) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  return hash % max;
}

// GET /api/daily/challenge — returns today's DSA + aptitude question
router.get('/challenge', protect, async (req, res) => {
  try {
    const dateStr = new Date().toISOString().split('T')[0];

    const [dsaCount, aptCount] = await Promise.all([
      Question.countDocuments({ difficulty: { $in: ['Easy', 'Medium'] } }),
      AptitudeQuestion.countDocuments({})
    ]);

    if (!dsaCount || !aptCount) {
      return res.status(404).json({ message: 'No questions available' });
    }

    const dsaIndex = hashDateToIndex(dateStr + '_dsa', dsaCount);
    const aptIndex = hashDateToIndex(dateStr + '_apt', aptCount);

    const [dsaQuestion, aptQuestion] = await Promise.all([
      Question.find({ difficulty: { $in: ['Easy', 'Medium'] } })
        .sort({ questionNumber: 1 })
        .skip(dsaIndex)
        .limit(1)
        .lean(),
      AptitudeQuestion.find({})
        .sort({ _id: 1 })
        .skip(aptIndex)
        .limit(1)
        .lean()
    ]);

    if (!dsaQuestion.length || !aptQuestion.length) {
      return res.status(404).json({ message: 'Could not fetch daily questions' });
    }

    // Check user's completion for today
    const user = req.user;
    const todayEntry = user.dailyChallenges?.find(d => d.date === dateStr);

    // Compute "day X of journey"
    const createdAt = user.createdAt ? new Date(user.createdAt) : new Date();
    const today = new Date();
    const diffDays = Math.floor((today - createdAt) / (1000 * 60 * 60 * 24)) + 1;

    res.json({
      date: dateStr,
      dayOfJourney: diffDays,
      dsaQuestion: {
        ...dsaQuestion[0],
        correctAnswer: undefined
      },
      aptitudeQuestion: {
        ...aptQuestion[0],
        correctAnswer: undefined // hide from initial load
      },
      completion: todayEntry || { completedDsa: false, completedAptitude: false }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/daily/complete — mark today's challenge as done, award +5 bonus points
router.post('/complete', protect, async (req, res) => {
  try {
    const { type } = req.body; // 'dsa' | 'aptitude'
    if (!['dsa', 'aptitude'].includes(type)) {
      return res.status(400).json({ message: 'type must be dsa or aptitude' });
    }

    const dateStr = new Date().toISOString().split('T')[0];

    const user = await User.findById(req.user._id);
    if (!user.dailyChallenges) user.dailyChallenges = [];

    let entry = user.dailyChallenges.find(d => d.date === dateStr);

    if (!entry) {
      // Get today's question IDs
      const [dsaCount, aptCount] = await Promise.all([
        Question.countDocuments({ difficulty: { $in: ['Easy', 'Medium'] } }),
        AptitudeQuestion.countDocuments({})
      ]);
      const dsaIndex = hashDateToIndex(dateStr + '_dsa', dsaCount);
      const aptIndex = hashDateToIndex(dateStr + '_apt', aptCount);
      const [dsaQ, aptQ] = await Promise.all([
        Question.find({ difficulty: { $in: ['Easy', 'Medium'] } }).sort({ questionNumber: 1 }).skip(dsaIndex).limit(1).lean(),
        AptitudeQuestion.find({}).sort({ _id: 1 }).skip(aptIndex).limit(1).lean()
      ]);
      entry = {
        date: dateStr,
        dsaId: dsaQ[0]?._id,
        aptitudeId: aptQ[0]?._id,
        completedDsa: false,
        completedAptitude: false
      };
      user.dailyChallenges.push(entry);
    }

    const entryRef = user.dailyChallenges.find(d => d.date === dateStr);
    let bonusAwarded = false;

    if (type === 'dsa' && !entryRef.completedDsa) {
      entryRef.completedDsa = true;
      bonusAwarded = true;
    } else if (type === 'aptitude' && !entryRef.completedAptitude) {
      entryRef.completedAptitude = true;
      bonusAwarded = true;
    }

    if (bonusAwarded) {
      // Award +5 bonus points via dsaSolvedTotal-equivalent (use a separate field or just +5 to dsaSolvedTotal as bonus)
      user.dsaSolvedTotal = (user.dsaSolvedTotal || 0) + 5;
    }

    user.markModified('dailyChallenges');
    await user.save();

    const updatedEntry = user.dailyChallenges.find(d => d.date === dateStr);
    const completedCount = (updatedEntry.completedDsa ? 1 : 0) + (updatedEntry.completedAptitude ? 1 : 0);

    res.json({
      message: bonusAwarded ? '+5 bonus points awarded!' : 'Already completed',
      bonusAwarded,
      completion: updatedEntry,
      completedCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/daily/reveal-answer — reveal aptitude answer
router.post('/reveal-answer', protect, async (req, res) => {
  try {
    const dateStr = new Date().toISOString().split('T')[0];
    const [aptCount] = await Promise.all([AptitudeQuestion.countDocuments({})]);
    const aptIndex = hashDateToIndex(dateStr + '_apt', aptCount);
    const [aptQ] = await Promise.all([
      AptitudeQuestion.find({}).sort({ _id: 1 }).skip(aptIndex).limit(1).lean()
    ]);
    if (!aptQ.length) return res.status(404).json({ message: 'Question not found' });
    res.json({
      correctAnswer: aptQ[0].correctAnswer,
      explanation: aptQ[0].explanation
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/daily/history — user's challenge history (last 30 days)
router.get('/history', protect, async (req, res) => {
  try {
    const user = req.user;
    const challenges = user.dailyChallenges || [];

    // Build last-30-day grid
    const result = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = challenges.find(c => c.date === dateStr);
      result.push({
        date: dateStr,
        completedDsa: entry?.completedDsa || false,
        completedAptitude: entry?.completedAptitude || false,
        completed: (entry?.completedDsa && entry?.completedAptitude) || false
      });
    }

    // Compute current streak of full completions
    let streak = 0;
    for (let i = result.length - 1; i >= 0; i--) {
      if (result[i].completed) streak++;
      else break;
    }

    res.json({ history: result, streak });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
