const express = require('express');
const router = express.Router();
const CommunitySolution = require('../models/CommunitySolution');
const { protect } = require('../middleware/auth');

// GET /api/solutions/:questionId
router.get('/:questionId', protect, async (req, res) => {
  try {
    const { lang, sort = 'votes' } = req.query;
    const filter = { questionId: req.params.questionId };
    if (lang) filter.language = lang;
    const sortObj = sort === 'votes' ? { upvotes: -1 } : sort === 'newest' ? { createdAt: -1 } : { runtime: 1 };
    const solutions = await CommunitySolution.find(filter).sort(sortObj).limit(50);
    res.json({ solutions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/solutions/:questionId
router.post('/:questionId', protect, async (req, res) => {
  try {
    const { code, language, title, explanation, runtime, memory } = req.body;
    const sol = await CommunitySolution.create({
      questionId: req.params.questionId,
      userId: req.user._id,
      userName: req.user.name,
      college: req.user.college || '',
      code, language, title, explanation, runtime, memory
    });
    res.status(201).json({ solution: sol });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/solutions/:solutionId/upvote
router.put('/:solutionId/upvote', protect, async (req, res) => {
  try {
    const sol = await CommunitySolution.findById(req.params.solutionId);
    if (!sol) return res.status(404).json({ message: 'Not found' });
    const idx = sol.upvotedBy.indexOf(req.user._id);
    if (idx > -1) {
      sol.upvotedBy.splice(idx, 1);
      sol.upvotes = Math.max(0, sol.upvotes - 1);
    } else {
      sol.upvotedBy.push(req.user._id);
      sol.upvotes += 1;
    }
    await sol.save();
    res.json({ upvotes: sol.upvotes, upvoted: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
