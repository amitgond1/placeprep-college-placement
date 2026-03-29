const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  questions: [{ type: String }]
}, { _id: false });

const interviewExperienceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userCollege: { type: String, default: '' },
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  package: { type: String, default: '' },
  year: { type: Number, required: true },
  rounds: [roundSchema],
  verdict: { type: String, enum: ['Selected', 'Rejected', 'Pending'], default: 'Pending' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  tips: { type: String, default: '' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  isAnonymous: { type: Boolean, default: false }
}, { timestamps: true });

interviewExperienceSchema.index({ company: 1, year: -1, verdict: 1 });
interviewExperienceSchema.index({ userId: 1 });

module.exports = mongoose.model('InterviewExperience', interviewExperienceSchema);
