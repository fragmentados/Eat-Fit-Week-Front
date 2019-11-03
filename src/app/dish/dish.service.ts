import { User } from './../models/user/user.model';
import {Injectable} from '@angular/core';
import { Stat } from '../models/nutrition/stat.model';
import { Ingredient } from '../models/ingredient/ingredient.model';
import { IngredientNameAndQuantity } from '../models/ingredient/ingredientNameAndQuantity.model';
import { AddDishIngredient } from '../models/dish/addDishIngredient.model';
import { Dish } from '../models/dish/dish.model';
import { AddDish } from '../models/dish/addDish.model';
import { Meal } from '../models/dish/meal.model';

@Injectable()
export class DishService {

  addIngredient(selectedIng: Ingredient, selectedIngredients: IngredientNameAndQuantity[],
    dishIngredients: AddDishIngredient[], dishName: string, ingredientQuantity: number) {
    let dishNameResult: string;
    if (selectedIng != null) {
      if (dishIngredients.filter(ing => ing.id === selectedIng.id).length === 0) {
        dishIngredients.push(new AddDishIngredient(selectedIng.id, ingredientQuantity));
        selectedIngredients.push(new IngredientNameAndQuantity(selectedIng, ingredientQuantity));
        dishNameResult = this.autoFillDishName(dishName, selectedIng.name);
      } else {
        alert('That ingredient has already been selected');
      }
    } else {
      alert('You must select an ingredient first');
    }
    return dishNameResult;
  }

  addIngredientStatsToDish(dishStats: Stat[], ingredient: Ingredient, ingredientQuantity: number): Stat[] {
    if (dishStats == null) {
      dishStats = [];
    }
    for (const ingredientStat of ingredient.stats) {
      const dishStat: Stat = dishStats.find(element => element.name === ingredientStat.name);
      if (dishStat == null) {
        dishStats.push(new Stat(ingredientStat.name, (parseFloat(ingredientStat.value) * ingredientQuantity / 100).toFixed(2).toString()));
      } else {
        dishStats = dishStats.filter(element => element.name !== dishStat.name);
        dishStats.push(new Stat(dishStat.name, (parseFloat(dishStat.value) +
          (parseFloat(ingredientStat.value) * ingredientQuantity / 100)).toFixed(2).toString()));
      }
    }
    return dishStats;
  }

  subsctratIngredientStatsFromDish(dishStats: Stat[], ingredient: IngredientNameAndQuantity): Stat[] {
    if (dishStats == null) {
      dishStats = [];
    }
    for (const ingredientStat of ingredient.ingredient.stats) {
      const dishStat: Stat = dishStats.find(element => element.name === ingredientStat.name);
      if (dishStat) {
        dishStats = dishStats.filter(element => element.name !== dishStat.name);
        const newStatValue = parseFloat(dishStat.value) - (parseFloat(ingredientStat.value) * ingredient.quantity / 100);
        if (newStatValue > 0) {
          dishStats.push(new Stat(dishStat.name, newStatValue.toString()));
        }
      }
    }

    if (dishStats.length === 0) {
      dishStats = null;
    }

    return dishStats;
  }

  autoFillDishName(dishName: string, ingrName: string): string {
    let dishNameResult: string;
    if (dishName == null || dishName === '') {
      dishNameResult = ingrName;
    } else {
      if (dishName.includes('con')) {
        dishNameResult = dishName + ' y ' + ingrName;
      } else {
        dishNameResult = dishName + ' con ' + ingrName;
      }
    }
    return dishNameResult;
  }

  dishToAddDish(dish: Dish, selectedIngredients: IngredientNameAndQuantity[],
    dishStats: Stat[], currentUser: User, allowedMeals: Meal[], selectedMeals: Boolean[]): AddDish {
    const updateDish: AddDish = new AddDish();
    updateDish.name = dish.name;
    updateDish.recipe = dish.recipe;
    updateDish.userId = currentUser.id;
    updateDish.ingredients = [];
    dish.ingredients.forEach(ingredient => {
      updateDish.ingredients.push(new AddDishIngredient(ingredient.ingredient.id, ingredient.quantity));
      selectedIngredients.push(new IngredientNameAndQuantity(ingredient.ingredient, ingredient.quantity));
    });
    for (const stat of dish.stats) {
      dishStats.push(stat);
    }
    this.setSelectedMealsByDish(dish.meals, allowedMeals, selectedMeals);
    return updateDish;
  }

  setSelectedMealsByDish(dishMeals: Meal[], allowedMeals: Meal[], selectedMeals: Boolean[]) {
    for (const i in allowedMeals) {
      if (dishMeals.filter(m => m.id  === allowedMeals[i].id).length > 0) {
        selectedMeals.push(true);
      } else {
        selectedMeals.push(undefined);
      }
    }
  }
}
