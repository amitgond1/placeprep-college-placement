const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  code: { type: String, required: true },
  language: { type: String, enum: ['cpp', 'java', 'python'], default: 'cpp' },
  status: { type: String, enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error', 'Runtime Error', 'Memory Limit Exceeded'], default: 'Wrong Answer' },
  runtime: { type: Number },
  memory: { type: Number },
  passedCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
  errorMessage: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
