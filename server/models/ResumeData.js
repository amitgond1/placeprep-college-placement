const mongoose = require('mongoose');

const resumeDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    portfolio: String
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    startYear: String,
    endYear: String,
    cgpa: String
  }],
  skills: {
    technical: [String],
    languages: [String],
    frameworks: [String],
    tools: [String],
    soft: [String]
  },
  projects: [{
    name: String,
    description: String,
    techStack: [String],
    githubLink: String,
    liveLink: String,
    highlights: [String]
  }],
  experience: [{
    company: String,
    role: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String,
    highlights: [String]
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    link: String
  }],
  achievements: [String],
  atsScores: [{
    score: Number,
    jobDescription: String,
    matchedKeywords: [String],
    missingKeywords: [String],
    feedback: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ResumeData', resumeDataSchema);
