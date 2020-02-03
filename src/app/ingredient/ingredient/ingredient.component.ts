import { ApplicationStateService } from './../../application-state.service';
import { FoodCategory } from './../../models/ingredient/foodCategory.model';
import { UserService } from '../../user.service';
import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../../models/ingredient/ingredient.model';
import { IngredientService } from '.././ingredient.service';
import { User } from '../../models/user/user.model';
import { Router } from '@angular/router';
import { DEFAULT_LANG } from '../../models/service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styles: []
})
export class IngredientComponent implements OnInit {

  ingredientMap: Map<String, Ingredient[]>;
  bannedCategories: FoodCategory[];
  currentUser: User;
  warningText;
  isMobile = false;
  isTablet = false;

  constructor(private translate: TranslateService, private router: Router, private userService: UserService,
    private ingredientService: IngredientService, private appStateService: ApplicationStateService) {
    this.translate.setDefaultLang(DEFAULT_LANG);
    this.translate.get('ADD_INGREDIENT.BANNED_CATEGORY_INGREDIENT_MESSAGE').subscribe(data => this.warningText = data);
    this.currentUser = this.userService.currentUserValue;
    this.isMobile = this.appStateService.getIsMobileResolution();
    this.isTablet = this.appStateService.getIsTabletResolution();
  }

  ngOnInit() {
    this.ingredientService.getUserIngredientsAsMap(this.currentUser.id)
      .subscribe( data => {
        this.ingredientMap = data;
      });
      this.userService.getUserConfs(this.currentUser.id).subscribe(data => {
        this.bannedCategories = data.bannedCategories;
      });
  }

  updateIngredient(ingredient: Ingredient): void {
    this.router.navigate(['/ingredients/updateIngredient', ingredient.id]);
  }

  deleteIngredient(key: string, ingredient: Ingredient): void {
    this.ingredientService.deleteIngredient(ingredient)
      .subscribe( data => {
        this.ingredientMap.set(key, this.ingredientMap.get(key).filter(u => u !== ingredient));
      });
  }

  isBanned(ingredient: Ingredient) {
    // return this.bannedCategories.filter(bc => bc.id === ingredient.category.id).length > 0;
    return false;
  }

  ingredientCalories(ingredient: Ingredient) {
    return ingredient.stats.filter(stat => stat.name === 'Calories')[0].value;
  }

}


