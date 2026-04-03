import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth';
import socialRoutes from './routes/social';
import trackerRoutes from './routes/tracker';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes (to be implemented)
app.get('/api', (req, res) => {
  res.json({
    message: 'FoodJourney API Server',
    version: '0.1.0',
    endpoints: {
      auth: '/api/auth',
      tracker: '/api/tracker',
      meals: '/api/meals',
      quests: '/api/quests',
      achievements: '/api/achievements',
      challenges: '/api/challenges',
      user: '/api/user',
      social: '/api/social',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/social', socialRoutes);

// Socket.io Real-time Features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('challenge-update', (data) => {
    io.emit('challenge-update', data);
  });

  socket.on('friend-activity', (data) => {
    io.emit('friend-activity', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error Handling
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 FoodJourney API running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
});
