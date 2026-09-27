const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('./logger');

let io;

function initSocketIO(server) {
  io = new Server(server, {
    cors: { origin: process.env.CORS_ORIGIN || '*' },
    pingTimeout: parseInt(process.env.SOCKET_IO_PING_TIMEOUT) || 5000,
    pingInterval: parseInt(process.env.SOCKET_IO_PING_INTERVAL) || 10000,
  });

  // JWT auth for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id} (user: ${socket.user.sub})`);

    // Join a team room to receive team-scoped events
    socket.on('join:team', (teamId) => {
      socket.join(`team:${teamId}`);
    });

    socket.on('leave:team', (teamId) => {
      socket.leave(`team:${teamId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

function emitToTeam(teamId, event, data) {
  if (!io) return;
  io.to(`team:${teamId}`).emit(event, data);
}

module.exports = { initSocketIO, emitToTeam };
