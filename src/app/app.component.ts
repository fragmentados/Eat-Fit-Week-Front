import { ApplicationStateService } from './application-state.service';
import { UserService } from './user.service';
import { Component, OnInit } from '@angular/core';
import { User } from './models/user/user.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG } from './models/service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Eat Fit Week';
  currentUser: User;
  isMobile = false;

  constructor(private translate: TranslateService, private router: Router, private userService: UserService,
    private appState: ApplicationStateService) {
    this.translate.setDefaultLang(DEFAULT_LANG);
    this.userService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
    this.isMobile = this.appState.getIsMobileResolution();
  }

  ngOnInit() {
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/users/login']);
  }

  displayMobileNavBar() {
    const x = document.getElementById('myTopnav');
    if (x.className === 'efw-topnav') {
      x.className += ' responsive';
    } else {
      x.className = 'efw-topnav';
    }
  }
}
