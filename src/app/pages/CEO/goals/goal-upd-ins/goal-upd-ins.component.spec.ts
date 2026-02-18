import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalUpdInsComponent } from './goal-upd-ins.component';

describe('GoalUpdInsComponent', () => {
  let component: GoalUpdInsComponent;
  let fixture: ComponentFixture<GoalUpdInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalUpdInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalUpdInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
