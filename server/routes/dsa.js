const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { runCode } = require('../services/judge0Service');

const COMPANY_ALIASES = {
  Meta: ['Meta', 'Facebook'],
  Facebook: ['Meta', 'Facebook']
};

// GET /api/dsa/questions
router.get('/questions', protect, async (req, res) => {
  try {
    const { company, difficulty, topic, status, search, page = 1, limit = 100 } = req.query;
    const filter = {};
    if (company && company !== 'All') {
      const aliases = COMPANY_ALIASES[company] || [company];
      filter.companies = { $in: aliases };
    }
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;
    if (topic && topic !== 'All') filter.topic = topic;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const total = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .sort({ frequency: -1, questionNumber: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-solution -editorial -testCases -starterCode');

    const solvedIds = new Set(req.user.solvedQuestions.map(id => id.toString()));

    let questionsWithStatus = questions.map(q => ({
      ...q.toObject(),
      solved: solvedIds.has(q._id.toString())
    }));

    if (status === 'solved') questionsWithStatus = questionsWithStatus.filter(q => q.solved);
    if (status === 'unsolved') questionsWithStatus = questionsWithStatus.filter(q => !q.solved);

    res.json({ questions: questionsWithStatus, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/dsa/questions/random
router.get('/questions/random', protect, async (req, res) => {
  try {
    const { company, difficulty } = req.query;
    const filter = {};
    if (company && company !== 'All') {
      const aliases = COMPANY_ALIASES[company] || [company];
      filter.companies = { $in: aliases };
    }
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;
    const count = await Question.countDocuments(filter);
    const rand = Math.floor(Math.random() * count);
    const q = await Question.findOne(filter).skip(rand).select('_id');
    res.json({ questionId: q?._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/dsa/questions/:id
router.get('/questions/:id', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    const isSolved = req.user.solvedQuestions.map(id => id.toString()).includes(req.params.id);
    // Only send sample test cases (not hidden) to frontend
    const q = question.toObject();
    q.testCases = q.testCases?.filter(tc => !tc.isHidden) || [];
    res.json({ question: { ...q, solved: isSolved } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/dsa/submissions/:questionId
router.get('/submissions/:questionId', protect, async (req, res) => {
  try {
    const subs = await Submission.find({ userId: req.user._id, questionId: req.params.questionId })
      .sort({ createdAt: -1 }).limit(20);
    res.json({ submissions: subs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/dsa/run/:id  — run against a single test case
router.post('/run/:id', protect, async (req, res) => {
  try {
    const { code, language, customInput } = req.body;
    const question = await Question.findById(req.params.id).select('testCases title');
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const sampleCase = question.testCases?.find(tc => !tc.isHidden);
    const stdin = customInput !== undefined ? customInput : (sampleCase?.input || '');
    const expectedOutput = sampleCase?.output || '';

    const result = await runCode({ code, language, stdin, expectedOutput });

    res.json({
      ...result,
      input: stdin,
      expectedOutput,
      outputMatch: result.stdout?.trim() === expectedOutput?.trim()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/dsa/submit/:id  — run against all test cases
router.post('/submit/:id', protect, async (req, res) => {
  try {
    const { code, language } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const testCases = question.testCases || [];
    if (testCases.length === 0) {
      return res.status(400).json({
        message: 'No test cases are configured for this problem yet. Please try another question.'
      });
    }

    let passedCount = 0;
    let firstFailed = null;
    let totalTime = 0;
    let maxMemory = 0;
    let compilationError = null;

    for (const tc of testCases) {
      const result = await runCode({ code, language, stdin: tc.input, expectedOutput: tc.output });

      if (result.compileError) {
        compilationError = result.compileOutput || result.stderr;
        break;
      }

      totalTime = Math.max(totalTime, result.time * 1000);
      maxMemory = Math.max(maxMemory, result.memory);

      const passed = result.accepted || result.stdout?.trim() === tc.output?.trim();
      if (passed) {
        passedCount++;
      } else if (!firstFailed) {
        firstFailed = {
          input: tc.input,
          expectedOutput: tc.output,
          actualOutput: result.stdout,
          statusDesc: result.statusDesc,
          stderr: result.stderr,
          tle: result.tle,
          runtimeError: result.runtimeError
        };
      }
    }

    const allPassed = !compilationError && passedCount === testCases.length;

    // Determine status string
    let statusStr = 'Wrong Answer';
    if (compilationError) statusStr = 'Compilation Error';
    else if (firstFailed?.tle) statusStr = 'Time Limit Exceeded';
    else if (firstFailed?.runtimeError) statusStr = 'Runtime Error';
    else if (allPassed) statusStr = 'Accepted';

    // Save submission
    const submission = await Submission.create({
      userId: req.user._id,
      questionId: req.params.id,
      code, language,
      status: statusStr,
      runtime: Math.round(totalTime),
      memory: Math.round(maxMemory / 1024),
      passedCount,
      totalCount: testCases.length,
      errorMessage: compilationError || firstFailed?.stderr || ''
    });

    // Update user stats on first accepted
    if (allPassed) {
      const user = await User.findById(req.user._id);
      if (!user.solvedQuestions.map(id => id.toString()).includes(req.params.id)) {
        user.solvedQuestions.push(req.params.id);
        user.dsaSolvedTotal += 1;
        user.dsaSolvedToday += 1;
        user.dsaSolvedWeek += 1;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const lastDate = user.lastSolvedDate ? new Date(user.lastSolvedDate) : null;
        if (lastDate) {
          lastDate.setHours(0, 0, 0, 0);
          const diff = (today - lastDate) / (1000 * 60 * 60 * 24);
          if (diff === 1) user.currentStreak += 1;
          else if (diff > 1) user.currentStreak = 1;
        } else {
          user.currentStreak = 1;
        }
        user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
        user.lastSolvedDate = new Date();
        await user.save();
      }
    }

    // Calculate fake "beats" percentile
    const beatsPct = allPassed ? (50 + Math.floor(Math.random() * 45)).toFixed(1) : null;

    res.json({
      allPassed,
      passedCount,
      totalCount: testCases.length,
      compilationError,
      firstFailed,
      runtime: Math.round(totalTime),
      memory: Math.round(maxMemory / 1024),
      beatsPct,
      streak: allPassed ? (await User.findById(req.user._id).select('currentStreak')).currentStreak : null,
      submissionId: submission._id,
      status: statusStr
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/dsa/mark-solved/:id
router.post('/mark-solved/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.solvedQuestions.map(id => id.toString()).includes(req.params.id)) {
      user.solvedQuestions.push(req.params.id);
      user.dsaSolvedTotal += 1;
      user.dsaSolvedToday += 1;
      user.dsaSolvedWeek += 1;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const lastDate = user.lastSolvedDate ? new Date(user.lastSolvedDate) : null;
      if (lastDate) {
        lastDate.setHours(0, 0, 0, 0);
        const diff = (today - lastDate) / (1000 * 60 * 60 * 24);
        if (diff === 1) user.currentStreak += 1;
        else if (diff > 1) user.currentStreak = 1;
      } else {
        user.currentStreak = 1;
      }
      user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
      user.lastSolvedDate = new Date();
      await user.save();
    }
    res.json({ message: 'Marked as solved', streak: user.currentStreak });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/dsa/topics
router.get('/topics', protect, async (req, res) => {
  try {
    const topics = await Question.distinct('topic');
    res.json({ topics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/dsa/company-stats
router.get('/company-stats', protect, async (req, res) => {
  try {
    const stats = await Question.aggregate([
      { $unwind: '$companies' },
      {
        $project: {
          normalizedCompany: {
            $cond: [{ $eq: ['$companies', 'Facebook'] }, 'Meta', '$companies']
          }
        }
      },
      { $group: { _id: '$normalizedCompany', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
