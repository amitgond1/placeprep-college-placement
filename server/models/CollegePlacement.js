const mongoose = require('mongoose');

const collegePlacementSchema = new mongoose.Schema({
  college: { type: String, required: true, trim: true },
  company: { type: String, required: true },
  package: { type: Number, required: true },
  cgpaCutoff: { type: Number },
  rounds: { type: Number, default: 3 },
  testType: { type: String, default: '' },
  year: { type: Number, default: new Date().getFullYear() },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  verified: { type: Boolean, default: false },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('CollegePlacement', collegePlacementSchema);
