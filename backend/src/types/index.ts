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
  recognizedItems?: string[];
}

export interface FlavorScoreCalculation {
  nutritionScore: number;
  tasteScore: number;
  sustainabilityScore: number;
  totalFlavorScore: number;
}

export interface QuestDefinition {
  type: 'cuisine_master' | 'diet_explorer' | 'sustainable_eater' | 'social_champion';
  target?: string;
  targetCount: number;
  description: string;
  icon: string;
}

export interface AIMealRecognitionResult {
  items: string[];
  confidence: number;
  nutritionEstimate: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface UserStats {
  level: number;
  totalFlavorScore: number;
  currentStreak: number;
  longestStreak: number;
  totalMeals: number;
  averageFlavorScore: number;
}
