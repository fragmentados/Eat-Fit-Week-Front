import { FoodCategory } from './../../models/ingredient/foodCategory.model';
import { UserService } from '../../user.service';
import { AddIngredient } from '../../models/ingredient/addIngredient.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IngredientService } from '.././ingredient.service';
import { User } from '../../models/user/user.model';
import { Stat } from '../../models/nutrition/stat.model';
import { UNIQUE_CONSTRAINT_CODE, OK_CODE, DEFAULT_LANG } from '../../models/service';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(private translate: TranslateService, private userService: UserService,
    private router: Router, private ingredientService: IngredientService) {
    this.translate.setDefaultLang(DEFAULT_LANG);
    this.currentUser = this.userService.currentUserValue;
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
  }

  createIngredient(): void {
    this.ingredient.userId = this.currentUser.id;
    this.ingredientService.createIngredient(this.ingredient)
        .subscribe( data => {
          if (data.errorCode === OK_CODE) {
            this.clearForm();
            this.translate.get('COMMON.INGREDIENT_CREATED').subscribe(trans => alert(trans));
          } else {
            alert(data.message);
          }
        });
  }

}
