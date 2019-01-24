import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArraySetComponent } from './array-set.component';

describe('ArraySetComponent', () => {
  let component: ArraySetComponent;
  let fixture: ComponentFixture<ArraySetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArraySetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArraySetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
