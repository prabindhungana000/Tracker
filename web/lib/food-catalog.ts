export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  serving: string;
  category: string;
  keywords?: string[];
};

type FoodSeed = Omit<FoodItem, "id">;

const FOOD_SEEDS: FoodSeed[] = [
  // Fruit
  { name: "Apple", calories: 95, serving: "1 medium", category: "Fruit" },
  { name: "Banana", calories: 105, serving: "1 medium", category: "Fruit" },
  { name: "Orange", calories: 62, serving: "1 medium", category: "Fruit" },
  { name: "Strawberries", calories: 49, serving: "1 cup", category: "Fruit" },
  { name: "Blueberries", calories: 84, serving: "1 cup", category: "Fruit" },
  { name: "Watermelon", calories: 86, serving: "2 cups", category: "Fruit" },
  { name: "Mango", calories: 99, serving: "1 cup sliced", category: "Fruit" },
  { name: "Pineapple", calories: 82, serving: "1 cup", category: "Fruit" },
  { name: "Grapes", calories: 104, serving: "1 cup", category: "Fruit" },
  { name: "Papaya", calories: 62, serving: "1 cup", category: "Fruit" },
  { name: "Pear", calories: 101, serving: "1 medium", category: "Fruit" },
  { name: "Kiwi", calories: 42, serving: "1 medium", category: "Fruit" },
  { name: "Pomegranate", calories: 134, serving: "1 cup arils", category: "Fruit" },
  { name: "Peach", calories: 59, serving: "1 medium", category: "Fruit" },
  { name: "Avocado", calories: 240, serving: "1 whole", category: "Fruit", keywords: ["healthy fat"] },

  // Dessert
  { name: "Vanilla Ice Cream", calories: 207, serving: "1 cup", category: "Dessert" },
  { name: "Chocolate Ice Cream", calories: 214, serving: "1 cup", category: "Dessert" },
  { name: "Chocolate Cake", calories: 352, serving: "1 slice", category: "Dessert" },
  { name: "Cheesecake", calories: 321, serving: "1 slice", category: "Dessert" },
  { name: "Brownie", calories: 243, serving: "1 square", category: "Dessert" },
  { name: "Donut", calories: 195, serving: "1 donut", category: "Dessert" },
  { name: "Chocolate Chip Cookie", calories: 160, serving: "2 cookies", category: "Dessert" },
  { name: "Cupcake", calories: 265, serving: "1 cupcake", category: "Dessert" },
  { name: "Apple Pie", calories: 296, serving: "1 slice", category: "Dessert" },
  { name: "Gulab Jamun", calories: 175, serving: "2 pieces", category: "Dessert" },
  { name: "Kheer", calories: 220, serving: "1 bowl", category: "Dessert", keywords: ["rice pudding"] },
  { name: "Tiramisu", calories: 430, serving: "1 slice", category: "Dessert" },
  { name: "Blueberry Muffin", calories: 385, serving: "1 muffin", category: "Dessert" },
  { name: "Frozen Yogurt", calories: 159, serving: "1 cup", category: "Dessert" },
  { name: "Rice Pudding", calories: 244, serving: "1 cup", category: "Dessert" },

  // Salad
  { name: "Caesar Salad", calories: 180, serving: "1 bowl", category: "Salad" },
  { name: "Greek Salad", calories: 211, serving: "1 bowl", category: "Salad" },
  { name: "Garden Salad", calories: 90, serving: "1 bowl", category: "Salad" },
  { name: "Chicken Salad", calories: 320, serving: "1 bowl", category: "Salad" },
  { name: "Tuna Salad", calories: 290, serving: "1 bowl", category: "Salad" },
  { name: "Cobb Salad", calories: 430, serving: "1 bowl", category: "Salad" },
  { name: "Quinoa Salad", calories: 222, serving: "1 bowl", category: "Salad" },
  { name: "Pasta Salad", calories: 260, serving: "1 bowl", category: "Salad" },
  { name: "Fruit Salad", calories: 120, serving: "1 bowl", category: "Salad" },
  { name: "Chickpea Salad", calories: 240, serving: "1 bowl", category: "Salad" },

  // Meat
  { name: "Chicken Breast", calories: 165, serving: "100 g", category: "Meat" },
  { name: "Chicken Thigh", calories: 209, serving: "100 g", category: "Meat" },
  { name: "Chicken Curry", calories: 325, serving: "1 cup", category: "Meat" },
  { name: "Beef Steak", calories: 271, serving: "100 g", category: "Meat" },
  { name: "Ground Beef", calories: 250, serving: "100 g", category: "Meat" },
  { name: "Pork Chop", calories: 231, serving: "100 g", category: "Meat" },
  { name: "Lamb Curry", calories: 310, serving: "1 cup", category: "Meat" },
  { name: "Turkey Breast", calories: 135, serving: "100 g", category: "Meat" },
  { name: "Meatballs", calories: 280, serving: "4 pieces", category: "Meat" },
  { name: "Sausage", calories: 229, serving: "1 link", category: "Meat" },
  { name: "Grilled Shrimp", calories: 99, serving: "100 g", category: "Meat" },
  { name: "Roast Chicken", calories: 239, serving: "100 g", category: "Meat" },

  // Protein
  { name: "Boiled Egg", calories: 78, serving: "1 large", category: "Protein" },
  { name: "Scrambled Eggs", calories: 182, serving: "2 eggs", category: "Protein" },
  { name: "Omelet", calories: 154, serving: "2 eggs", category: "Protein" },
  { name: "Greek Yogurt", calories: 130, serving: "1 cup", category: "Protein" },
  { name: "Cottage Cheese", calories: 206, serving: "1 cup", category: "Protein" },
  { name: "Tofu", calories: 144, serving: "100 g", category: "Protein" },
  { name: "Tempeh", calories: 193, serving: "100 g", category: "Protein" },
  { name: "Paneer", calories: 265, serving: "100 g", category: "Protein" },
  { name: "Lentils", calories: 230, serving: "1 cup cooked", category: "Protein" },
  { name: "Chickpeas", calories: 269, serving: "1 cup cooked", category: "Protein" },
  { name: "Black Beans", calories: 227, serving: "1 cup cooked", category: "Protein" },
  { name: "Protein Shake", calories: 160, serving: "1 bottle", category: "Protein" },
  { name: "Salmon", calories: 208, serving: "100 g", category: "Protein" },
  { name: "Tuna", calories: 132, serving: "100 g", category: "Protein" },

  // Pizza
  { name: "Cheese Pizza", calories: 285, serving: "1 slice", category: "Pizza" },
  { name: "Pepperoni Pizza", calories: 313, serving: "1 slice", category: "Pizza" },
  { name: "Margherita Pizza", calories: 270, serving: "1 slice", category: "Pizza" },
  { name: "Veggie Pizza", calories: 289, serving: "1 slice", category: "Pizza" },
  { name: "BBQ Chicken Pizza", calories: 310, serving: "1 slice", category: "Pizza" },
  { name: "Hawaiian Pizza", calories: 300, serving: "1 slice", category: "Pizza" },
  { name: "Paneer Pizza", calories: 305, serving: "1 slice", category: "Pizza" },
  { name: "Mushroom Pizza", calories: 278, serving: "1 slice", category: "Pizza" },
  { name: "Thin Crust Pizza", calories: 230, serving: "1 slice", category: "Pizza" },
  { name: "Deep Dish Pizza", calories: 390, serving: "1 slice", category: "Pizza" },

  // Breakfast
  { name: "Oatmeal", calories: 154, serving: "1 cup cooked", category: "Breakfast" },
  { name: "Granola", calories: 220, serving: "1/2 cup", category: "Breakfast" },
  { name: "Cornflakes", calories: 148, serving: "1 bowl", category: "Breakfast" },
  { name: "Pancakes", calories: 227, serving: "2 pancakes", category: "Breakfast" },
  { name: "French Toast", calories: 250, serving: "2 slices", category: "Breakfast" },
  { name: "Idli", calories: 116, serving: "2 pieces", category: "Breakfast" },
  { name: "Dosa", calories: 168, serving: "1 plain dosa", category: "Breakfast" },
  { name: "Paratha", calories: 260, serving: "1 paratha", category: "Breakfast" },
  { name: "Avocado Toast", calories: 240, serving: "2 slices", category: "Breakfast" },
  { name: "Peanut Butter Toast", calories: 250, serving: "2 slices", category: "Breakfast" },

  // Meal
  { name: "Chicken Rice Bowl", calories: 640, serving: "1 bowl", category: "Meal" },
  { name: "Turkey Sandwich", calories: 290, serving: "1 sandwich", category: "Meal" },
  { name: "Chicken Sandwich", calories: 360, serving: "1 sandwich", category: "Meal" },
  { name: "Spaghetti Bolognese", calories: 380, serving: "1 plate", category: "Meal" },
  { name: "Ramen", calories: 371, serving: "1 bowl", category: "Meal" },
  { name: "Momo", calories: 240, serving: "6 pieces", category: "Meal", keywords: ["dumpling"] },
  { name: "Dal Bhat", calories: 520, serving: "1 plate", category: "Meal", keywords: ["rice lentils"] },
  { name: "Biryani", calories: 484, serving: "1 plate", category: "Meal" },
  { name: "Chicken Wrap", calories: 410, serving: "1 wrap", category: "Meal" },
  { name: "Burrito Bowl", calories: 540, serving: "1 bowl", category: "Meal" },
  { name: "Sushi Roll", calories: 255, serving: "8 pieces", category: "Meal" },
  { name: "Shawarma Wrap", calories: 475, serving: "1 wrap", category: "Meal" },
  { name: "Fried Rice", calories: 333, serving: "1 cup", category: "Meal" },
  { name: "Mac and Cheese", calories: 350, serving: "1 cup", category: "Meal" },

  // Grain
  { name: "White Rice", calories: 205, serving: "1 cup cooked", category: "Grain" },
  { name: "Brown Rice", calories: 216, serving: "1 cup cooked", category: "Grain" },
  { name: "Quinoa", calories: 222, serving: "1 cup cooked", category: "Grain" },
  { name: "Pasta", calories: 221, serving: "1 cup cooked", category: "Grain" },
  { name: "Whole Wheat Bread", calories: 160, serving: "2 slices", category: "Grain" },
  { name: "Naan", calories: 262, serving: "1 naan", category: "Grain" },
  { name: "Mashed Potatoes", calories: 214, serving: "1 cup", category: "Grain" },
  { name: "Sweet Potato", calories: 112, serving: "1 medium", category: "Grain" },

  // Vegetable
  { name: "Broccoli", calories: 55, serving: "1 cup cooked", category: "Vegetable" },
  { name: "Carrot", calories: 50, serving: "1 cup", category: "Vegetable" },
  { name: "Spinach", calories: 41, serving: "1 cup cooked", category: "Vegetable" },
  { name: "Cucumber", calories: 16, serving: "1 cup", category: "Vegetable" },
  { name: "Bell Pepper", calories: 39, serving: "1 cup", category: "Vegetable" },
  { name: "Corn", calories: 143, serving: "1 cup", category: "Vegetable" },
  { name: "Potato", calories: 161, serving: "1 medium", category: "Vegetable" },
  { name: "Green Beans", calories: 44, serving: "1 cup cooked", category: "Vegetable" },
  { name: "Mixed Vegetables", calories: 118, serving: "1 cup", category: "Vegetable" },
  { name: "Roasted Cauliflower", calories: 90, serving: "1 cup", category: "Vegetable" },

  // Dairy
  { name: "Milk", calories: 149, serving: "1 cup", category: "Dairy" },
  { name: "Skim Milk", calories: 83, serving: "1 cup", category: "Dairy" },
  { name: "Cheddar Cheese", calories: 113, serving: "1 slice", category: "Dairy" },
  { name: "Mozzarella", calories: 85, serving: "1 oz", category: "Dairy" },
  { name: "Yogurt", calories: 149, serving: "1 cup", category: "Dairy" },
  { name: "Lassi", calories: 180, serving: "1 glass", category: "Dairy" },
  { name: "Butter", calories: 102, serving: "1 tbsp", category: "Dairy" },
  { name: "Cream Cheese", calories: 99, serving: "2 tbsp", category: "Dairy" },

  // Drink
  { name: "Black Coffee", calories: 5, serving: "1 cup", category: "Drink" },
  { name: "Latte", calories: 190, serving: "1 cup", category: "Drink" },
  { name: "Cappuccino", calories: 120, serving: "1 cup", category: "Drink" },
  { name: "Milk Tea", calories: 120, serving: "1 cup", category: "Drink" },
  { name: "Green Tea", calories: 2, serving: "1 cup", category: "Drink" },
  { name: "Orange Juice", calories: 112, serving: "1 glass", category: "Drink" },
  { name: "Apple Juice", calories: 114, serving: "1 glass", category: "Drink" },
  { name: "Cola", calories: 140, serving: "1 can", category: "Drink" },
  { name: "Lemonade", calories: 99, serving: "1 glass", category: "Drink" },
  { name: "Mango Smoothie", calories: 210, serving: "1 glass", category: "Drink" },
  { name: "Banana Smoothie", calories: 220, serving: "1 glass", category: "Drink" },
  { name: "Iced Tea", calories: 90, serving: "1 glass", category: "Drink" },

  // Snack
  { name: "Mixed Nuts", calories: 172, serving: "1 oz", category: "Snack" },
  { name: "Almonds", calories: 164, serving: "1 oz", category: "Snack" },
  { name: "Popcorn", calories: 106, serving: "3 cups", category: "Snack" },
  { name: "Potato Chips", calories: 152, serving: "1 oz", category: "Snack" },
  { name: "Nachos", calories: 346, serving: "1 serving", category: "Snack" },
  { name: "Granola Bar", calories: 120, serving: "1 bar", category: "Snack" },
  { name: "Trail Mix", calories: 173, serving: "1 oz", category: "Snack" },
  { name: "Crackers", calories: 120, serving: "5 crackers", category: "Snack" },
  { name: "Pretzels", calories: 108, serving: "1 oz", category: "Snack" },
  { name: "Peanut Butter", calories: 188, serving: "2 tbsp", category: "Snack" },

  // Soup
  { name: "Tomato Soup", calories: 90, serving: "1 bowl", category: "Soup" },
  { name: "Vegetable Soup", calories: 98, serving: "1 bowl", category: "Soup" },
  { name: "Chicken Soup", calories: 126, serving: "1 bowl", category: "Soup" },
  { name: "Lentil Soup", calories: 186, serving: "1 bowl", category: "Soup" },
  { name: "Miso Soup", calories: 40, serving: "1 bowl", category: "Soup" },
  { name: "Corn Soup", calories: 132, serving: "1 bowl", category: "Soup" },
  { name: "Mushroom Soup", calories: 120, serving: "1 bowl", category: "Soup" },
  { name: "Hot and Sour Soup", calories: 91, serving: "1 bowl", category: "Soup" },

  // Fast Food
  { name: "Cheeseburger", calories: 303, serving: "1 burger", category: "Fast Food" },
  { name: "Double Cheeseburger", calories: 438, serving: "1 burger", category: "Fast Food" },
  { name: "French Fries", calories: 365, serving: "1 medium serving", category: "Fast Food" },
  { name: "Fried Chicken", calories: 320, serving: "1 piece", category: "Fast Food" },
  { name: "Chicken Nuggets", calories: 270, serving: "6 pieces", category: "Fast Food" },
  { name: "Hot Dog", calories: 290, serving: "1 hot dog", category: "Fast Food" },
  { name: "Tacos", calories: 226, serving: "2 tacos", category: "Fast Food" },
  { name: "Quesadilla", calories: 300, serving: "1 wedge", category: "Fast Food" },
  { name: "Instant Noodles", calories: 380, serving: "1 packet", category: "Fast Food" },
  { name: "Fish Burger", calories: 380, serving: "1 burger", category: "Fast Food" },
];

export const FOOD_CATALOG: FoodItem[] = FOOD_SEEDS.map((food, index) => ({
  id: `food-${index + 1}`,
  ...food,
}));

export const FOOD_CATEGORIES = Array.from(
  new Set(FOOD_SEEDS.map((food) => food.category)),
);
