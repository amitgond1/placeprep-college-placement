const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String },
  questionNumber: { type: Number },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  topic: { type: String, required: true },
  topics: [{ type: String }],
  companies: [{ type: String }],
  frequency: { type: Number, default: 1 },
  acceptance: { type: Number, default: 50 },
  rounds: [{ type: String }],
  leetcodeLink: { type: String, default: '' },
  description: { type: String, default: '' },
  examples: [{
    input: { type: String },
    output: { type: String },
    explanation: { type: String }
  }],
  constraints: [{ type: String }],
  hints: [{ type: String }],
  similarQuestions: [{ type: String }],
  testCases: [{
    input: { type: String },
    output: { type: String },
    isHidden: { type: Boolean, default: false }
  }],
  starterCode: {
    cpp: { type: String, default: '' },
    java: { type: String, default: '' },
    python: { type: String, default: '' }
  },
  editorial: {
    approach1: {
      name: String,
      timeComplexity: String,
      spaceComplexity: String,
      explanation: String,
      code: { cpp: String, java: String, python: String }
    },
    approach2: {
      name: String,
      timeComplexity: String,
      spaceComplexity: String,
      explanation: String,
      code: { cpp: String, java: String, python: String }
    },
    companyNote: String,
    youtubeLink: String,
    striverLink: String
  },
  solution: {
    code: { type: String, default: '' },
    language: { type: String, default: 'cpp' },
    explanation: { type: String, default: '' },
    timeComplexity: { type: String, default: '' },
    spaceComplexity: { type: String, default: '' },
    followUpTips: { type: String, default: '' }
  },
  tags: [{ type: String }]
}, { timestamps: true });

questionSchema.index({ companies: 1, difficulty: 1, topic: 1 });

module.exports = mongoose.model('Question', questionSchema);
