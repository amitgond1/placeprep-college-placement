const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://placeprep-college-placement.onrender.com',
  'https://placeprep-web.onrender.com'
];

const envAllowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];

// Middleware
app.use(cors({
  origin(origin, callback) {
    // Allow non-browser tools (curl/postman) and same-origin requests without Origin header.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/dsa', require('./routes/dsa'));
app.use('/api/mock', require('./routes/mock'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/college', require('./routes/college'));
app.use('/api/aptitude', require('./routes/aptitude'));
app.use('/api/solutions', require('./routes/solutions'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'PlacePrep API running' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/placeprep')
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`PlacePrep server running on port ${PORT}`);
      // Start cron jobs
      require('./services/cronJobs');
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
