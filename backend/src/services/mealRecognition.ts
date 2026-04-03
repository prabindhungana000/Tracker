import axios from 'axios';

export interface AIRecognitionResult {
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

/**
 * AI Meal Recognition Service using Google Vision API
 * In production, this would use the actual Google Vision API
 * For demo purposes, this includes a fallback system
 */
export class MealRecognitionService {
  private apiKey = process.env.GOOGLE_VISION_API_KEY;
  private apiUrl = 'https://vision.googleapis.com/v1/images:annotate';

  /**
   * Recognize meal from image URL
   */
  async recognizeMealFromUrl(imageUrl: string): Promise<AIRecognitionResult> {
    if (!this.apiKey) {
      console.warn('Google Vision API key not set, using fallback recognition');
      return this.fallbackRecognition();
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        {
          requests: [
            {
              image: {
                source: {
                  imageUri: imageUrl,
                },
              },
              features: [
                {
                  type: 'LABEL_DETECTION',
                  maxResults: 10,
                },
                {
                  type: 'OBJECT_LOCALIZATION',
                  maxResults: 5,
                },
              ],
            },
          ],
        }
      );

      const result = response.data.responses[0];
      const labels = result.labelAnnotations || [];
      const objects = result.localizedObjectAnnotations || [];

      const items = [
        ...labels.map((l: any) => l.description),
        ...objects.map((o: any) => o.name),
      ].slice(0, 10);

      const confidence = labels[0]?.score || 0.7;

      return {
        items,
        confidence,
        nutritionEstimate: this.estimateNutrition(items),
      };
    } catch (error) {
      console.error('AI Recognition error:', error);
      return this.fallbackRecognition();
    }
  }

  /**
   * Fallback recognition for demo/offline mode
   */
  private fallbackRecognition(): AIRecognitionResult {
    const commonMeals = [
      { items: ['salad', 'lettuce', 'vegetables'], calories: 200 },
      { items: ['pasta', 'tomato sauce', 'cheese'], calories: 500 },
      { items: ['sandwich', 'bread', 'chicken'], calories: 450 },
      { items: ['burger', 'beef', 'french fries'], calories: 750 },
      { items: ['sushi', 'rice', 'fish'], calories: 350 },
      { items: ['pizza', 'cheese', 'tomato'], calories: 600 },
      { items: ['salad', 'chicken', 'dressing'], calories: 400 },
      { items: ['soup', 'vegetables', 'broth'], calories: 250 },
    ];

    const random = commonMeals[Math.floor(Math.random() * commonMeals.length)];

    return {
      items: random.items,
      confidence: 0.65,
      nutritionEstimate: this.estimateNutrition(random.items, random.calories),
    };
  }

  /**
   * Estimate nutritional values based on recognized items
   */
  private estimateNutrition(
    items: string[],
    totalCalories?: number
  ): AIRecognitionResult['nutritionEstimate'] {
    // Nutrition database for common foods
    const nutritionDB: Record<string, Record<string, number>> = {
      chicken: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
      beef: { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
      fish: { calories: 120, protein: 20, carbs: 0, fat: 4, fiber: 0 },
      rice: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
      pasta: { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8 },
      bread: { calories: 265, protein: 9, carbs: 49, fat: 3.3, fiber: 2.7 },
      vegetables: { calories: 50, protein: 2, carbs: 10, fat: 0.2, fiber: 2 },
      salad: { calories: 20, protein: 1, carbs: 3, fat: 0.2, fiber: 1 },
      fruit: { calories: 60, protein: 1, carbs: 15, fat: 0.3, fiber: 2 },
      cheese: { calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0 },
    };

    const totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };

    for (const item of items) {
      const lowerItem = item.toLowerCase();
      for (const [key, nutrition] of Object.entries(nutritionDB)) {
        if (lowerItem.includes(key)) {
          for (const [nutrient, value] of Object.entries(nutrition)) {
            (totalNutrition as any)[nutrient] += value;
          }
        }
      }
    }

    // Scale to total calories if provided
    if (totalCalories && totalNutrition.calories > 0) {
      const scale = totalCalories / totalNutrition.calories;
      totalNutrition.calories = totalCalories;
      totalNutrition.protein *= scale;
      totalNutrition.carbs *= scale;
      totalNutrition.fat *= scale;
      totalNutrition.fiber *= scale;
    } else if (totalNutrition.calories === 0) {
      totalNutrition.calories = 300; // default estimate
    }

    return totalNutrition;
  }
}

export const mealRecognitionService = new MealRecognitionService();
