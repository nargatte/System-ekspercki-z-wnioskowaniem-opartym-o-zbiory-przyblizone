import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesExplanationComponent } from './rules-explanation.component';

describe('RulesExplanationComponent', () => {
  let component: RulesExplanationComponent;
  let fixture: ComponentFixture<RulesExplanationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesExplanationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
