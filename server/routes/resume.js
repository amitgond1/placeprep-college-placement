const express = require('express');
const router = express.Router();
const ResumeData = require('../models/ResumeData');
const { protect } = require('../middleware/auth');
const { checkATS, optimizeResume } = require('../services/claudeService');

// GET /api/resume
router.get('/', protect, async (req, res) => {
  try {
    let resume = await ResumeData.findOne({ user: req.user._id });
    if (!resume) resume = await ResumeData.create({ user: req.user._id });
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/resume
router.put('/', protect, async (req, res) => {
  try {
    const resume = await ResumeData.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, upsert: true }
    );
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/resume/ats-check
router.post('/ats-check', protect, async (req, res) => {
  try {
    const { jobDescription, resumeText } = req.body;
    if (!jobDescription || !resumeText)
      return res.status(400).json({ message: 'Job description and resume text required' });

    const result = await checkATS(resumeText, jobDescription);

    // Save to history
    await ResumeData.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: {
          atsScores: {
            score: result.score,
            jobDescription: jobDescription.substring(0, 500),
            matchedKeywords: result.matchedKeywords,
            missingKeywords: result.missingKeywords,
            feedback: result.sectionFeedback
          }
        }
      },
      { upsert: true }
    );

    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/resume/optimize
router.post('/optimize', protect, async (req, res) => {
  try {
    const { resumeText, company, jobDescription } = req.body;
    const optimized = await optimizeResume(resumeText, company, jobDescription);
    res.json({ optimized });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
