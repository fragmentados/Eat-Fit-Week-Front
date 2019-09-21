import { Ingredient } from './ingredient.model';

export class IngredientNameAndQuantity {
  constructor(ing, quantity) {
    this.ingredient = ing;
    this.quantity = quantity;
  }
  ingredient: Ingredient;
  quantity: number;
}
