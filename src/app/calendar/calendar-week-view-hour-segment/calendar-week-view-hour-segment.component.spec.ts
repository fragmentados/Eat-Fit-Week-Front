import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarWeekViewHourSegmentComponent } from './calendar-week-view-hour-segment.component';

describe('CalendarWeekViewHourSegmentComponent', () => {
  let component: CalendarWeekViewHourSegmentComponent;
  let fixture: ComponentFixture<CalendarWeekViewHourSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarWeekViewHourSegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarWeekViewHourSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
