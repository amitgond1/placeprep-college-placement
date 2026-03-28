const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema({
  mockId: { type: String, required: true, index: true },
  questionText: { type: String, required: true },
  options: { type: [String], required: true, validate: v => v.length === 4 },
  correctAnswer: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  explanation: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  companyTag: [{ type: String }],
  avgTimeSeconds: { type: Number, default: 60 },
  mockType: { type: String, default: 'general' }
}, { timestamps: true });

module.exports = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);
