import { FoodCategory } from './../ingredient/foodCategory.model';
import { Meal } from '../dish/meal.model';
export class UserConfs {

  maxCaloriesPerWeek: number;
  maxProteinsPerWeek: number;
  maxFatsPerWeek: number;
  maxCarbohydratesPerWeek: number;
  bannedCategories: FoodCategory[];
  meals: Meal[];
}
