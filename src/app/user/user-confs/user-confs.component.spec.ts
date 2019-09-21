import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConfsComponent } from './user-confs.component';

describe('UserConfsComponent', () => {
  let component: UserConfsComponent;
  let fixture: ComponentFixture<UserConfsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserConfsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
