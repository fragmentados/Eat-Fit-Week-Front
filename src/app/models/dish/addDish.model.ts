import { AddDishIngredient } from './addDishIngredient.model';
export class AddDish {
  userId: number;
  name: string;
  recipe: string;
  ingredients: AddDishIngredient[];
  meals: number[];
}
