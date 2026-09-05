const { Server } = require('socket.io');

let io = null;

const initSocket = (httpServer, clientUrl) => {
  io = new Server(httpServer, {
    cors: {
      origin: clientUrl || '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join session room
    socket.on('join_session', ({ sessionId, userId }) => {
      if (sessionId) {
        socket.join(`session_${sessionId}`);
        console.log(`[Socket] Client ${socket.id} joined session_${sessionId}`);
      }
    });

    // Leave session room
    socket.on('leave_session', ({ sessionId }) => {
      if (sessionId) {
        socket.leave(`session_${sessionId}`);
        console.log(`[Socket] Client ${socket.id} left session_${sessionId}`);
      }
    });

    // Client voice state broadcast
    socket.on('voice_state', ({ sessionId, state }) => {
      if (sessionId) {
        socket.to(`session_${sessionId}`).emit('peer_voice_state', { sessionId, state, socketId: socket.id });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  return io;
};

const emitSessionEvent = (sessionId, eventName, payload) => {
  if (io && sessionId) {
    io.to(`session_${sessionId}`).emit(eventName, payload);
  }
};

module.exports = { initSocket, getIO, emitSessionEvent };
