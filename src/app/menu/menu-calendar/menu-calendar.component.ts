import { ApplicationStateService } from './../../application-state.service';
import { FacebookService } from 'ngx-facebook';
import { FillMenuFromTemplate } from './../../models/menu/fillMenuFromTemplate.model';
import { OK_CODE, DEFAULT_LANG } from '../../models/service';
import { AddDishToMenu } from './../../models/menu/addDishToMenu.model';
// tslint:disable-next-line:max-line-length
import { CalendarWeekViewShoppingListComponent } from './../../calendar/calendar-week-view-shopping-list/calendar-week-view-shopping-list.component';
import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { Menu } from '../../models/menu/menu.model';
import { addHours } from 'date-fns';
import { MenuDay } from '../../models/menu/menuDay.model';
import { CalendarEvent, CalendarEventTimesChangedEvent } from '../../calendar/common/calendar-common.module';
import {MatDialog} from '@angular/material/dialog';
import { Stat } from '../../models/nutrition/stat.model';
import { UserConfs } from '../../models/user/userConfs.model';
import { UserService } from '../../user.service';
import { Subject } from 'rxjs';
import { User } from '../../models/user/user.model';
import { MenuDish } from '../../models/menu/menuDish.model';
import { UpdateDishOnMenu } from '../../models/menu/updateDishOnMenu.model';
import { MenuTemplateService } from '../menuTemplate.service';
import { CreateMenuTemplate } from '../../models/menu/menutemplate/createMenuTemplate.model';
import { MenuSaveTemplateComponent } from '../menu-save-template/menu-save-template.component';
import { MenuSelectTemplateComponent } from '../menu-select-template/menu-select-template.component';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

class MenuForStatUpdate {
  menu: Menu;
  isLastPage: boolean;
  viewDate: Date;
}

@Component({
  selector: 'app-menu-calendar',
  templateUrl: './menu-calendar.component.html',
  styleUrls: ['./menu-calendar.component.css']
})
export class MenuCalendarComponent implements OnInit {

  view = 'week';
  viewDate: Date = new Date();
  events: CalendarEvent[];
  menu: Menu;
  userConfs: UserConfs;
  mealsInWeek: string[];
  private updateStatsSubject: Subject<MenuForStatUpdate> = new Subject<MenuForStatUpdate>();
  currentUser: User;
  refresh: Subject<any> = new Subject();
  isMobile = true;
  isTablet = true;
  isLastPage = false;
  dayOffset = 1;
  locale: string = DEFAULT_LANG;

  sendUpdateStatsEvent() {
    this.updateStatsSubject.next({
      menu: this.menu,
      isLastPage: this.isLastPage,
      viewDate: this.viewDate
    });
  }

  constructor(private translate: TranslateService, private userService: UserService, private menuService: MenuService,
    private menuTemplateService: MenuTemplateService, private fb: FacebookService,
    private appStateService: ApplicationStateService, public dialog: MatDialog) {
    this.translate.setDefaultLang(DEFAULT_LANG);
    this.currentUser = this.userService.currentUserValue;
    this.isMobile = appStateService.getIsMobileResolution();
    this.isTablet = appStateService.getIsTabletResolution();
    if (this.isMobile) {
      this.dayOffset = 1;
    } else if (this.isTablet) {
      this.dayOffset = 3;
    }
  }

  ngOnInit() {
    this.initMenuAndEvents();
    this.userService.getUserConfs(this.currentUser.id).subscribe(data => {
      this.userConfs = data;
      this.mealsInWeek = this.userConfs.meals.map(meal => meal.name);
    });
  }

  nextDay(ev) {
    if (!this.isLastPage) {
      const currentDayMoment = moment(this.menuService.formatDate(this.viewDate), 'YYYY-MM-DD');
      const nextDayMoment = moment(currentDayMoment).add(this.dayOffset, 'day');
      const endOfWeekMoment = moment(this.menu.startDate, 'YYYY-MM-DD').add(7 - this.dayOffset, 'day');
      if (nextDayMoment < endOfWeekMoment) {
        this.viewDate = new Date(nextDayMoment.format('YYYY-MM-DD'));
        this.refresh.next();
      } else if (currentDayMoment.diff(endOfWeekMoment, 'days') === 0) {
        this.isLastPage = true;
      } else if (nextDayMoment >= endOfWeekMoment) {
        this.viewDate = new Date(endOfWeekMoment.format('YYYY-MM-DD'));
        this.refresh.next();
      }
      this.sendUpdateStatsEvent();
    }
  }

