import express from 'express';
import { z } from 'zod';

import prisma from '../lib/prisma';
import {
  authMiddleware,
  type AuthTokenPayload,
} from '../middleware/auth';

const router = express.Router();

const mealEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  calories: z.number().nonnegative(),
  meal: z.string().min(1),
  time: z.string().min(1),
  source: z.enum(['catalog', 'manual']),
});

const burnEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  calories: z.number().nonnegative(),
  minutes: z.number().nonnegative(),
  note: z.string().nullable().optional(),
});

const trackerPayloadSchema = z.object({
  goal: z.number().int().nonnegative().nullable(),
  burnGoal: z.number().int().nonnegative().nullable(),
  weightKg: z.number().nonnegative(),
  meals: z.array(mealEntrySchema),
  burns: z.array(burnEntrySchema),
});

const DEFAULT_TRACKER_STATE = {
  goal: 2200,
  burnGoal: 450,
  weightKg: 70,
  meals: [
    {
      id: 'm1',
      name: 'Oats and banana',
      calories: 420,
      meal: 'Breakfast',
      time: '08:10',
      source: 'manual' as const,
    },
    {
      id: 'm2',
      name: 'Chicken rice bowl',
      calories: 640,
      meal: 'Lunch',
      time: '13:05',
      source: 'manual' as const,
    },
  ],
  burns: [
    {
      id: 'b1',
      name: 'Brisk walk',
      calories: 180,
      minutes: 35,
      note: 'Estimated burn',
    },
  ],
};

function parseEntries<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function serializeTrackerState(record: {
  goal: number | null;
  burnGoal: number | null;
  weightKg: number;
  mealsJson: string;
  burnsJson: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    goal: record.goal,
    burnGoal: record.burnGoal,
    weightKg: record.weightKg,
    meals: parseEntries(record.mealsJson, []),
    burns: parseEntries(record.burnsJson, []),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

router.get('/', authMiddleware, async (req, res) => {
  const userId = (req.user as AuthTokenPayload).userId;

  try {
    const existing = await prisma.trackerState.findUnique({
      where: { userId },
    });

    if (existing) {
      return res.json({
        success: true,
        data: serializeTrackerState(existing),
      });
    }

    const created = await prisma.trackerState.create({
      data: {
        userId,
        goal: DEFAULT_TRACKER_STATE.goal,
        burnGoal: DEFAULT_TRACKER_STATE.burnGoal,
        weightKg: DEFAULT_TRACKER_STATE.weightKg,
        mealsJson: JSON.stringify(DEFAULT_TRACKER_STATE.meals),
        burnsJson: JSON.stringify(DEFAULT_TRACKER_STATE.burns),
      },
    });

    return res.json({
      success: true,
      data: serializeTrackerState(created),
    });
  } catch (error) {
    console.error('Tracker load error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to load tracker right now.',
    });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  const userId = (req.user as AuthTokenPayload).userId;
  const parsed = trackerPayloadSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid tracker payload.',
    });
  }

  try {
    const updated = await prisma.trackerState.upsert({
      where: { userId },
      update: {
        goal: parsed.data.goal,
        burnGoal: parsed.data.burnGoal,
        weightKg: parsed.data.weightKg,
        mealsJson: JSON.stringify(parsed.data.meals),
        burnsJson: JSON.stringify(parsed.data.burns),
      },
      create: {
        userId,
        goal: parsed.data.goal,
        burnGoal: parsed.data.burnGoal,
        weightKg: parsed.data.weightKg,
        mealsJson: JSON.stringify(parsed.data.meals),
        burnsJson: JSON.stringify(parsed.data.burns),
      },
    });

    return res.json({
      success: true,
      data: serializeTrackerState(updated),
    });
  } catch (error) {
    console.error('Tracker save error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to save tracker right now.',
    });
  }
});

export default router;