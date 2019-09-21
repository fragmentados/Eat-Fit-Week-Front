import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSaveTemplateComponent } from './menu-save-template.component';

describe('MenuSaveTemplateComponent', () => {
  let component: MenuSaveTemplateComponent;
  let fixture: ComponentFixture<MenuSaveTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuSaveTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSaveTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
