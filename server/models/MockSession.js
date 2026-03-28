const mongoose = require('mongoose');

const qaSchema = new mongoose.Schema({
  question: String,
  userAnswer: String,
  score: { type: Number, min: 0, max: 10 },
  feedback: String,
  idealAnswer: String,
  strengths: [String],
  improvements: [String]
});

const mockSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  roundType: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  mode: { type: String, enum: ['text', 'voice'], default: 'text' },
  qaHistory: [qaSchema],
  overallScore: { type: Number, min: 0, max: 100 },
  strengths: [String],
  improvements: [String],
  recommendedTopics: [String],
  duration: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('MockSession', mockSessionSchema);