  previousDay(ev) {
    if (this.isLastPage) {
      this.isLastPage = false;
    } else {
      const previousDayMoment = moment(this.menuService.formatDate(this.viewDate), 'YYYY-MM-DD').subtract(this.dayOffset, 'd');
      const menuStartDateMoment = moment(this.menu.startDate, 'YYYY-MM-DD');
      if (previousDayMoment > menuStartDateMoment) {
        this.viewDate = new Date(previousDayMoment.format('YYYY-MM-DD'));
      } else {
        this.viewDate = new Date(menuStartDateMoment.format('YYYY-MM-DD'));
      }
      this.refresh.next();
    }
    this.sendUpdateStatsEvent();
  }

  initMenuAndEvents() {
    this.menuService.getUserMenu(this.currentUser.id, this.viewDate).subscribe(data => {
      if (data.id === null) {
        this.menu = null;
      } else {
        this.menu = data;
        this.events = this.initCalendarEventsWithDishes();
        this.sendUpdateStatsEvent();
      }
    });
  }

  initCalendarEventsWithDishes() {
    this.events = [];
    for (const day of this.menu.days) {
      const dayEvents = this.createCalendarEventsForDay(day);
      for (const event of dayEvents) {
          this.events.push(event);
      }
    }
    return this.events;
  }

  createCalendarEventsForDay(day: MenuDay) {
    const dayMeals: CalendarEvent[] = [];
    for (const meal of day.meals) {
      dayMeals.push(this.createEventFromMenuDish(meal, meal.date));
    }
    return dayMeals;
  }

  createEventFromMenuDish(menuDish: MenuDish, eventDate: string): CalendarEvent {
    const mealDate: Date = new Date(eventDate);
    return {
      start: mealDate,
      end: addHours(mealDate, 1),
      title: menuDish.name,
      draggable: true
    };
  }

