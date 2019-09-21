import { Stat } from '../nutrition/stat.model';
import { DishIngredient } from './dishIngredient.model';
import { Meal } from './meal.model';

export class Dish {

  id: number;
  name: string;
  recipe: string;
  ingredients: DishIngredient[];
  meals: Meal[];
  stats: Stat[];
}
