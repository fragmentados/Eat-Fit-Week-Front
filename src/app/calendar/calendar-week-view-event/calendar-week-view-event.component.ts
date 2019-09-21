import { Component, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { WeekViewAllDayEvent, DayViewEvent } from 'calendar-utils';
import { PlacementArray } from 'positioning';

@Component({
  selector: 'app-calendar-week-view-event',
  templateUrl: './calendar-week-view-event.component.html',
  styleUrls: ['./../calendar-week-view.scss']
})
export class CalendarWeekViewEventComponent {
  @Input() weekEvent: WeekViewAllDayEvent | DayViewEvent;

  @Input() tooltipPlacement: PlacementArray;

  @Input() tooltipAppendToBody: boolean;

  @Input() tooltipDisabled: boolean;

  @Input() tooltipDelay: number | null;

  @Input() customTemplate: TemplateRef<any>;

  @Input() eventTitleTemplate: TemplateRef<any>;

  @Input() eventActionsTemplate: TemplateRef<any>;

  @Input() tooltipTemplate: TemplateRef<any>;

  @Output() eventClicked: EventEmitter<any> = new EventEmitter();
}