  generateShoppingList() {
    this.menuService.getShoppingList(this.menu.id, null, null).subscribe(data => {
      const dialogRef = this.dialog.open(CalendarWeekViewShoppingListComponent, {
        width: '600px',
        data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog closed: ${result}`);
      });
    });
  }

  generateDayShoppingList() {
    const currentDateFormatted = this.menuService.formatDate(this.viewDate);
    this.menuService.getShoppingList(this.menu.id, currentDateFormatted, null).subscribe(data => {
      const dialogRef = this.dialog.open(CalendarWeekViewShoppingListComponent, {
        width: '600px',
        data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog closed: ${result}`);
      });
    });
  }

  generateDayRangeShoppingList() {
    const currentDateFormatted = this.menuService.formatDate(this.viewDate);
    const endDateFormatted = moment(this.menuService.formatDate(this.viewDate), 'YYYY-MM-DD')
                              .add(this.dayOffset - 1, 'd').format('YYYY-MM-DD');
    this.menuService.getShoppingList(this.menu.id, currentDateFormatted, endDateFormatted).subscribe(data => {
      const dialogRef = this.dialog.open(CalendarWeekViewShoppingListComponent, {
        width: '600px',
        data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog closed: ${result}`);
      });
    });
  }

  clearMenu() {
    this.menuService.clearMenu(this.menu.id, null, null).subscribe(data => {
      if (data.errorCode === 0) {
        this.events = [];
        this.menu.days = [];
        this.menu.stats  = [];
        this.sendUpdateStatsEvent();
      }
    });
  }

  clearDay() {
    const currentDateFormatted = this.menuService.formatDate(this.viewDate);
    this.menuService.clearMenu(this.menu.id, currentDateFormatted, null).subscribe(data => {
      if (data.errorCode === 0) {
        this.initMenuAndEvents();
      }
    });
  }

  clearDays() {
    const currentDateFormatted = this.menuService.formatDate(this.viewDate);
    const endDateFormatted = moment(this.menuService.formatDate(this.viewDate), 'YYYY-MM-DD')
                              .add(this.dayOffset - 1, 'd').format('YYYY-MM-DD');
    this.menuService.clearMenu(this.menu.id, currentDateFormatted, endDateFormatted).subscribe(data => {
      if (data.errorCode === 0) {
        this.initMenuAndEvents();
      }
    });
  }

  randomMenu() {
    this.menuService.randomGenerateMenu(this.menu.id, this.currentUser.id, null, null).subscribe(data => {
      this.initMenuAndEvents();
    });
  }

  randomDay() {
    const currentDateFormatted = this.menuService.formatDate(this.viewDate);
    this.menuService.randomGenerateMenu(this.menu.id, this.currentUser.id, currentDateFormatted, null).subscribe(data => {
      this.initMenuAndEvents();
    });
  }

  randomDays() {
    const currentDateFormatted = this.menuService.formatDate(this.viewDate);
    const endDateFormatted = moment(this.menuService.formatDate(this.viewDate), 'YYYY-MM-DD')
                              .add(this.dayOffset - 1, 'd').format('YYYY-MM-DD');
    this.menuService.randomGenerateMenu(this.menu.id, this.currentUser.id, currentDateFormatted, endDateFormatted).subscribe(data => {
      this.initMenuAndEvents();
    });
  }

  validMenu() {
    this.menuService.generateValidMenu(this.menu.id, this.currentUser.id, null, null).subscribe(data => {
      this.initMenuAndEvents();
    });
  }

  validDay() {
    const currentDateFormatted = this.menuService.formatDate(this.viewDate);
    this.menuService.generateValidMenu(this.menu.id, this.currentUser.id, currentDateFormatted, null).subscribe(data => {
      this.initMenuAndEvents();
    });
  }

  validDays() {
    const currentDateFormatted = this.menuService.formatDate(this.viewDate);
    const endDateFormatted = moment(this.menuService.formatDate(this.viewDate), 'YYYY-MM-DD')
                              .add(this.dayOffset - 1, 'd').format('YYYY-MM-DD');
    this.menuService.generateValidMenu(this.menu.id, this.currentUser.id, currentDateFormatted, endDateFormatted).subscribe(data => {
      this.initMenuAndEvents();
    });
  }

  createMenu() {
    this.menuService.createMenu(this.currentUser.id, this.viewDate).subscribe(data => {
      this.initMenuAndEvents();
    });
  }

  saveTemplate() {
      const dialogRef = this.dialog.open(MenuSaveTemplateComponent, {
        width: '600px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(`Dialog closed: ${result}`);
          const createTemplate = new CreateMenuTemplate();
          createTemplate.menuId = this.menu.id;
          createTemplate.userId = this.currentUser.id;
          createTemplate.name = result;
          this.menuTemplateService.saveAsTemplate(createTemplate).subscribe(data => {
            this.translate.get('COMMON.TEMPLATE_SAVED').subscribe(trans => alert(trans));
          });
        }
      });
  }

  fillFromTemplate() {
    const dialogRef = this.dialog.open(MenuSelectTemplateComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const fillFromTemplate = new FillMenuFromTemplate();
        fillFromTemplate.templateId = result.id;
        fillFromTemplate.userId = this.currentUser.id;
        this.menuService.fillMenuFromTemplate(this.menu.id, fillFromTemplate).subscribe(data => {
          this.menu.days = data.days;
          this.menu.stats = data.stats;
          this.sendUpdateStatsEvent();
          this.initCalendarEventsWithDishes();
          this.translate.get('COMMON.MENU_FILLED').subscribe(trans => alert(trans));
        });
      }
    });
  }

  printMenu() {
    const mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>Menu Calendar</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>Menu Calendar</h1>');
    mywindow.document.write(document.getElementById('calendar root div').innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

      return true;
  }

  shareMenu() {
    this.fb.ui(
      {
          method: 'feed',
          message: 'Trying out a description',
          link: 'https://www.edamam.com/'
      });
  }

  updateMenuStatsWithDishStats(dishStats: Stat[]) {
    if (this.menu.stats == null) {
      this.menu.stats = [];
    }
    for (const dishStat of dishStats) {
      const menuStat: Stat = this.menu.stats.find(element => element.name === dishStat.name);
      if (menuStat == null) {
        this.menu.stats.push(dishStat);
      } else {
        this.menu.stats = this.menu.stats.filter(element => element.name !== menuStat.name);
        this.menu.stats.push(new Stat(menuStat.name, (parseFloat(menuStat.value) + parseFloat(dishStat.value)).toString()));
      }
    }
    this.menuService.getUserMenu(this.currentUser.id, this.viewDate).subscribe(data => {
      this.menu = data;
      this.sendUpdateStatsEvent();
    });
  }

  updateMenuStatsWithoutDishStats(dish: MenuDish) {
    for (const dishStat of dish.stats) {
      const menuStat: Stat = this.menu.stats.find(element => element.name === dishStat.name);
      this.menu.stats = this.menu.stats.filter(element => element.name !== menuStat.name);
      if (parseFloat(menuStat.value) - parseFloat(dishStat.value) !== 0) {
        this.menu.stats.push(new Stat(menuStat.name, (parseFloat(menuStat.value) - parseFloat(dishStat.value)).toString()));
      }
    }
    this.sendUpdateStatsEvent();
  }

  handleClickEvent(clickEvent) {
    const dishSelected:  MenuDish = this.getDishIdFromUnformattedDate(clickEvent.event.start);
    const addDishToMenu: AddDishToMenu = new AddDishToMenu();
    addDishToMenu.dishId = dishSelected.id;
    if (clickEvent.shiftKey) {
      this.addDishToFirstSpot(dishSelected, addDishToMenu);
    } else {
      this.deleteDishFromCalendar(clickEvent.event.start, dishSelected, addDishToMenu);
    }
  }

  addDishToFirstSpot(dishSelected: MenuDish, addDishToMenu: AddDishToMenu) {
    this.menuService.addDishToFirstValidSpotMenu(this.currentUser.id, addDishToMenu).subscribe(data => {
      if (data.date) {
        this.updateMenuStatsWithDishStats(dishSelected.stats);
        this.events.push(this.createEventFromMenuDish(dishSelected, data.date));
        this.refresh.next();
      }
    });
  }

  deleteDishFromCalendar(startEvent: Date, dishSelected: MenuDish, addDishToMenu: AddDishToMenu) {
    const dateWithHour: string = this.menuService.formatDateWithHour(startEvent);
    addDishToMenu.date = dateWithHour;
    this.menuService.removeDishFromMenu(this.menu.id, addDishToMenu).subscribe(data => {
      if (data.errorCode === OK_CODE) {
        this.updateMenuStatsWithoutDishStats(dishSelected);
      }
    });
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.menuService.updateDishDateOnMenu(this.menu.id,
      new UpdateDishOnMenu(this.getDishIdFromUnformattedDate(event.start).id,
      this.menuService.formatDateWithHour(event.start),
      this.menuService.formatDateWithHour((newStart)))).subscribe(data => this.menu = data);
      event.start = newStart;
      event.end = newEnd;
      this.refresh.next();
  }

  getDishIdFromUnformattedDate(start): MenuDish {
    const date: string = this.menuService.formatDate(start);
    const dateWithHour: string = this.menuService.formatDateWithHour(start);
    return this.menu.days.filter(day => day.date === date)[0].meals.filter(meal => meal.date === dateWithHour)[0];
  }

  getDaysInWeek() {
    if (this.isMobile) {
      return 1;
    } else if (this.isTablet) {
      return 3;
      // return this.getTabletDaysInWeek();
    } else {
      return 7;
    }
  }

  /*getTabletDaysInWeek(): number {
    let tabletDays = 3;
    const endOfWeek = new Date(this.menu.startDate);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    const endOfWeekAsString = this.menuService.formatDate(endOfWeek);
    const currentDateAsString = this.menuService.formatDate(this.viewDate);
    // If we are near the end of the week
    const endOfWeekDiff = this.menuService.getDaysDiff(currentDateAsString, endOfWeekAsString) + 1;
    if (endOfWeekDiff < tabletDays && endOfWeekDiff > 0) {
      tabletDays = endOfWeekDiff;
    }
    // If we are near the begining of the week
    const startOfWeekDiff = this.menuService.getDaysDiff(this.menu.startDate, currentDateAsString) + 1;
    if ((startOfWeekDiff < tabletDays) && startOfWeekDiff > 0) {
      tabletDays = startOfWeekDiff;
    }

    return tabletDays;
  }*/

  updateMenuWithNewMenu() {
    this.initMenuAndEvents();
  }

}
