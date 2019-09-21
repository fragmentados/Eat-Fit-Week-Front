import { FoodCategory } from './foodCategory.model';
import { Stat } from '../nutrition/stat.model';
export class Ingredient {

  id: number;
  name: string;
  category: FoodCategory;
  stats: Stat[];
}
