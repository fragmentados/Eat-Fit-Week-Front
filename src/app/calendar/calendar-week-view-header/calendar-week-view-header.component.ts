import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { WeekDay } from '@angular/common';
import { CalendarEvent } from 'calendar-utils';
import { trackByWeekDayHeaderDate } from '../common/util';

@Component({
  selector: 'app-calendar-week-view-header',
  templateUrl: './calendar-week-view-header.component.html',
  styleUrls: ['../calendar-week-view.scss']
})
export class CalendarWeekViewHeaderComponent {
  @Input() days: WeekDay[];

  @Input() locale: string;

  trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
}
