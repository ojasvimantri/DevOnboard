require('dotenv').config();
const http = require('http');
const { createApp } = require('./app');
const { initDatabase } = require('./config/database');
const { initRedis } = require('./config/redis');
const { initSocketIO } = require('./config/socket');
const logger = require('./config/logger');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

async function start() {
  try {
    // Connect to PostgreSQL
    await initDatabase();
    logger.info('Database connection established');

    // Connect to Redis
    await initRedis();
    logger.info('Redis connection established');

    // Create Express app
    const app = createApp();

    // Attach HTTP server and Socket.io
    const server = http.createServer(app);
    initSocketIO(server);

    server.listen(PORT, HOST, () => {
      logger.info(`TaskFlow API running at http://${HOST}:${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received — shutting down gracefully');
      server.close(() => process.exit(0));
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
