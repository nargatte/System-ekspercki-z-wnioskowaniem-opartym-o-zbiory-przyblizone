import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttrSetComponent } from './attr-set.component';

describe('AttrSetComponent', () => {
  let component: AttrSetComponent;
  let fixture: ComponentFixture<AttrSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttrSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttrSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
