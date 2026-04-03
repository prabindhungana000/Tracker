/**
 * Calculate Flavor Score - A holistic metric beyond calories
 * 
 * Formula:
 * FlavorScore = (Nutrition Balance × 0.4) + (Variety/Diversity × 0.3) + 
 *               (Sustainability × 0.2) + (Enjoyment/Mood × 0.1)
 */
export function calculateFlavorScore(
  nutritionScore: number,
  tasteScore: number,
  sustainabilityScore: number,
  moodBonus: number = 0
): number {
  const baseScore =
    nutritionScore * 0.4 +
    tasteScore * 0.3 +
    sustainabilityScore * 0.2;

  const moodMult = 1 + moodBonus * 0.1;
  return Math.round(baseScore * moodMult);
}

/**
 * Calculate Nutrition Score based on macronutrient balance
 * Preferred ratio: 40% carbs, 30% protein, 30% fat
 */
export function calculateNutritionScore(
  protein: number,
  carbs: number,
  fat: number,
  fiber: number,
  calories: number
): number {
  if (calories === 0) return 0;

  // Calculate macronutrient ratios
  const proteinRatio = (protein * 4) / calories;
  const carbRatio = (carbs * 4) / calories;
  const fatRatio = (fat * 9) / calories;

  // Ideal ratios: 30% protein, 40% carbs, 30% fat
  const proteinScore = 100 - Math.abs(proteinRatio - 0.3) * 100;
  const carbScore = 100 - Math.abs(carbRatio - 0.4) * 100;
  const fatScore = 100 - Math.abs(fatRatio - 0.3) * 100;

  // Fiber bonus (8+ grams is great)
  const fiberBonus = Math.min(fiber * 5, 20);

  return Math.max(0, (proteinScore + carbScore + fatScore) / 3 + fiberBonus / 3);
}

/**
 * Calculate Sustainability Score based on food choice
 * Different foods have different environmental impacts
 */
export function calculateSustainabilityScore(
  foodItems: string[],
  carbonFootprint: number
): number {
  // Preferred foods: vegetables, fruits, legumes, whole grains
  const sustainableKeywords = [
    'vegetable',
    'fruit',
    'legume',
    'bean',
    'lentil',
    'grain',
    'whole',
    'local',
  ];

  const isSustainable = foodItems.some((item) =>
    sustainableKeywords.some((keyword) =>
      item.toLowerCase().includes(keyword)
    )
  );

  // Carbon footprint scoring (lower is better)
  // Baseline: 5 kg CO2 = 50 points
  const fibonacci = Math.max(0, 100 - carbonFootprint * 10);

  return isSustainable ? fibonacci + 20 : fibonacci;
}

/**
 * Calculate Carbon Footprint of a meal
 * Estimates based on food items and quantities
 */
export function estimateCarbonFootprint(
  foodItems: string[],
  calories: number
): number {
  // Carbon footprint database (kg CO2 per 100g)
  const footprintDB: Record<string, number> = {
    beef: 27,
    lamb: 24,
    cheese: 23,
    pork: 12,
    chicken: 6.9,
    fish: 5.6,
    rice: 4,
    wheat: 0.8,
    vegetables: 0.5,
    fruit: 0.4,
    nuts: 2.5,
    milk: 3.3,
  };

  let totalFootprint = 0;

  for (const item of foodItems) {
    const lowerItem = item.toLowerCase();
    for (const [key, value] of Object.entries(footprintDB)) {
      if (lowerItem.includes(key)) {
        // Estimate weight from calories (rough approximation)
        totalFootprint += (calories / 100) * value;
        break;
      }
    }
  }

  return Math.round(totalFootprint * 100) / 100;
}

/**
 * Calculate User Level based on total Flavor Score
 * Exponential progression: each level requires 50% more points
 */
export function calculateLevel(totalFlavorScore: number): number {
  if (totalFlavorScore < 500) return 1;
  if (totalFlavorScore < 1250) return 2;
  if (totalFlavorScore < 2875) return 3;
  if (totalFlavorScore < 6000) return 4;
  if (totalFlavorScore < 11500) return 5;
  return Math.floor(Math.log(totalFlavorScore / 500) / Math.log(1.5)) + 1;
}

/**
 * Check if user maintains a streak
 * Streak breaks if they miss a day (no meal logged)
 */
export function updateStreak(
  lastMealDate: Date | null,
  currentDate: Date
): { currentStreak: number; longestStreak: number } {
  if (!lastMealDate) {
    return { currentStreak: 1, longestStreak: 1 };
  }

  const diff = Math.floor(
    (currentDate.getTime() - lastMealDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) {
    // Same day, no new streak
    return { currentStreak: 0, longestStreak: 0 };
  } else if (diff === 1) {
    // One day apart, extend streak
    return { currentStreak: 1, longestStreak: 0 };
  } else {
    // Streak broken
    return { currentStreak: 0, longestStreak: 0 };
  }
}
