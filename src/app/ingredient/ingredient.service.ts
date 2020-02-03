import { FoodCategory } from './../models/ingredient/foodCategory.model';
import { AddIngredient } from '../models/ingredient/addIngredient.model';
import { BACKEND_URL } from './../models/service';
import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Ingredient } from '../models/ingredient/ingredient.model';
import { UpdateIngredient } from '../models/ingredient/updateIngredient.model';
import { NutritionEstimate } from '../models/nutrition/nutritionEstimate.model';
import { BackendResponse } from '../models/backendResponse.model';

@Injectable()
export class IngredientService {

  constructor(private http: HttpClient) {}

  private ingredientUrl = BACKEND_URL + 'ingredients';

  public getUserIngredients(userId: number, sortedByName: boolean) {
    const params = new HttpParams().set('userId', userId.toString()).set('sortedByName', sortedByName.toString());
    return this.http.get<Ingredient[]>(this.ingredientUrl, { params: params });
  }

  public getUserIngredientsAsMap(userId: number) {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<Map<String, Ingredient[]>>(this.ingredientUrl + '/map', { params: params });
  }

  public getIngredient(ingredientId: number) {
    return this.http.get<Ingredient>(this.ingredientUrl + '/' + ingredientId);
  }

  public updateIngredient(id: number, ingredient: UpdateIngredient) {
    return this.http.put<BackendResponse>(this.ingredientUrl + '/' + id, ingredient);
  }

  public deleteIngredient(ingredient) {
    return this.http.delete(this.ingredientUrl + '/' + ingredient.id);
  }

  public createIngredient(ingredient: AddIngredient) {
    return this.http.post<BackendResponse>(this.ingredientUrl, ingredient);
  }

  public nutritionEstimate(ingredientName: string) {
    const params = new HttpParams().set('ingr', ingredientName);
    return this.http.get<NutritionEstimate>(this.ingredientUrl + '/nutrition-estimate', {params: params});
  }

  public foodCategories() {
    return this.http.get<FoodCategory[]>(this.ingredientUrl + '/categories');
  }

}
