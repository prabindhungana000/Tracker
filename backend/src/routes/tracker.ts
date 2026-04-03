import express from 'express';
import { randomUUID } from 'crypto';
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
  createdAt: string | Date;
  updatedAt: string | Date;
}) {
  return {
    goal: record.goal,
    burnGoal: record.burnGoal,
    weightKg: record.weightKg,
    meals: parseEntries(record.mealsJson, []),
    burns: parseEntries(record.burnsJson, []),
    createdAt: new Date(record.createdAt).toISOString(),
    updatedAt: new Date(record.updatedAt).toISOString(),
  };
}

type TrackerStateRow = {
  goal: number | null;
  burnGoal: number | null;
  weightKg: number;
  mealsJson: string;
  burnsJson: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

let trackerTableReadyPromise: Promise<void> | null = null;

async function ensureTrackerTable() {
  if (!trackerTableReadyPromise) {
    trackerTableReadyPromise = (async () => {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "TrackerState" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "goal" INTEGER,
          "burnGoal" INTEGER,
          "weightKg" REAL NOT NULL DEFAULT 70,
          "mealsJson" TEXT NOT NULL DEFAULT '[]',
          "burnsJson" TEXT NOT NULL DEFAULT '[]',
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "TrackerState_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "User" ("id")
            ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "TrackerState_userId_key"
        ON "TrackerState"("userId")
      `);
    })();
  }

  await trackerTableReadyPromise;
}

async function getTrackerStateRow(userId: string) {
  const rows = await prisma.$queryRawUnsafe<TrackerStateRow[]>(
    `
      SELECT "goal", "burnGoal", "weightKg", "mealsJson", "burnsJson", "createdAt", "updatedAt"
      FROM "TrackerState"
      WHERE "userId" = ?
      LIMIT 1
    `,
    userId
  );

  return rows[0] || null;
}

router.get('/', authMiddleware, async (req, res) => {
  const userId = (req.user as AuthTokenPayload).userId;

  try {
    await ensureTrackerTable();

    await prisma.$executeRawUnsafe(
      `
        INSERT OR IGNORE INTO "TrackerState"
          ("id", "userId", "goal", "burnGoal", "weightKg", "mealsJson", "burnsJson")
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      randomUUID(),
      userId,
      DEFAULT_TRACKER_STATE.goal,
      DEFAULT_TRACKER_STATE.burnGoal,
      DEFAULT_TRACKER_STATE.weightKg,
      JSON.stringify(DEFAULT_TRACKER_STATE.meals),
      JSON.stringify(DEFAULT_TRACKER_STATE.burns)
    );

    const trackerState = await getTrackerStateRow(userId);

    if (!trackerState) {
      throw new Error('Tracker state was not created.');
    }

    return res.json({
      success: true,
      data: serializeTrackerState(trackerState),
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
    await ensureTrackerTable();

    await prisma.$executeRawUnsafe(
      `
        INSERT INTO "TrackerState"
          ("id", "userId", "goal", "burnGoal", "weightKg", "mealsJson", "burnsJson")
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT("userId") DO UPDATE SET
          "goal" = excluded."goal",
          "burnGoal" = excluded."burnGoal",
          "weightKg" = excluded."weightKg",
          "mealsJson" = excluded."mealsJson",
          "burnsJson" = excluded."burnsJson",
          "updatedAt" = CURRENT_TIMESTAMP
      `,
      randomUUID(),
      userId,
      parsed.data.goal,
      parsed.data.burnGoal,
      parsed.data.weightKg,
      JSON.stringify(parsed.data.meals),
      JSON.stringify(parsed.data.burns)
    );

    const trackerState = await getTrackerStateRow(userId);

    if (!trackerState) {
      throw new Error('Tracker state was not saved.');
    }

    return res.json({
      success: true,
      data: serializeTrackerState(trackerState),
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
