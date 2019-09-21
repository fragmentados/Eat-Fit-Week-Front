import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStatsDashboardComponent } from './view-stats-dashboard.component';

describe('ViewStatsDashboardComponent', () => {
  let component: ViewStatsDashboardComponent;
  let fixture: ComponentFixture<ViewStatsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStatsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStatsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
