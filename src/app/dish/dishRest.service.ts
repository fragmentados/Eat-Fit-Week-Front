import { BackendResponse } from './../models/backendResponse.model';
import { BACKEND_URL } from '../models/service';
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Dish } from '../models/dish/dish.model';
import { AddDish } from '../models/dish/addDish.model';

@Injectable()
export class DishRestService {

  constructor(private http: HttpClient) {}

  private dishUrl = BACKEND_URL + 'dishes';

  public getUserDishes(userId: number) {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<Dish[]>(this.dishUrl, {params : params});
  }

  public getDish(dishId: number) {
    return this.http.get<Dish>(this.dishUrl + '/' + dishId);
  }

  public getDishes() {
    return this.http.get<Dish[]>(this.dishUrl);
  }

  public deleteDish(dish) {
    return this.http.delete(this.dishUrl + '/' + dish.id);
  }

  public createDish(dish: AddDish) {
    return this.http.post<BackendResponse>(this.dishUrl, dish);
  }

  public updateDish(dishId: number, dish: AddDish) {
    return this.http.put<BackendResponse>(this.dishUrl + '/' + dishId, dish);
  }

}
