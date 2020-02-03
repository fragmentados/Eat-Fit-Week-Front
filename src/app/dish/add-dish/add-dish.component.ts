import { Component, OnInit } from '@angular/core';
import { DishRestService } from '../dishRest.service';
import { AddDish } from '../../models/dish/addDish.model';
import { Ingredient } from '../../models/ingredient/ingredient.model';
import { IngredientService } from '../../ingredient/ingredient.service';
import { Stat } from '../../models/nutrition/stat.model';
import { User } from '../../models/user/user.model';
import { UserService } from '../../user.service';
import { Meal } from '../../models/dish/meal.model';
import { DishService } from '../dish.service';
import { IngredientNameAndQuantity } from '../../models/ingredient/ingredientNameAndQuantity.model';
import { OK_CODE, DEFAULT_LANG } from '../../models/service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.css']
})
export class AddDishComponent implements OnInit {

  dish: AddDish = new AddDish();
  ingredients: Ingredient[];
  selectedIngredients: IngredientNameAndQuantity[] = [];
  dishStats: Stat[];
  selectedIng: Ingredient;
  ingredientQuantity: number;
  currentUser: User;
  allowedMeals: Meal[] = [];
  selectedMeals: boolean[] = [];
  image;
  statsTitle;

  constructor(private translate: TranslateService, private dishRestService: DishRestService,
    private dishService: DishService, private ingredientService: IngredientService, private userService: UserService) {
    this.translate.setDefaultLang(DEFAULT_LANG);
    this.translate.get('ADD_DISHES.STATS_TITLE').subscribe(data => this.statsTitle = data);
    this.currentUser = this.userService.currentUserValue;
  }

  ngOnInit() {
    this.ingredientService.getUserIngredients(this.currentUser.id, true).subscribe(data => this.ingredients = data);
    this.userService.getUserMeals(this.currentUser.id).subscribe(data => {
      this.allowedMeals = data;
      this.allowedMeals.forEach(m => {
        this.selectedMeals.push(true);
      });
    });
    this.dish.ingredients = [];
  }

  addIngredient() {
    const dishName: string = this.dishService.addIngredient(this.selectedIng,
      this.selectedIngredients, this.dish.ingredients, this.dish.name, this.ingredientQuantity);
    if (dishName) {
      this.dish.name = dishName;
      this.dishStats = this.dishService.addIngredientStatsToDish(this.dishStats, this.selectedIng, this.ingredientQuantity);
    }
  }

  removeIngredient(ingredient: IngredientNameAndQuantity) {
    this.dish.ingredients = this.dish.ingredients.filter(ing => ing.id !== ingredient.ingredient.id);
    this.selectedIngredients = this.selectedIngredients.filter(ing => ing !== ingredient);
    this.dishStats = this.dishService.subsctratIngredientStatsFromDish(this.dishStats, ingredient);
  }

  clearForm(): void {
    this.dish.name = '';
    this.dish.recipe = '';
    this.selectedIng = null;
    this.clearIngredients();
  }

  clearIngredients(): void {
    this.dish.ingredients = [];
    this.selectedIngredients = [];
    this.dishStats = null;
    this.ingredientQuantity = 0;
  }

  setMealsToAdd() {
    const addedMeals: number[] = [];
    for (const i in this.selectedMeals) {
      if (this.selectedMeals[i]) {
        addedMeals.push(this.allowedMeals[i].id);
      }
    }
    this.dish.meals = addedMeals;
  }

  createDish(): void {
    this.setMealsToAdd();
    this.dish.userId = this.currentUser.id;
    this.dishRestService.createDish(this.dish)
        .subscribe( data => {
          if (data.errorCode === OK_CODE) {
            this.clearForm();
            alert('Dish ' + this.dish.name + ' created successfully.');
          } else {
            alert(data.message);
          }
        });
  }

  onImageSelected(imageFile) {
    this.image = imageFile;
  }

}
