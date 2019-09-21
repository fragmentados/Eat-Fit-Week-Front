export class UpdateDishOnMenu {

  constructor(dishId: number, oldDate: string, newDate: string) {
    this.dishId = dishId;
    this.oldDate = oldDate;
    this.newDate = newDate;
  }

  dishId: number;
  oldDate: string;
  newDate: string;
}
