import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarWeekViewShoppingListComponent } from './calendar-week-view-shopping-list.component';

describe('CalendarWeekViewShoppingListComponent', () => {
  let component: CalendarWeekViewShoppingListComponent;
  let fixture: ComponentFixture<CalendarWeekViewShoppingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarWeekViewShoppingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarWeekViewShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
