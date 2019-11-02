import { Component } from '@angular/core';

import { User } from '../../models/user/user.model';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG } from '../../models/service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  user: User = new User();
  loadDefaultData = false;

  constructor(private translate: TranslateService, private router: Router, private userService: UserService) {
    this.translate.setDefaultLang(DEFAULT_LANG);
  }

  createUser(): void {
    this.userService.createUser(this.user, this.loadDefaultData)
        .subscribe( data => {
          if (data) {
            this.translate.get('ADD_USER.USER_ADDED').subscribe(trans => alert(trans));
            this.router.navigate(['/users/login']);
          }
        });

  }

}
