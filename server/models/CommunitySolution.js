const mongoose = require('mongoose');

const communitySolutionSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  college: { type: String, default: '' },
  title: { type: String, default: '' },
  code: { type: String, required: true },
  language: { type: String, enum: ['cpp', 'java', 'python'], default: 'cpp' },
  runtime: { type: Number },
  memory: { type: Number },
  explanation: { type: String, default: '' },
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('CommunitySolution', communitySolutionSchema);
