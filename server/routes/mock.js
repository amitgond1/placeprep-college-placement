const express = require('express');
const router = express.Router();
const multer = require('multer');
const MockSession = require('../models/MockSession');
const { protect } = require('../middleware/auth');
const { startMockInterview, evaluateAnswer, generateFinalReport } = require('../services/claudeService');
const { transcribeAudio } = require('../services/whisperService');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// POST /api/mock/start
router.post('/start', protect, async (req, res) => {
  try {
    const { company, roundType, difficulty, mode } = req.body;
    const firstQuestion = await startMockInterview(company, roundType, difficulty);

    const session = await MockSession.create({
      user: req.user._id,
      company, roundType, difficulty: difficulty || 'Medium', mode: mode || 'text',
      qaHistory: []
    });

    res.json({ sessionId: session._id, question: firstQuestion });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/mock/answer/:sessionId
router.post('/answer/:sessionId', protect, async (req, res) => {
  try {
    const { answer, questionIndex } = req.body;
    const session = await MockSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const currentQ = session.qaHistory[questionIndex];
    if (!currentQ) return res.status(400).json({ message: 'Question not found in session' });

    // Evaluate with Claude
    const evaluation = await evaluateAnswer(
      currentQ.question, answer, session.company, session.roundType
    );

    session.qaHistory[questionIndex].userAnswer = answer;
    session.qaHistory[questionIndex].score = evaluation.score;
    session.qaHistory[questionIndex].feedback = evaluation.feedback;
    session.qaHistory[questionIndex].idealAnswer = evaluation.idealAnswer;
    session.qaHistory[questionIndex].strengths = evaluation.strengths;
    session.qaHistory[questionIndex].improvements = evaluation.improvements;
    session.markModified('qaHistory');

    // Get next question if not at the end
    let nextQuestion = null;
    if (questionIndex < 9) {
      nextQuestion = await startMockInterview(
        session.company, session.roundType, session.difficulty,
        session.qaHistory.map(qa => qa.question)
      );
      session.qaHistory.push({ question: nextQuestion });
    }

    await session.save();
    res.json({ evaluation, nextQuestion, isComplete: questionIndex >= 9 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/mock/question/:sessionId
router.post('/question/:sessionId', protect, async (req, res) => {
  try {
    const session = await MockSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const question = await startMockInterview(
      session.company, session.roundType, session.difficulty,
      session.qaHistory.map(qa => qa.question)
    );
    session.qaHistory.push({ question });
    await session.save();

    res.json({ question, questionIndex: session.qaHistory.length - 1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/mock/complete/:sessionId
router.post('/complete/:sessionId', protect, async (req, res) => {
  try {
    const session = await MockSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const report = await generateFinalReport(session.qaHistory, session.company, session.roundType);

    session.overallScore = report.overallScore;
    session.strengths = report.strengths;
    session.improvements = report.improvements;
    session.recommendedTopics = report.recommendedTopics;
    session.completed = true;
    session.duration = req.body.duration || 0;
    await session.save();

    res.json({ report, session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/mock/transcribe
router.post('/transcribe', protect, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No audio file' });
    const transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);
    res.json({ transcript });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/mock/history
router.get('/history', protect, async (req, res) => {
  try {
    const sessions = await MockSession.find({ user: req.user._id, completed: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('company roundType overallScore difficulty mode createdAt duration');
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/mock/session/:sessionId
router.get('/session/:sessionId', protect, async (req, res) => {
  try {
    const session = await MockSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json({ session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
