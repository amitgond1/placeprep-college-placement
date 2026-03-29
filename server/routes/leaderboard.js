const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AptitudeMockResult = require('../models/AptitudeMockResult');
const { protect } = require('../middleware/auth');

function computeScore(user, bestMockScore) {
  return (user.dsaSolvedTotal || 0) * 10 +
    (user.currentStreak || 0) * 5 +
    (bestMockScore || 0) * 2;
}

// GET /api/leaderboard?type=overall&college=&limit=50
router.get('/', protect, async (req, res) => {
  try {
    const { type = 'overall', limit = 50 } = req.query;
    const parsedLimit = Math.min(parseInt(limit) || 50, 100);

    const filter = { isOnboarded: true };
    if (type === 'college') {
      const userCollege = req.user.college;
      if (!userCollege) return res.json({ users: [], total: 0 });
      filter.college = userCollege;
    }

    const users = await User.find(filter)
      .select('name college dsaSolvedTotal currentStreak longestStreak createdAt')
      .lean();

    // Fetch best mock scores for all users
    const userIds = users.map(u => u._id);
    const mockResults = await AptitudeMockResult.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', bestScore: { $max: { $cond: [{ $gt: ['$totalQuestions', 0] }, { $multiply: [{ $divide: ['$score', '$totalQuestions'] }, 100] }, 0] } } } }
    ]);
    const mockScoreMap = {};
    mockResults.forEach(r => { mockScoreMap[r._id.toString()] = r.bestScore || 0; });

    // Compute scores and sort
    const ranked = users
      .map(u => ({
        _id: u._id,
        name: u.name,
        college: u.college || 'Unknown',
        dsaSolvedTotal: u.dsaSolvedTotal || 0,
        currentStreak: u.currentStreak || 0,
        longestStreak: u.longestStreak || 0,
        aptitudeMocksBest: mockScoreMap[u._id.toString()] || 0,
        score: computeScore(u, mockScoreMap[u._id.toString()] || 0),
        initials: u.name ? u.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) : '?'
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, parsedLimit)
      .map((u, idx) => ({ ...u, rank: idx + 1 }));

    res.json({ users: ranked, total: users.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/leaderboard/my-rank — current user's rank
router.get('/my-rank', protect, async (req, res) => {
  try {
    const allUsers = await User.find({ isOnboarded: true })
      .select('name college dsaSolvedTotal currentStreak')
      .lean();

    const mockResults = await AptitudeMockResult.aggregate([
      { $match: { userId: { $in: allUsers.map(u => u._id) } } },
      { $group: { _id: '$userId', bestScore: { $max: { $cond: [{ $gt: ['$totalQuestions', 0] }, { $multiply: [{ $divide: ['$score', '$totalQuestions'] }, 100] }, 0] } } } }
    ]);
    const mockScoreMap = {};
    mockResults.forEach(r => { mockScoreMap[r._id.toString()] = r.bestScore || 0; });

    const sorted = allUsers
      .map(u => ({
        _id: u._id.toString(),
        score: computeScore(u, mockScoreMap[u._id.toString()] || 0)
      }))
      .sort((a, b) => b.score - a.score);

    const myIndex = sorted.findIndex(u => u._id === req.user._id.toString());
    const myRank = myIndex === -1 ? null : myIndex + 1;
    const myScore = myIndex === -1 ? 0 : sorted[myIndex].score;

    // College rank
    const collegeUsers = allUsers.filter(u => u.college === req.user.college);
    const collegeSorted = collegeUsers
      .map(u => ({
        _id: u._id.toString(),
        score: computeScore(u, mockScoreMap[u._id.toString()] || 0)
      }))
      .sort((a, b) => b.score - a.score);
    const myCollegeIndex = collegeSorted.findIndex(u => u._id === req.user._id.toString());
    const myCollegeRank = myCollegeIndex === -1 ? null : myCollegeIndex + 1;

    res.json({
      overallRank: myRank,
      collegeRank: myCollegeRank,
      totalUsers: allUsers.length,
      totalCollegeUsers: collegeUsers.length,
      score: myScore,
      dsaSolvedTotal: req.user.dsaSolvedTotal || 0,
      currentStreak: req.user.currentStreak || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
