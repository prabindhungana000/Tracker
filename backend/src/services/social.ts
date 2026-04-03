import prisma from '../lib/prisma';

/**
 * Social Service - Friends, challenges, and leaderboards
 */

export class SocialService {
  /**
   * Add a friend relationship
   */
  async addFriend(userId: string, friendId: string): Promise<boolean> {
    if (userId === friendId) {
      throw new Error('Cannot add yourself as a friend');
    }

    try {
      // Create bidirectional friendship
      await prisma.user.update({
        where: { id: userId },
        data: {
          friends: {
            connect: { id: friendId },
          },
        },
      });

      await prisma.user.update({
        where: { id: friendId },
        data: {
          friends: {
            connect: { id: userId },
          },
        },
      });

      return true;
    } catch (error) {
      console.error('Error adding friend:', error);
      return false;
    }
  }

  /**
   * Remove a friend relationship
   */
  async removeFriend(userId: string, friendId: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          friends: {
            disconnect: { id: friendId },
          },
        },
      });

      await prisma.user.update({
        where: { id: friendId },
        data: {
          friends: {
            disconnect: { id: userId },
          },
        },
      });

      return true;
    } catch (error) {
      console.error('Error removing friend:', error);
      return false;
    }
  }

  /**
   * Get user's friend list
   */
  async getFriends(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        friends: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                avatar: true,
                bio: true,
              },
            },
            level: true,
            totalFlavorScore: true,
            currentStreak: true,
          },
        },
      },
    });

    return user?.friends || [];
  }

  /**
   * Get leaderboards with multiple metrics
   */
  async getLeaderboards(metric: 'flavorScore' | 'streak' | 'meals' = 'flavorScore', limit = 50): Promise<any[]> {
    let result: any[] = [];

    if (metric === 'flavorScore') {
      result = await prisma.user.findMany({
        orderBy: { totalFlavorScore: 'desc' },
        take: limit,
        select: {
          id: true,
          username: true,
          totalFlavorScore: true,
          level: true,
          _count: {
            select: { meals: true }
          }
        },
      });
    } else if (metric === 'streak') {
      result = await prisma.user.findMany({
        orderBy: { currentStreak: 'desc' },
        take: limit,
        select: {
          id: true,
          username: true,
          level: true,
          currentStreak: true,
          longestStreak: true,
          totalFlavorScore: true,
          profile: {
            select: { avatar: true },
          },
        },
      });
    } else if (metric === 'meals') {
      const users = await prisma.user.findMany({
        take: limit,
        select: {
          id: true,
          username: true,
          level: true,
          totalFlavorScore: true,
          _count: {
            select: { meals: true },
          },
        },
      });

      result = users.sort((a: any, b: any) => b._count.meals - a._count.meals);
    }

    return result;
  }

  /**
   * Get friend's meal activity for social feed
   */
  async getFriendsActivity(userId: string, limit = 20) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        friends: {
          select: {
            id: true,
            meals: {
              orderBy: { createdAt: 'desc' },
              take: 5,
              select: {
                id: true,
                mealName: true,
                cuisineType: true,
                flavorScore: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!user) return [];

    // Flatten and sort by date
    const activity = user.friends
      .flatMap((friend: any) =>
        friend.meals.map((meal: any) => ({
          ...meal,
          friendId: friend.id,
          friendName: friend.id, // TODO: Add username
        }))
      )
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    return activity;
  }

  /**
   * Join a challenge
   */
  async joinChallenge(userId: string, challengeId: string): Promise<boolean> {
    try {
      await prisma.challengeParticipation.create({
        data: {
          userId,
          challengeId,
        },
      });
      return true;
    } catch (error) {
      console.error('Error joining challenge:', error);
      return false;
    }
  }

  /**
   * Update user's challenge score
   */
  async updateChallengeScore(userId: string, challengeId: string, score: number) {
    const participation = await prisma.challengeParticipation.update({
      where: {
        userId_challengeId: { userId, challengeId },
      },
      data: {
        score,
      },
    });

    // Recalculate ranking for this challenge
    await this.updateChallengeRankings(challengeId);

    return participation;
  }

  /**
   * Update rankings for a challenge
   */
  async updateChallengeRankings(challengeId: string) {
    const participants = await prisma.challengeParticipation.findMany({
      where: { challengeId },
      orderBy: { score: 'desc' },
    });

    // Update ranks
    for (let i = 0; i < participants.length; i++) {
      await prisma.challengeParticipation.update({
        where: { id: participants[i].id },
        data: { rank: i + 1 },
      });
    }
  }

  /**
   * Get challenge details with participants
   */
  async getChallenge(challengeId: string) {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        participants: {
          orderBy: { rank: 'asc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                level: true,
                profile: {
                  select: { avatar: true },
                },
              },
            },
          },
        },
      },
    });

    return challenge;
  }

  /**
   * Create new active challenge
   */
  async createChallenge(data: {
    name: string;
    description: string;
    type: string;
    theme?: string;
    metric: string;
    endDate: Date;
  }) {
    const challenge = await prisma.challenge.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        theme: data.theme,
        metric: data.metric,
        startDate: new Date(),
        endDate: data.endDate,
        isActive: true,
      },
    });

    return challenge;
  }

  /**
   * Get active challenges
   */
  async getActiveChallenges(limit = 10) {
    const now = new Date();
    const challenges = await prisma.challenge.findMany({
      where: {
        isActive: true,
        endDate: {
          gt: now,
        },
      },
      orderBy: { startDate: 'desc' },
      take: limit,
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });

    return challenges;
  }

  /**
   * Update leaderboard entry (called after meal logging)
   */
  async updateLeaderboardEntry(_userId: string) {
    // Leaderboard is now calculated dynamically from User model
    // No need to store separate leaderboard entries
    return;
  }
}

export const socialService = new SocialService();
