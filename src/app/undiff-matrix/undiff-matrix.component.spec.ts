import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UndiffMatrixComponent } from './undiff-matrix.component';

describe('UndiffMatrixComponent', () => {
  let component: UndiffMatrixComponent;
  let fixture: ComponentFixture<UndiffMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UndiffMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndiffMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
