import { Injectable } from '@angular/core';
import {
  GetWeekViewHeaderArgs,
  WeekDay,
  getWeekViewHeader,
  CalendarEvent
} from 'calendar-utils';
import { DateAdapter } from '../date-adapters/date-adapter';
import { Time } from '@angular/common';
import { GetWeekViewArgs, getWeekView } from './calendar-utils';
import { WeekView } from './util';

export interface GetEfwWeekViewArgs {
  events?: CalendarEvent[];
  viewDate: Date;
  weekStartsOn: number;
  excluded?: number[];
  precision?: 'minutes' | 'days';
  absolutePositionedEvents?: boolean;
  hourSegments: number;
  dayStart: Time;
  dayEnd: Time;
  weekendDays?: number[];
  segmentHeight: number;
  viewStart?: Date;
  viewEnd?: Date;
}

@Injectable()
export class CalendarUtils {
  constructor(protected dateAdapter: DateAdapter) {}

  getWeekViewHeader(args: GetWeekViewHeaderArgs): WeekDay[] {
    return getWeekViewHeader(this.dateAdapter, args);
  }

  getWeekView(args: GetWeekViewArgs): WeekView {
    return getWeekView(this.dateAdapter, args);
  }


}
