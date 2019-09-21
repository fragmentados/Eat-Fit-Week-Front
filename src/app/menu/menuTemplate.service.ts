import { BACKEND_URL } from './../models/service';
import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateMenuTemplate } from '../models/menu/menutemplate/createMenuTemplate.model';
import { BackendResponse } from '../models/backendResponse.model';
import { MenuTemplate } from '../models/menu/menutemplate/menuTemplate.model';

@Injectable()
export class MenuTemplateService {

  constructor(private http: HttpClient) {}

  private menuTemplateUrl = BACKEND_URL + 'menutemplates';

  public saveAsTemplate(create: CreateMenuTemplate) {
    return this.http.post<BackendResponse>(this.menuTemplateUrl, create);
  }

  public getUserTemplates(userId: number) {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<MenuTemplate[]>(this.menuTemplateUrl, {params: params});
  }

}
