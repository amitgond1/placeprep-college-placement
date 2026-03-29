const express = require('express');
const router = express.Router();
const multer = require('multer');
const ResumeData = require('../models/ResumeData');
const { protect } = require('../middleware/auth');
const { checkATS, optimizeResume } = require('../services/claudeService');

// multer — memory storage (no disk writes)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter(req, file, cb) {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only PDF, DOCX, or TXT files are allowed'));
  }
});

// GET /api/resume
router.get('/', protect, async (req, res) => {
  try {
    let resume = await ResumeData.findOne({ user: req.user._id });
    if (!resume) resume = await ResumeData.create({ user: req.user._id });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/resume  (save / upsert)
router.post('/', protect, async (req, res) => {
  try {
    const resume = await ResumeData.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/resume (full replace)
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

// POST /api/resume/parse-upload — extract text from uploaded PDF/DOCX/TXT
router.post('/parse-upload', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    let extractedText = '';
    const mime = req.file.mimetype;

    if (mime === 'application/pdf') {
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(req.file.buffer);
      extractedText = data.text;
    } else if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      extractedText = result.value;
    } else {
      // plain text
      extractedText = req.file.buffer.toString('utf-8');
    }

    extractedText = extractedText.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

    if (!extractedText || extractedText.length < 50) {
      return res.status(422).json({ message: 'Could not extract meaningful text from the file. Try a text-based PDF or DOCX.' });
    }

    res.json({ text: extractedText, filename: req.file.originalname, size: req.file.size });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to parse resume file' });
  }
});

// POST /api/resume/ats-check
router.post('/ats-check', protect, async (req, res) => {
  try {
    const { jobDescription, resume, resumeText } = req.body;

    if (!jobDescription) return res.status(400).json({ message: 'Job description is required' });

    // Build text from structured resume object or use raw resumeText
    let text = resumeText || '';
    if (!text && resume) {
      const p = resume.personal || {};
      const skillLines = (resume.skills || []).map(s => `${s.category}: ${s.items}`).join('\n');
      const projLines = (resume.projects || []).map(p => `${p.title}: ${p.tech} - ${p.description}`).join('\n');
      const expLines = (resume.experience || []).map(e => `${e.role} at ${e.company}: ${e.points}`).join('\n');
      const certLines = (resume.certifications || []).map(c => c.name).join(', ');
      text = [p.name, p.summary, skillLines, projLines, expLines, certLines].filter(Boolean).join('\n');
    }

    if (!text || text.length < 30) return res.status(400).json({ message: 'Resume content is too short to analyse' });

    const result = await checkATS(text, jobDescription);

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

    res.json(result);
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
