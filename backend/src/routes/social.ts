import express from 'express';
import { socialService } from '../services/social';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

// ============= Friends =============

/**
 * GET /api/social/friends - Get user's friend list
 */
router.get('/friends', async (req, res) => {
  try {
    const { userId } = req.user as any;
    const friends = await socialService.getFriends(userId);
    res.json({ success: true, data: friends });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch friends' });
  }
});

/**
 * POST /api/social/friends/:id/add - Add friend
 */
router.post('/friends/:id/add', async (req, res) => {
  try {
    const { userId } = req.user as any;
    const { id: friendId } = req.params;

    const success = await socialService.addFriend(userId, friendId);
    res.json({
      success,
      message: success ? 'Friend added' : 'Failed to add friend',
    });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * DELETE /api/social/friends/:id - Remove friend
 */
router.delete('/friends/:id', async (req, res) => {
  try {
    const { userId } = req.user as any;
    const { id: friendId } = req.params;

    const success = await socialService.removeFriend(userId, friendId);
    res.json({
      success,
      message: success ? 'Friend removed' : 'Failed to remove friend',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove friend' });
  }
});

// ============= Leaderboards =============

/**
 * GET /api/social/leaderboard - Get leaderboard
 * Query: metric=flavorScore|streak|meals, limit=50
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const { metric = 'flavorScore', limit = 50 } = req.query;
    const leaderboard = await socialService.getLeaderboards(
      (metric as any) || 'flavorScore',
      parseInt(limit as string) || 50
    );
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
});

// ============= Activity Feed =============

/**
 * GET /api/social/activity - Get friends' recent activity
 */
router.get('/activity', async (req, res) => {
  try {
    const { userId } = req.user as any;
    const { limit = 20 } = req.query;

    const activity = await socialService.getFriendsActivity(
      userId,
      parseInt(limit as string) || 20
    );
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch activity' });
  }
});

// ============= Challenges =============

/**
 * GET /api/social/challenges - Get active challenges
 */
router.get('/challenges', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const challenges = await socialService.getActiveChallenges(
      parseInt(limit as string) || 10
    );
    res.json({ success: true, data: challenges });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch challenges' });
  }
});

/**
 * GET /api/social/challenges/:id - Get challenge details
 */
router.get('/challenges/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = await socialService.getChallenge(id);

    if (!challenge) {
      return res.status(404).json({ success: false, error: 'Challenge not found' });
    }

    res.json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch challenge' });
  }
});

/**
 * POST /api/social/challenges/:id/join - Join challenge
 */
router.post('/challenges/:id/join', async (req, res) => {
  try {
    const { userId } = req.user as any;
    const { id: challengeId } = req.params;

    const success = await socialService.joinChallenge(userId, challengeId);
    res.json({
      success,
      message: success ? 'Joined challenge' : 'Failed to join challenge',
    });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * POST /api/social/challenges/:id/score - Update challenge score
 */
router.post('/challenges/:id/score', async (req, res) => {
  try {
    const { userId } = req.user as any;
    const { id: challengeId } = req.params;
    const { score } = req.body;

    if (typeof score !== 'number') {
      return res.status(400).json({ success: false, error: 'Invalid score' });
    }

    const participation = await socialService.updateChallengeScore(
      userId,
      challengeId,
      score
    );

    res.json({ success: true, data: participation });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

export default router;
