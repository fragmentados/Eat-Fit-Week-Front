import { OK_CODE, DEFAULT_LANG } from './../../models/service';
import { Component, OnInit } from '@angular/core';
import { AddDish } from '../../models/dish/addDish.model';
import { Ingredient } from '../../models/ingredient/ingredient.model';
import { Stat } from '../../models/nutrition/stat.model';
import { User } from '../../models/user/user.model';
import { DishRestService } from '../dishRest.service';
import { IngredientService } from '../../ingredient/ingredient.service';
import { UserService } from '../../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meal } from '../../models/dish/meal.model';
import { DishService } from '../dish.service';
import { IngredientNameAndQuantity } from '../../models/ingredient/ingredientNameAndQuantity.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-update-dish',
  templateUrl: './update-dish.component.html',
  styleUrls: ['./update-dish.component.css']
})
export class UpdateDishComponent implements OnInit {

  dish: AddDish = new AddDish();
  ingredients: Ingredient[];
  selectedIngredients: IngredientNameAndQuantity[] = [];
  dishStats: Stat[] = [];
  selectedIng: Ingredient;
  ingredientQuantity: number;
  currentUser: User;
  dishId: number;
  allowedMeals: Meal[] = [];
  selectedMeals: boolean[] = [];
  statsTitle = 'Dish Stats';

  constructor(private translate: TranslateService, private router: Router, private route: ActivatedRoute, private dishService: DishService,
    private dishRestService: DishRestService, private ingredientService: IngredientService, private userService: UserService) {
    this.translate.setDefaultLang(DEFAULT_LANG);
    this.currentUser = this.userService.currentUserValue;
    this.route.params.subscribe(params => this.dishId = params['id']);
  }

  ngOnInit() {
    this.userService.getUserMeals(this.currentUser.id).subscribe(data2 => {
      this.allowedMeals = data2;
      this.dishRestService.getDish(this.dishId).subscribe(data => {
        this.dish = this.dishService.dishToAddDish(data, this.selectedIngredients,
          this.dishStats, this.currentUser, this.allowedMeals, this.selectedMeals);
      });
    });
    this.ingredientService.getUserIngredients(this.currentUser.id).subscribe(data => this.ingredients = data);
  }

  removeIngredient(ingredient: IngredientNameAndQuantity) {
    this.dish.ingredients = this.dish.ingredients.filter(ing => ing.id !== ingredient.ingredient.id);
    this.selectedIngredients = this.selectedIngredients.filter(ing => ing !== ingredient);
    this.dishStats = this.dishService.subsctratIngredientStatsFromDish(this.dishStats, ingredient);
  }

  addIngredient() {
    const dishName: string = this.dishService.addIngredient(this.selectedIng,
      this.selectedIngredients, this.dish.ingredients, this.dish.name, this.ingredientQuantity);
    if (dishName) {
      this.dish.name = dishName;
      this.dishStats = this.dishService.addIngredientStatsToDish(this.dishStats, this.selectedIng, this.ingredientQuantity);
    }
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

  setMealsToUpdate() {
    const addedMeals: number[] = [];
    for (const i in this.selectedMeals) {
      if (this.selectedMeals[i] && this.allowedMeals[i]) {
        addedMeals.push(this.allowedMeals[i].id);
      }
    }
    this.dish.meals = addedMeals;
  }

  updateDish(): void {
    this.setMealsToUpdate();
    this.dishRestService.updateDish(this.dishId, this.dish)
        .subscribe( data => {
          if (data.errorCode === OK_CODE) {
            alert('Dish ' + this.dish.name + ' updated successfully.');
            this.router.navigate(['/dishes']);
          } else {
            alert(data.message);
          }
        });
  }
}
