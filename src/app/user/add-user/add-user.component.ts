import { Component } from '@angular/core';

import { User } from '../../models/user/user.model';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  user: User = new User();

  constructor(private router: Router, private userService: UserService) {}

  createUser(): void {
    this.userService.createUser(this.user)
        .subscribe( data => {
          if (data) {
            alert('User created successfully.');
            this.router.navigate(['/users/login']);
          }
        });

  }

}
