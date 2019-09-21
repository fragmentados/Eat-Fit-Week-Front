import { DEFAULT_LANG } from './../../models/service';
import { UpdateIngredient } from './../../models/ingredient/updateIngredient.model';
import { Ingredient } from './../../models/ingredient/ingredient.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IngredientService } from '.././ingredient.service';
import { FoodCategory } from '../../models/ingredient/foodCategory.model';
import { Stat } from '../../models/nutrition/stat.model';
import { UNIQUE_CONSTRAINT_CODE, OK_CODE } from '../../models/service';
import { UserService } from '../../user.service';
import { User } from '../../models/user/user.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './update-ingredient.component.html',
  styleUrls: ['./update-ingredient.component.css']
})
export class UpdateIngredientComponent implements OnInit {

  ingredient: UpdateIngredient = new UpdateIngredient();
  categories: FoodCategory[];
  ingredientId: number;
  currentUser: User;

  constructor(private translate: TranslateService, private route: ActivatedRoute, private ingredientService: IngredientService,
    private userService: UserService) {
    this.translate.setDefaultLang(DEFAULT_LANG);
    this.route.params.subscribe(params => this.ingredientId = params['id']);
    this.currentUser = this.userService.currentUserValue;
  }

  ngOnInit() {
    this.ingredientService.foodCategories().subscribe(data => this.categories = data);
    this.ingredientService.getIngredient(this.ingredientId)
      .subscribe( data => this.ingredient = this.ingredientToUpdateIngredient(data));
  }

  estimateNutrition() {
    this.ingredientService.nutritionEstimate(this.ingredient.name).subscribe(data => this.fillIngredientWithStats(data.stats));
  }

  fillIngredientWithStats(stats: Stat[]) {
    this.ingredient.calories = stats.filter(s => s.name === 'Calories')[0].value;
    this.ingredient.fats = stats.filter(s => s.name === 'Fats')[0].value;
    this.ingredient.proteins = stats.filter(s => s.name === 'Proteins')[0].value;
  }

  ingredientToUpdateIngredient(ingredient: Ingredient): UpdateIngredient {
    const updateIngredient: UpdateIngredient = new UpdateIngredient();
    updateIngredient.name = ingredient.name;
    updateIngredient.calories = ingredient.stats.filter(stat => stat.name === 'Calories')[0].value;
    updateIngredient.proteins = ingredient.stats.filter(stat => stat.name === 'Proteins')[0].value;
    updateIngredient.fats = ingredient.stats.filter(stat => stat.name === 'Fats')[0].value;
    updateIngredient.carbohydrates = ingredient.stats.filter(stat => stat.name === 'Carbohydrates')[0].value;
    updateIngredient.categoryId = ingredient.category.id;
    updateIngredient.userId = this.currentUser.id;
    return updateIngredient;
  }

  updateIngredient(): void {
    this.ingredientService.updateIngredient(this.ingredientId, this.ingredient)
      .subscribe( data => {
        if (data.errorCode === OK_CODE) {
          alert('Ingredient updated successfully.');
        } else {
          alert(data.message);
        }
      });
  }

}
