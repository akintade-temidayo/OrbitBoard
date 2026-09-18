// Minimal Express + Socket.IO server for local development.
//
// This is a lightweight companion backend for the OrbitBoard frontend. It
// exists so that `NEXT_PUBLIC_SOCKET_URL` (see src/context/SocketContext.jsx)
// has something to actually connect to during development. It is NOT meant
// to be a production backend — the app's data still comes from the mock
// services under src/services/. This server only handles the realtime
// (Socket.IO) layer: presence, and a simple chat message relay that mirrors
// the shape used by src/services/chatService.js.
//
// Run it with:
//   npm run server
// or, alongside `npm run dev`, with:
//   npm run dev:full

const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'orbitboard-socket-server' });
});

// Simple health-check endpoint so you can confirm the server is up without
// going through Socket.IO, e.g. `curl http://localhost:5000/health`.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

// Tracks which socket ids belong to which user, so a message sent to a
// userId can be relayed to every tab/device that user has open.
const userSockets = new Map(); // userId -> Set<socket.id>

io.use((socket, next) => {
  // The client sends { auth: { token } } — see SocketContext.jsx. There is
  // no real auth backend yet (the app uses mock login), so we just require
  // that some token was provided rather than validating it.
  const { token } = socket.handshake.auth || {};
  if (!token) {
    return next(new Error('Authentication error: missing token'));
  }
  socket.data.token = token;
  next();
});

io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  // Optional: client can identify which user it belongs to so we can route
  // direct messages, e.g. socket.emit('identify', { userId }).
  socket.on('identify', ({ userId } = {}) => {
    if (!userId) return;
    socket.data.userId = userId;
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);
    socket.join(`user:${userId}`);
  });

  // Chat message relay — mirrors chatService.sendMessage's shape.
  socket.on('chat:message', (message) => {
    const { conversationId, receiverId } = message || {};
    if (conversationId) {
      io.to(`conversation:${conversationId}`).emit('chat:message', message);
    }
    if (receiverId) {
      io.to(`user:${receiverId}`).emit('chat:message', message);
    }
  });

  socket.on('conversation:join', (conversationId) => {
    if (conversationId) socket.join(`conversation:${conversationId}`);
  });

  socket.on('conversation:leave', (conversationId) => {
    if (conversationId) socket.leave(`conversation:${conversationId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[socket] disconnected: ${socket.id}`);
    const { userId } = socket.data || {};
    if (userId && userSockets.has(userId)) {
      userSockets.get(userId).delete(socket.id);
      if (userSockets.get(userId).size === 0) {
        userSockets.delete(userId);
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`[server] OrbitBoard socket server listening on http://localhost:${PORT}`);
  console.log(`[server] Allowing CORS from ${CLIENT_ORIGIN}`);
});
