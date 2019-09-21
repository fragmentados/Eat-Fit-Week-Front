import { MenuService } from './../../menu/menu.service';
import { ApplicationStateService } from './../../application-state.service';
import { Component, OnInit, Input } from '@angular/core';
import { Menu } from '../../models/menu/menu.model';
import { UserConfs } from '../../models/user/userConfs.model';
import { Stat } from '../../models/nutrition/stat.model';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG } from '../../models/service';

@Component({
  selector: 'app-view-stats-dashboard',
  templateUrl: './view-stats-dashboard.component.html',
  styleUrls: ['./view-stats-dashboard.component.css']
})
export class ViewStatsDashboardComponent implements OnInit {

  viewageType: string;
  selectedStats: Stat[];
  selectedDay: string;
  isMobile = true;
  isTablet = false;
  title: string;

  @Input()
  menu: Menu;

  @Input()
  isLastPage: boolean;

  @Input()
  userConfs: UserConfs;

  viewDate: Date;

  @Input()
  events: Observable<void>;

  constructor(private translate: TranslateService, private appStateService: ApplicationStateService, private menuService: MenuService) {
    this.isMobile = this.appStateService.getIsMobileResolution();
    this.isTablet = this.appStateService.getIsTabletResolution();
    this.translate.setDefaultLang(DEFAULT_LANG);
  }

  ngOnInit() {
    if (this.isMobile || this.isTablet) {
      if (this.isMobile && this.isLastPage) {
        this.switchWeekly();
      } else {
        this.switchDaily();
      }
    } else {
      this.switchWeekly();
    }
    this.events.subscribe((menuReceived) => this.updateCurrentSelectedStats(menuReceived));
  }

  switchDaily() {
    this.viewageType = 'Daily';
    this.selectedDay = this.menuService.formatDate(new Date());
    this.updateSelectedDailyStats(null);
    this.translate.get('STAT_DASHBOARD.DAILY_TITLE').subscribe(data => this.title = data);
  }

  switchToCurrentDay() {
    this.viewageType = 'Daily';
    this.selectedStats = null;
  }


  switchWeekly() {
    this.viewageType = 'Weekly';
    this.selectedStats = this.menu.stats;
    this.translate.get('STAT_DASHBOARD.WEEKLY_TITLE').subscribe(data => this.title = data);
  }

  updateCurrentSelectedStats(menuReceived) {
    if (menuReceived.isLastPage) {
      this.switchWeekly();
    } else if (this.isLastPage && !menuReceived.isLastPage) {
      this.switchDaily();
    }
    this.menu = menuReceived.menu;
    this.viewDate = menuReceived.viewDate;
    if (this.viewageType === 'Weekly') {
      this.selectedStats = this.menu.stats;
    } else if (this.viewageType === 'Daily') {
      this.updateSelectedDailyStats(null);
    }
  }

  updateSelectedDailyStats(event) {
    let dayToFilter = this.selectedDay;
    // If it's mobile, we need to take the date from the current day
    if (this.isMobile && this.viewDate) {
      dayToFilter = this.menuService.formatDate(this.viewDate);
    }
    const selectedDayFromMenu = this.menu.days.filter(day => day.date.startsWith(dayToFilter))[0];
    if (selectedDayFromMenu != null) {
      this.selectedStats = [];
      for (const stat of selectedDayFromMenu.stats) {
        this.selectedStats.push(stat);
      }
    } else {
      this.selectedStats = [];
    }
  }

  getMinDate() {
    if (this.isTablet && this.viewDate) {
      return this.menuService.formatDate(this.viewDate);
    } else {
      return this.menu.startDate;
    }
  }

  getMaxMenuDate() {
    if (this.isTablet && this.viewDate) {
      const currentDate = this.menuService.formatDate(this.viewDate);
      const indexOfCurrentDay = this.menu.days.indexOf(this.menu.days.filter(d => d.date === currentDate)[0]);
      return this.menu.days[indexOfCurrentDay + 2].date;
    }
    return this.menu.days[this.menu.days.length - 1].date;
  }

}
