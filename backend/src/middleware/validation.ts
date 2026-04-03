import z from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Validation schemas for API requests
 */

export const createMealSchema = z.object({
  mealName: z.string().min(1, 'Meal name required'),
  description: z.string().optional(),
  calories: z.number().positive('Calories must be positive'),
  protein: z.number().nonnegative().optional(),
  carbs: z.number().nonnegative().optional(),
  fat: z.number().nonnegative().optional(),
  fiber: z.number().nonnegative().optional(),
  cuisineType: z.string().min(1, 'Cuisine type required'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  mood: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string().min(3, 'Username must be 3+ characters'),
  password: z.string().min(8, 'Password must be 8+ characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  cuisinePreferences: z.array(z.string()).optional(),
  environmentalPriority: z.number().min(0).max(100).optional(),
});

/**
 * Validation middleware factory
 */
export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }
      res.status(400).json({
        success: false,
        error: 'Invalid request',
      });
    }
  };
}
