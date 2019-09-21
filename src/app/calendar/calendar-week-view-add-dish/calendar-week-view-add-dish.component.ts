import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DishRestService } from '../../dish/dishRest.service';
import { Dish } from '../../models/dish/dish.model';
import { UserService } from '../../user.service';
import { User } from '../../models/user/user.model';

@Component({
  selector: 'app-calendar-week-view-add-dish',
  templateUrl: './calendar-week-view-add-dish.component.html',
  styleUrls: ['./calendar-week-view-add-dish.component.css']
})
export class CalendarWeekViewAddDishComponent implements OnInit {

  dishes: Dish[];
  selectedDish: Dish;
  currentUser: User;

  constructor(private userService: UserService, private dishService: DishRestService,
    public dialogRef: MatDialogRef<CalendarWeekViewAddDishComponent>, @Inject(MAT_DIALOG_DATA) public data: Date) {
      this.currentUser = this.userService.currentUserValue;
    }

  ngOnInit() {
    this.dishService.getUserDishes(this.currentUser.id).subscribe(data => {
      this.dishes = data;
    });
  }

}
