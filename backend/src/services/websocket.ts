/**
 * WebSocket handlers for real-time social features
 */

export type SocketEvents = {
  'meal-logged': { userId: string; mealName: string; flavorScore: number };
  'challenge-update': { challengeId: string; userId: string; score: number };
  'friend-joined': { userId: string; username: string };
  'achievement-unlocked': { userId: string; title: string; icon: string };
  'challenge-started': { challengeId: string; name: string };
  'leaderboard-update': { metric: string; rank: number };
};

export const socketHandlers = {
  /**
   * When a meal is logged, notify friends
   */
  emitMealLogged: (io: any, userId: string, mealName: string, flavorScore: number) => {
    io.emit('meal-logged', {
      userId,
      mealName,
      flavorScore,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * When challenge score updates
   */
  emitChallengeUpdate: (io: any, challengeId: string, userId: string, score: number) => {
    io.to(`challenge:${challengeId}`).emit('challenge-update', {
      challengeId,
      userId,
      score,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * When user gets achievement
   */
  emitAchievementUnlocked: (io: any, userId: string, title: string, icon: string) => {
    io.emit('achievement-unlocked', {
      userId,
      title,
      icon,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * New challenge created
   */
  emitChallengeStarted: (io: any, challengeId: string, name: string) => {
    io.emit('challenge-started', {
      challengeId,
      name,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Leaderboard position changed
   */
  emitLeaderboardUpdate: (io: any, userId: string, metric: string, rank: number) => {
    io.emit('leaderboard-update', {
      userId,
      metric,
      rank,
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * Socket.io connection setup for real-time features
 */
export function setupSocketHandlers(socket: any, io: any) {
  // Join user-specific room for notifications
  socket.on('user:join', (userId: string) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} connected to real-time updates`);
  });

  // Join challenge room for live competition updates
  socket.on('challenge:join', (challengeId: string) => {
    socket.join(`challenge:${challengeId}`);
    console.log(`Socket ${socket.id} joined challenge ${challengeId}`);
  });

  // Leave challenge
  socket.on('challenge:leave', (challengeId: string) => {
    socket.leave(`challenge:${challengeId}`);
  });

  // Meal update
  socket.on('meal:logged', (data: any) => {
    socketHandlers.emitMealLogged(
      io,
      data.userId,
      data.mealName,
      data.flavorScore
    );
  });

  // Challenge score update
  socket.on('challenge:scoreUpdate', (data: any) => {
    socketHandlers.emitChallengeUpdate(
      io,
      data.challengeId,
      data.userId,
      data.score
    );
  });

  // Disconnection
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
}
