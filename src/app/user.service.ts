import { BACKEND_URL } from './models/service';
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from './models/user/user.model';
import { UserConfs } from './models/user/userConfs.model';
import { Login } from './models/user/login.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Meal } from './models/dish/meal.model';
import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private userUrl = BACKEND_URL + 'users';

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  constructor(private http: HttpClient, private fb: FacebookService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    const initParams: InitParams = {
      appId: '704819356612857',
      xfbml: true,
      version: 'v2.8'
    };

    fb.init(initParams);
  }

  public getUser(userId: number) {
    return this.http.get<User>(this.userUrl + '/' + userId);
  }

  public getUsers() {
    return this.http.get<User[]>(this.userUrl);
  }

  public getUserConfs(userId: number) {
    return this.http.get<UserConfs>(this.userUrl + '/' + userId + '/conf');
  }

  public getUserMeals(userId: number) {
    return this.http.get<Meal[]>(this.userUrl + '/' + userId + '/meals');
  }

  public updateUserConfs(userId: number, userConf: UserConfs) {
    return this.http.post(this.userUrl + '/' + userId + '/conf', userConf);
  }

  public deleteUser(user: User) {
    return this.http.delete(this.userUrl + '/' + user.id);
  }

  public deleteMeal(mealId: number) {
    return this.http.delete(this.userUrl + '/meals/' + mealId);
  }

  public createUser(user: User) {
    return this.http.post<User>(this.userUrl, user);
  }

  public login(login: Login) {
    this.currentUserSubject.next(new User());
    return this.http.post<User>(this.userUrl + '/login', login)
      .pipe(map(user => {
        if (user && user.id) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.notifyUserChange(user);
        }

        return user;
    }));
  }

  public notifyUserChange(user) {
    this.currentUserSubject.next(user);
  }

  public loginFacebook() {
    return this.fb.login();
  }

  public getFacebookProfile() {
    return this.fb.api('/me?fields=first_name, email');
  }

  public fakeLoginElias(facebookUserId: string, accessToken: string) {
    this.getUser(1).subscribe(data => {
      data.facebookUserId = facebookUserId;
      data.accessToken = accessToken;
      localStorage.setItem('currentUser', JSON.stringify(data));
      this.currentUserSubject.next(data);
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.fb.getLoginStatus().then(data => {
      if (data.status === 'connected') {
        this.fb.logout().then(() => {
          console.log('Logged out!');
        });
      }
    });
  }

}
