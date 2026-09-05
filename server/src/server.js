const http = require('http');
const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/db');
const { initSocket } = require('./config/socket');
const scenarioService = require('./services/scenarioService');

const startServer = async () => {
  try {
    // 1. Connect to Database (with auto in-memory fallback)
    await connectDB();

    // 2. Seed default learning scenarios if empty
    await scenarioService.seedDefaultScenarios();

    // 3. Create HTTP server & attach Socket.IO
    const httpServer = http.createServer(app);
    initSocket(httpServer, config.clientUrl);

    // 4. Listen on PORT
    const PORT = config.port || 5000;
    httpServer.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🎙️  LingoVoice AI Server is listening on port ${PORT}`);
      console.log(`🌐  API Base URL: http://localhost:${PORT}/api`);
      console.log(`🏥  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🔌  Socket.IO: Ready for real-time tutoring events`);
      console.log(`⚙️   Environment: ${config.nodeEnv}`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error(`[Server Fatal Error] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
