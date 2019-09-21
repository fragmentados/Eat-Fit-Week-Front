import { FillMenuFromTemplate } from './../models/menu/fillMenuFromTemplate.model';
import { BackendResponse } from '../models/backendResponse.model';
import { BACKEND_URL } from './../models/service';
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Menu } from '../models/menu/menu.model';
import { AddDishToMenu } from '../models/menu/addDishToMenu.model';
import { ShoppingList } from '../models/menu/shoppingList/shoppingList.model';
import { AddMenu } from '../models/menu/addMenu.model';
import { UpdateDishOnMenu } from '../models/menu/updateDishOnMenu.model';
import { SpotFound } from '../models/menu/spotFound.model';
import { SuggestDish } from '../models/menu/suggestDish.model';
import { Dish } from '../models/dish/dish.model';
import * as moment from 'moment';

@Injectable()
export class MenuService {

  constructor(private http: HttpClient) {}

  private menuUrl = BACKEND_URL + 'menus';

  public createMenu(userId: number, startDate: Date) {
    const menu: AddMenu  = new AddMenu();
    menu.userId = userId;
    menu.startDate = this.formatDate(startDate);
    return this.http.post<Menu>(this.menuUrl, menu);
  }

  public getUserMenu(userId: number, startDate: Date) {
    const params = new HttpParams().set('startDate', this.formatDate(startDate)).set('userId', userId.toString());
    return this.http.get<Menu>(this.menuUrl, { params: params });
  }

  public getShoppingList(menuId: number, startDate: string, endDate: string) {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    return this.http.get<ShoppingList>(this.menuUrl + '/' + menuId + '/shoppingList', {params: params});
  }

  public clearMenu(menuId: number, startDate: string, endDate: string) {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    return this.http.delete<BackendResponse>(this.menuUrl + '/' + menuId + '/clearMenu', {params: params});
  }

  public addDishToFirstValidSpotMenu(userId: number, addDishToMenu: AddDishToMenu) {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<SpotFound>(this.menuUrl + '/dish/firstValidSpot', addDishToMenu, {params: params});
  }

  public addDishToMenu(menuId: number, addDishToMenu: AddDishToMenu) {
    return this.http.post<BackendResponse>(this.menuUrl + '/' + menuId + '/dish', addDishToMenu);
  }

  public suggestDishForMenu(menuId: number, suggestDish: SuggestDish) {
    return this.http.post<Dish>(this.menuUrl + '/' + menuId + '/suggest', suggestDish);
  }

  public randomGenerateMenu(menuId: number, userId: number, startDate: string, endDate: string) {
    let params = new HttpParams().set('userId', userId.toString());
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    return this.http.post<Menu>(this.menuUrl + '/' + menuId + '/random', {}, { params: params });
  }

  public generateValidMenu(menuId: number, userId: number, startDate: string, endDate: string) {
    let params = new HttpParams().set('userId', userId.toString());
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    return this.http.post<Menu>(this.menuUrl + '/' + menuId + '/valid', {}, { params: params });
  }

  public updateDishDateOnMenu(menuId: number, updateDishOnMenu: UpdateDishOnMenu) {
    return this.http.put<Menu>(this.menuUrl + '/' + menuId + '/dish', updateDishOnMenu);
  }

  public fillMenuFromTemplate(menuId: number, fillMenu: FillMenuFromTemplate) {
    return this.http.put<Menu>(this.menuUrl + '/' + menuId + '/template', fillMenu);
  }

  public removeDishFromMenu(menuId: number, addDishToMenu: AddDishToMenu) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: addDishToMenu
    };
    return this.http.delete<BackendResponse>(this.menuUrl + '/' + menuId + '/dish', httpOptions);
  }

  public formatDate(startDate: Date) {
    return startDate.getFullYear() + '-' +
           ('0' + (startDate.getMonth() + 1)).slice(-2) + '-' +
           ('0' + startDate.getDate()).slice(-2);
  }

  public formatDateWithHour(startDate: Date) {
    if (startDate) {
      return startDate.getFullYear() + '-' +
            ('0' + (startDate.getMonth() + 1)).slice(-2) + '-' +
            ('0' + startDate.getDate()).slice(-2) + ' ' +
            ('0' + startDate.getHours()).slice(-2) + ':' +
            ('0' + startDate.getMinutes()).slice(-2) + ':' +
            ('0' + startDate.getSeconds()).slice(-2) + '.' + '0';
    } else {
      return '';
    }
  }

  public getDaysDiff(firstDate: string, secondDate: string) {
    const a = moment(firstDate, 'YYYY-MM-DD');
    const b = moment(secondDate, 'YYYY-MM-DD');
    return Math.abs(b.diff(a, 'days'));
  }

}
