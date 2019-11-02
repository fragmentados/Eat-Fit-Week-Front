import { Component, OnInit } from '@angular/core';
import { User } from '../models/user/user.model';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ApplicationStateService } from '../application-state.service';
import { DEFAULT_LANG } from '../models/service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  title = 'Eat Fit Week';
  currentUser: User;
  isMobile = false;

  constructor(private translate: TranslateService, private router: Router, private userService: UserService,
    private appState: ApplicationStateService) {
    this.translate.setDefaultLang(DEFAULT_LANG);
    this.userService.currentUserSubject.subscribe(x => {
      this.currentUser = x;
      this.ngOnInit();
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
