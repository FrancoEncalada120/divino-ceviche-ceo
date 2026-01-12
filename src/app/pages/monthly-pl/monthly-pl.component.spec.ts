import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyPlComponent } from './monthly-pl.component';

describe('MonthlyPlComponent', () => {
  let component: MonthlyPlComponent;
  let fixture: ComponentFixture<MonthlyPlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyPlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyPlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
