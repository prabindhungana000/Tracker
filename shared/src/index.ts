// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  level: number;
  totalFlavorScore: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  level: number;
  totalFlavorScore: number;
  currentStreak: number;
  longestStreak: number;
  totalMeals: number;
  averageFlavorScore: number;
}

// Meal Types
export interface Meal {
  id: string;
  userId: string;
  mealName: string;
  description?: string;
  imageUrl?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  cuisineType: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  mood?: string;
  location?: string;
  recognizedItems: string[];
  flavorScore: number;
  carbonFootprint: number;
  createdAt: Date;
  loggedAt: Date;
}

export interface CreateMealInput {
  mealName: string;
  description?: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  cuisineType: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  mood?: string;
  location?: string;
  imageUrl?: string;
  recognizedItems?: string[];
}

// Gamification Types
export type QuestType = 'cuisine_master' | 'diet_explorer' | 'sustainable_eater' | 'social_champion';

export interface Quest {
  id: string;
  creatorId: string;
  name: string;
  description: string;
  icon: string;
  type: QuestType;
  target?: string;
  targetCount: number;
  flavorPointReward: number;
  xpReward: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface QuestProgress {
  questId: string;
  userId: string;
  progress: number;
  completed: boolean;
  completedAt?: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  icon: string;
  title: string;
  description: string;
  type: string;
  unlockedAt: Date;
}

// Social Types
export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  type: string;
  theme?: string;
  startDate: Date;
  endDate: Date;
  metric: string;
  isActive: boolean;
}

export interface ChallengeParticipation {
  userId: string;
  challengeId: string;
  score: number;
  rank?: number;
  joinedAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  totalFlavorScore: number;
  currentStreak: number;
  rank: number;
}

// AI Recognition Types
export interface AIMealRecognitionResult {
  items: string[];
  confidence: number;
  nutritionEstimate: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Filter & Query Types
export interface MealFilter {
  startDate?: Date;
  endDate?: Date;
  cuisineType?: string;
  mealType?: string;
  sortBy?: 'date' | 'calories' | 'flavorScore';
  limit?: number;
  offset?: number;
}

export interface LeaderboardQuery {
  metric?: 'flavorScore' | 'streak' | 'meals';
  timeRange?: 'week' | 'month' | 'allTime';
  limit?: number;
}

// Flavor Score calculation types
export interface FlavorScoreComponents {
  nutritionScore: number;      // 0-100
  tasteScore: number;          // 0-100
  sustainabilityScore: number; // 0-100
  moodBonus: number;           // -10 to 10
}

export interface FlavorScoreBreakdown {
  nutritionScore: number;
  tasteScore: number;
  sustainabilityScore: number;
  totalFlavorScore: number;
}

// Constants
export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
export const QUEST_TYPES: QuestType[] = ['cuisine_master', 'diet_explorer', 'sustainable_eater', 'social_champion'];
export const CUISINE_TYPES = [
  'Italian',
  'Asian',
  'Mediterranean',
  'American',
  'Mexican',
  'Indian',
  'Middle Eastern',
  'Japanese',
  'Chinese',
  'Thai',
  'Vietnamese',
  'Korean',
  'French',
  'Spanish',
  'Vegetarian',
  'Vegan',
] as const;

// Theme Colors
export const COLORS = {
  sage: '#9CAF88',
  cream: '#F5F3EF',
  charcoal: '#2C2C2C',
  warmAccent: '#D4A574',
  success: '#7CBC8C',
  warning: '#F4A460',
  error: '#D94949',
} as const;
