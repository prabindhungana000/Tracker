/**
 * Calculate user level based on total flavor score
 * Level increases every 1000 points, with diminishing returns
 */
export function calculateLevel(totalFlavorScore: number): number {
  if (totalFlavorScore <= 0) return 1;

  // Level = floor(sqrt(score / 100)) + 1
  // This creates a curve where higher levels require more points
  return Math.floor(Math.sqrt(totalFlavorScore / 100)) + 1;
}

/**
 * Calculate flavor score from nutrition, taste, and sustainability components
 */
export function calculateFlavorScore(
  nutritionScore: number,
  tasteScore: number,
  sustainabilityScore: number
): number {
  // Weighted average: 40% nutrition, 35% taste, 25% sustainability
  const weightedScore = (
    nutritionScore * 0.4 +
    tasteScore * 0.35 +
    sustainabilityScore * 0.25
  );

  return Math.round(weightedScore * 100) / 100; // Round to 2 decimal places
}

/**
 * Check if user qualifies for level up
 */
export function checkLevelUp(currentLevel: number, newTotalScore: number): boolean {
  const newLevel = calculateLevel(newTotalScore);
  return newLevel > currentLevel;
}

/**
 * Get experience points needed for next level
 */
export function getExpForNextLevel(currentLevel: number): number {
  // Next level requires: (level)^2 * 100 points
  const nextLevel = currentLevel + 1;
  return nextLevel * nextLevel * 100;
}

/**
 * Get progress percentage to next level
 */
export function getLevelProgress(currentScore: number, currentLevel: number): number {
  const currentLevelMin = (currentLevel - 1) * (currentLevel - 1) * 100;
  const nextLevelMin = currentLevel * currentLevel * 100;
  const progress = currentScore - currentLevelMin;
  const required = nextLevelMin - currentLevelMin;

  return Math.min(100, Math.max(0, (progress / required) * 100));
}
