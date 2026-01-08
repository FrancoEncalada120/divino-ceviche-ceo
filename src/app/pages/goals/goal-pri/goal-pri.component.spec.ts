import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalPriComponent } from './goal-pri.component';

describe('GoalPriComponent', () => {
  let component: GoalPriComponent;
  let fixture: ComponentFixture<GoalPriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalPriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalPriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
