const express = require('express');
const router = express.Router();
const InterviewExperience = require('../models/InterviewExperience');
const { protect } = require('../middleware/auth');

// GET /api/experiences?company=&year=&verdict=&page=1&limit=10
router.get('/', protect, async (req, res) => {
  try {
    const { company, year, verdict, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (company && company !== 'All') filter.company = { $regex: company, $options: 'i' };
    if (year) filter.year = parseInt(year);
    if (verdict && verdict !== 'All') filter.verdict = verdict;

    const total = await InterviewExperience.countDocuments(filter);
    const experiences = await InterviewExperience.find(filter)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    // Mask user info for anonymous posts
    const sanitized = experiences.map(exp => ({
      ...exp,
      userName: exp.isAnonymous ? 'Anonymous' : exp.userName,
      userCollege: exp.isAnonymous ? '' : exp.userCollege,
      likeCount: exp.likes?.length || 0,
      likedByMe: exp.likes?.some(id => id.toString() === req.user._id.toString()) || false,
      likes: undefined
    }));

    res.json({ experiences: sanitized, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/experiences — create new experience
router.post('/', protect, async (req, res) => {
  try {
    const { company, role, package: pkg, year, rounds, verdict, difficulty, tips, isAnonymous } = req.body;

    if (!company || !role || !year) {
      return res.status(400).json({ message: 'company, role and year are required' });
    }

    const exp = await InterviewExperience.create({
      userId: req.user._id,
      userName: req.user.name,
      userCollege: req.user.college || '',
      company,
      role,
      package: pkg || '',
      year: parseInt(year),
      rounds: rounds || [],
      verdict: verdict || 'Pending',
      difficulty: difficulty || 'Medium',
      tips: tips || '',
      isAnonymous: isAnonymous || false
    });

    res.status(201).json({ experience: exp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/experiences/:id — get single experience
router.get('/:id', protect, async (req, res) => {
  try {
    const exp = await InterviewExperience.findById(req.params.id).lean();
    if (!exp) return res.status(404).json({ message: 'Experience not found' });

    // Increment views
    await InterviewExperience.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    const sanitized = {
      ...exp,
      userName: exp.isAnonymous ? 'Anonymous' : exp.userName,
      userCollege: exp.isAnonymous ? '' : exp.userCollege,
      likeCount: exp.likes?.length || 0,
      likedByMe: exp.likes?.some(id => id.toString() === req.user._id.toString()) || false,
      likes: undefined
    };

    res.json({ experience: sanitized });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/experiences/:id/like — toggle like
router.put('/:id/like', protect, async (req, res) => {
  try {
    const exp = await InterviewExperience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Experience not found' });

    const userId = req.user._id;
    const liked = exp.likes.some(id => id.toString() === userId.toString());

    if (liked) {
      exp.likes = exp.likes.filter(id => id.toString() !== userId.toString());
    } else {
      exp.likes.push(userId);
    }
    await exp.save();

    res.json({ liked: !liked, likeCount: exp.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/experiences/:id — own experience only
router.delete('/:id', protect, async (req, res) => {
  try {
    const exp = await InterviewExperience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Experience not found' });
    if (exp.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this experience' });
    }
    await exp.deleteOne();
    res.json({ message: 'Experience deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
