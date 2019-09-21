import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarWeekViewAddDishComponent } from './calendar-week-view-add-dish.component';

describe('CalendarWeekViewAddDishComponent', () => {
  let component: CalendarWeekViewAddDishComponent;
  let fixture: ComponentFixture<CalendarWeekViewAddDishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarWeekViewAddDishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarWeekViewAddDishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
