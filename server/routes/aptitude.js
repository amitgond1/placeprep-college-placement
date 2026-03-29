const express = require('express');
const router = express.Router();
const AptitudeQuestion = require('../models/AptitudeQuestion');
const AptitudeMockResult = require('../models/AptitudeMockResult');
const { protect } = require('../middleware/auth');
const { solveAptitudeDoubt } = require('../services/claudeService');

// GET /api/aptitude/mocks — list all mock test metadata
router.get('/mocks', protect, async (req, res) => {
  try {
    const mockIds = await AptitudeQuestion.distinct('mockId');
    const mocks = mockIds.map(id => {
      const parts = id.split('_');
      const company = parts[1]?.toUpperCase();
      const num = parts[2];
      return {
        mockId: id,
        company: company === 'GENERAL' ? 'General' : company,
        title: `${company === 'GENERAL' ? 'General Aptitude' : company} Mock ${num}`,
        questions: 25,
        duration: ['TCS', 'INFOSYS', 'WIPRO'].includes(company) ? 40 : 30,
        type: id.includes('tcs') ? 'TCS NQT' :
              id.includes('wipro') || id.includes('infosys') ? 'Wipro/Infosys' :
              id.includes('cognizant') ? 'Cognizant GenC' :
              id.includes('accenture') ? 'Accenture Cognitive' :
              id.includes('capgemini') ? 'Capgemini' : 'General'
      };
    });
    res.json({ mocks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/aptitude/mock/:mockId/questions
router.get('/mock/:mockId/questions', protect, async (req, res) => {
  try {
    const questions = await AptitudeQuestion.find({ mockId: req.params.mockId })
      .select('-correctAnswer -explanation')
      .limit(25);
    if (!questions.length) return res.status(404).json({ message: 'Mock not found' });
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/aptitude/mock/:mockId/submit
router.post('/mock/:mockId/submit', protect, async (req, res) => {
  try {
    const { answers, timeTaken, negativeMarking } = req.body;
    const questions = await AptitudeQuestion.find({ mockId: req.params.mockId }).limit(25);

    if (!questions.length) return res.status(404).json({ message: 'Mock not found' });

    let score = 0;
    const evaluated = [];
    const topicMap = {};

    questions.forEach((q, i) => {
      const userAns = answers[q._id.toString()];
      const isCorrect = userAns === q.correctAnswer;
      if (isCorrect) {
        score++;
      } else if (negativeMarking && userAns) {
        score -= 0.25;
      }

      if (!topicMap[q.topic]) topicMap[q.topic] = { correct: 0, total: 0 };
      topicMap[q.topic].total++;
      if (isCorrect) topicMap[q.topic].correct++;

      evaluated.push({
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        userAnswer: userAns || null,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isCorrect,
        topic: q.topic,
        difficulty: q.difficulty,
        avgTimeSeconds: q.avgTimeSeconds,
        timeTaken: req.body.questionTimes?.[q._id.toString()] || 0
      });
    });

    // Get all scores for percentile
    const allResults = await AptitudeMockResult.find({ mockId: req.params.mockId }).select('score');
    const totalScores = allResults.map(r => r.score);
    const below = totalScores.filter(s => s < score).length;
    const percentile = totalScores.length > 0
      ? Math.round((below / totalScores.length) * 100) : 50;

    // Detect weak topics
    const weakTopics = Object.entries(topicMap)
      .filter(([, v]) => v.total > 0 && (v.correct / v.total) < 0.5)
      .map(([topic]) => topic);

    const result = await AptitudeMockResult.create({
      userId: req.user._id,
      mockId: req.params.mockId,
      score: Math.max(0, score),
      totalQuestions: questions.length,
      timeTaken,
      answers: evaluated.map(e => ({
        questionId: e.questionId,
        userAnswer: e.userAnswer,
        isCorrect: e.isCorrect,
        timeTaken: e.timeTaken
      })),
      topicBreakdown: topicMap,
      percentile,
      negativeMarking: !!negativeMarking
    });

    res.json({
      resultId: result._id,
      score: Math.max(0, score),
      totalQuestions: questions.length,
      accuracy: Math.round((score / questions.length) * 100),
      percentile,
      topicBreakdown: topicMap,
      weakTopics,
      evaluated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/aptitude/results
router.get('/results', protect, async (req, res) => {
  try {
    const results = await AptitudeMockResult.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('mockId score totalQuestions timeTaken percentile createdAt topicBreakdown');
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/aptitude/results/:id
router.get('/results/:id', protect, async (req, res) => {
  try {
    const result = await AptitudeMockResult.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('answers.questionId')
      .lean();
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/aptitude/drill
router.get('/drill', protect, async (req, res) => {
  try {
    const { topic, difficulty, count = 10 } = req.query;
    const filter = {};
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await AptitudeQuestion.aggregate([
      { $match: filter },
      { $sample: { size: Number(count) } },
      { $project: { correctAnswer: 0, explanation: 0 } }
    ]);
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/aptitude/drill/check
router.post('/drill/check', protect, async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;
    const question = await AptitudeQuestion.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const isCorrect = userAnswer === question.correctAnswer;
    res.json({
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/aptitude/doubt
router.post('/doubt', protect, async (req, res) => {
  try {
    const { questionText, explanation, userQuery, language } = req.body;
    const response = await solveAptitudeDoubt(questionText, explanation, userQuery, language);
    res.json({ response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/aptitude/topics
router.get('/topics', protect, async (req, res) => {
  try {
    const topics = await AptitudeQuestion.distinct('topic');
    res.json({ topics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/aptitude/pyq?company=TCS&section=quant&limit=20
router.get('/pyq', protect, async (req, res) => {
  try {
    const { company, section, limit = 20 } = req.query;
    const filter = { isPYQ: true };
    if (company && company !== 'All') filter.companyTag = company;
    if (section && section !== 'all') filter.section = section;
    const questions = await AptitudeQuestion.find(filter)
      .sort({ year: -1, companyTag: 1 })
      .limit(Number(limit));
    res.json({ questions, total: await AptitudeQuestion.countDocuments(filter) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/aptitude/pyq-companies — list companies that have PYQ
router.get('/pyq-companies', protect, async (req, res) => {
  try {
    const companies = await AptitudeQuestion.distinct('companyTag', { isPYQ: true });
    res.json({ companies: [...new Set(companies)].sort() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
