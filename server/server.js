const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
