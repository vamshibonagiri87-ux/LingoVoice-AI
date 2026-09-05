import { io } from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://lingovoice-ai.onrender.com'
    : 'http://localhost:5000');

let socket = null;

export const getSocket = () => {
  if (!socket && typeof window !== 'undefined') {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('[Socket.IO Client] Connected to server:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket.IO Client] Disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.warn('[Socket.IO Client] Connection error:', error.message);
    });
  }
  return socket;
};

export const joinSessionRoom = (sessionId, userId) => {
  const s = getSocket();
  if (s && sessionId) {
    s.emit('join_session', { sessionId, userId });
  }
};

export const leaveSessionRoom = (sessionId) => {
  const s = getSocket();
  if (s && sessionId) {
    s.emit('leave_session', { sessionId });
  }
};

export const emitVoiceState = (sessionId, state) => {
  const s = getSocket();
  if (s && sessionId) {
    s.emit('voice_state', { sessionId, state });
  }
};
