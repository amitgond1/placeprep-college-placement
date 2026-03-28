const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  googleId: { type: String },
  avatar: { type: String, default: '' },

  // Onboarding
  college: { type: String, default: '' },
  branch: { type: String, default: '' },
  graduationYear: { type: Number },
  targetPackage: { type: Number, default: 0 },
  targetCompanies: [{ type: String }],
  placementDate: { type: Date },
  dailyGoal: { type: Number, default: 3 },

  // Social
  linkedinUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  leetcodeUsername: { type: String, default: '' },
  leetcodeSolved: { type: Number, default: 0 },

  // Streak
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastSolvedDate: { type: Date },

  // DSA stats
  dsaSolvedTotal: { type: Number, default: 0 },
  dsaSolvedToday: { type: Number, default: 0 },
  dsaSolvedWeek: { type: Number, default: 0 },
  solvedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],

  // Email preferences
  emailReminders: { type: Boolean, default: true },
  weeklyReport: { type: Boolean, default: true },

  isOnboarded: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
