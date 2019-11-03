import { AddDish } from './../../models/dish/addDish.model';
import { DishRestService } from './../../dish/dishRest.service';
import { FoodCategory } from './../../models/ingredient/foodCategory.model';
import { UserService } from '../../user.service';
import { AddIngredient } from '../../models/ingredient/addIngredient.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IngredientService } from '.././ingredient.service';
import { User } from '../../models/user/user.model';
import { Stat } from '../../models/nutrition/stat.model';
import { OK_CODE, DEFAULT_LANG } from '../../models/service';
import { TranslateService } from '@ngx-translate/core';
import { AddDishIngredient } from '../../models/dish/addDishIngredient.model';
import { Meal } from '../../models/dish/meal.model';

@Component({
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.css']
})
export class AddIngredientComponent implements OnInit {

  ingredient: AddIngredient = new AddIngredient();
  categories: FoodCategory[];
  bannedCategories: FoodCategory[];
  currentUser: User;
  categorySelectedBanned = false;
  alsoAddDish = false;
  ingredientQuantity: number;
  userMeals: Meal[];

  constructor(private translate: TranslateService, private userService: UserService,
    private ingredientService: IngredientService, private dishService: DishRestService) {
    this.translate.setDefaultLang(DEFAULT_LANG);
    this.currentUser = this.userService.currentUserValue;
    this.userService.getUserMeals(this.currentUser.id).subscribe(data => this.userMeals = data);
  }

  ngOnInit(): void {
    this.ingredientService.foodCategories().subscribe(data => this.categories = data);
    this.userService.getUserConfs(this.currentUser.id).subscribe(data => this.bannedCategories = data.bannedCategories);
  }

  estimateNutrition() {
    this.ingredientService.nutritionEstimate(this.ingredient.name).subscribe(data => this.fillIngredientWithStats(data.stats));
  }

  fillIngredientWithStats(stats: Stat[]) {
    this.ingredient.calories = stats.filter(s => s.name === 'Calories')[0].value;
    this.ingredient.fats = stats.filter(s => s.name === 'Fats')[0].value;
    this.ingredient.proteins = stats.filter(s => s.name === 'Proteins')[0].value;
  }

  checkBannedCategory() {
    this.categorySelectedBanned = (this.bannedCategories.filter(bc => bc.id === this.ingredient.categoryId).length > 0);
  }

  clearForm() {
    this.ingredient.name = '';
    this.ingredient.categoryId = null;
    this.ingredient.calories = null;
    this.ingredient.carbohydrates = null;
    this.ingredient.proteins = null;
    this.ingredient.fats = null;
    this.ingredientQuantity = 0;
    this.alsoAddDish = false;
  }

  createIngredient(): void {
    this.ingredient.userId = this.currentUser.id;
    this.ingredientService.createIngredient(this.ingredient)
        .subscribe( data => {
          if (data.errorCode === OK_CODE) {
            if (this.alsoAddDish) {
              this.dishService.createDish(this.createAddDishFromIngredient(data.entityId)).subscribe(() => {
                this.clearForm();
                this.translate.get('COMMON.INGREDIENT_CREATED').subscribe(trans => alert(trans));
              });
            } else {
              this.clearForm();
              this.translate.get('COMMON.INGREDIENT_CREATED').subscribe(trans => alert(trans));
            }
          } else {
            alert(data.message);
          }
        });
  }

  createAddDishFromIngredient(ingredientId: number): AddDish {
    const result: AddDish = new AddDish();
    result.userId = this.currentUser.id;
    result.name = this.ingredient.name;
    result.ingredients = [new AddDishIngredient(ingredientId, this.ingredientQuantity)];
    result.meals = this.userMeals.map(m => m.id);
    return result;
  }

}
