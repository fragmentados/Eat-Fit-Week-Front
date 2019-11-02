import { DEFAULT_LANG } from './../../models/service';
import { UserService } from '../../user.service';
import { Component, OnInit } from '@angular/core';
import { Login } from '../../models/user/login.model';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginResponse } from 'ngx-facebook';
import { TranslateService } from '@ngx-translate/core';

// imports above
declare var window: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: Login = new Login();

  constructor(private translate: TranslateService, private router: Router, private userService: UserService) {
    this.translate.setDefaultLang(DEFAULT_LANG);
  }

  public onLoginClick() {
    this.userService.loginFacebook().then((response: LoginResponse) => {
      console.log(response);
      if (response.status === 'connected') {
        // TODO REMOVE THIS WHEN CORRECT USER MANAGEMENT
        this.userService.getFacebookProfile().then((res: any) => {
          console.log('Got the user profile', res);
        });
        this.userService.fakeLoginElias(response.authResponse.userID, response.authResponse.accessToken);
        this.router.navigate(['/menu']);
      }
    });
  }

  ngOnInit() {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }

  loginAttempt() {
    this.userService.login(this.login).pipe(first())
    .subscribe(
      data => {
        this.router.navigate(['/menu']);
      },
      error => {
        alert('Error');
      }
    );
  }

}
