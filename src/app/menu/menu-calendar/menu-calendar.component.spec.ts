import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCalendarComponent } from './menu-calendar.component';

describe('MenuCalendarComponent', () => {
  let component: MenuCalendarComponent;
  let fixture: ComponentFixture<MenuCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
