import { DateAdapter } from "../date-adapters/date-adapter";
import { WeekView } from "./util";
import { CalendarEvent } from "./calendar-common.module";

export declare function getWeekView(dateAdapter: DateAdapter,
  { events, viewDate, weekStartsOn, absolutePositionedEvents,
    hourSegments, dayStart, dayEnd, weekendDays, segmentHeight, viewStart, viewEnd, mealsInWeek }: GetWeekViewArgs): WeekView;

export interface GetWeekViewArgs {
  events?: CalendarEvent[];
  viewDate: Date;
  weekStartsOn: number;
  absolutePositionedEvents?: boolean;
  hourSegments: number;
  dayStart: Time;
  dayEnd: Time;
  weekendDays?: number[];
  segmentHeight: number;
  viewStart?: Date;
  viewEnd?: Date;
  mealsInWeek: string[];
}

interface Time {
  hour: number;
  minute: number;
}
