const express = require('express');
const { getDbStatus } = require('../config/db');
const voiceService = require('../services/voiceService');
const tutorOrchestrator = require('../agents/tutorOrchestrator');
const config = require('../config/env');

const router = express.Router();

router.get('/', (req, res) => {
  const dbStatus = getDbStatus();
  const voiceHealth = voiceService.getVoiceHealth();
  const langGraph = tutorOrchestrator.getLangGraphStatus();

  const aiProvider = config.openRouterApiKey
    ? 'OpenRouter (Primary active)'
    : config.geminiApiKey
    ? 'Google Gemini (Fallback active)'
    : 'Deterministic Adaptive AI Engine (Configured)';

  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: {
      uptime: process.uptime(),
      nodeVersion: process.version,
      environment: config.nodeEnv
    },
    database: {
      status: dbStatus,
      connection: config.mongoUri ? 'MongoDB URI configured' : 'In-memory fallback'
    },
    aiProvider: {
      provider: aiProvider,
      langGraph
    },
    voiceProvider: voiceHealth
  });
});

module.exports = router;
