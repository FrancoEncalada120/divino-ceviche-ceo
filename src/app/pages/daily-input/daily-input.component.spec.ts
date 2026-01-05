import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyInputComponent } from './daily-input.component';

describe('DailyInputComponent', () => {
  let component: DailyInputComponent;
  let fixture: ComponentFixture<DailyInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
