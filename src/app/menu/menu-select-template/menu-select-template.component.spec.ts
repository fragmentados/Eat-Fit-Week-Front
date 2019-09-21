import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSelectTemplateComponent } from './menu-select-template.component';

describe('MenuSelectTemplateComponent', () => {
  let component: MenuSelectTemplateComponent;
  let fixture: ComponentFixture<MenuSelectTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuSelectTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSelectTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
