const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const config = require('./config/env');
const { errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');
const practiceRoutes = require('./routes/practiceRoutes');
const progressRoutes = require('./routes/progressRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Security and performance middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      // Allow localhost dev servers or configured CLIENT_URL
      if (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin === config.clientUrl
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev mode
    },
    credentials: true
  })
);

app.use(compression());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    code: 'ROUTE_NOT_FOUND',
    error: `API route ${req.originalUrl} does not exist on this server`
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.json({
    message: 'LingoVoice AI API Server is running 🎙️',
    version: '1.0.0',
    healthCheck: '/api/health',
    documentation: 'See README.md for complete endpoint specifications'
  });
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
