const mongoose = require('mongoose');

const aptitudeMockResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mockId: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, default: 25 },
  timeTaken: { type: Number, default: 0 },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AptitudeQuestion' },
    userAnswer: String,
    isCorrect: Boolean,
    timeTaken: Number,
    flagged: { type: Boolean, default: false }
  }],
  topicBreakdown: { type: Map, of: Object },
  percentile: { type: Number, default: 0 },
  negativeMarking: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('AptitudeMockResult', aptitudeMockResultSchema);
