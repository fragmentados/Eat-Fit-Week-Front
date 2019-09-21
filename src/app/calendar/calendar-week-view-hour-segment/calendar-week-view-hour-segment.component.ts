import { SuggestDish } from './../../models/menu/suggestDish.model';
import { addHours } from 'date-fns';
import { CalendarEvent } from 'calendar-utils';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { WeekViewHourColumn } from '../common/util';
import { MenuService } from '../../menu/menu.service';
import { MatDialog } from '@angular/material/dialog';
import { CalendarWeekViewAddDishComponent } from '../calendar-week-view-add-dish/calendar-week-view-add-dish.component';
import { AddDishToMenu } from '../../models/menu/addDishToMenu.model';
import { Dish } from '../../models/dish/dish.model';
import { DEFAULT_LANG } from '../../models/service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-calendar-week-view-hour-segment',
  templateUrl: './calendar-week-view-hour-segment.component.html',
  styleUrls: ['../calendar-week-view.scss']
})
export class CalendarWeekViewHourSegmentComponent {

  constructor(private translate: TranslateService, private menuService: MenuService, public dialog: MatDialog) {
    this.translate.setDefaultLang(DEFAULT_LANG);
  }

  @Input() segment: WeekViewHourColumn;

  @Input() segmentHeight: number;

  @Input() segmentWidth: number;

  @Input() isMealLabel: boolean;

  @Input() locale: string;

  @Input() menuId: number;

  /**
   * Called when a dish is added to the menu
   */
  @Output()
  dishAdded = new EventEmitter<{
    event: CalendarEvent;
    dish: Dish;
  }>();

  addDishPopup() {
    const dialogRef = this.dialog.open(CalendarWeekViewAddDishComponent, {
      width: '600px',
      data: this.segment.date
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      const addDishToMenu: AddDishToMenu = new AddDishToMenu();
      addDishToMenu.date = this.menuService.formatDateWithHour(this.segment.date);
      addDishToMenu.dishId = result.id;
      this.menuService.addDishToMenu(this.menuId, addDishToMenu).subscribe(data => {
        console.log(`Dish added to menu: ${data}`);
        this.dishAdded.emit({
          event: {
            start: this.segment.date,
            end: addHours(this.segment.date, 1),
            title: result.name,
            draggable: true
          },
          dish: result
        });
      });
    });
  }

  suggestDish() {
    const suggestDish = new SuggestDish();
    suggestDish.date = this.menuService.formatDateWithHour(this.segment.date);
    this.menuService.suggestDishForMenu(this.menuId, suggestDish).subscribe(data => {
      console.log(`Dish added to menu: ${data}`);
        this.dishAdded.emit({
          event: {
            start: this.segment.date,
            end: addHours(this.segment.date, 1),
            title: data.name,
            draggable: true
          },
          dish: data
        });
    })
  }
}
