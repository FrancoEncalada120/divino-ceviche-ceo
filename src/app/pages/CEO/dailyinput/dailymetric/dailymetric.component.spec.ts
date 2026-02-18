import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailymetricComponent } from './dailymetric.component';

describe('DailymetricComponent', () => {
  let component: DailymetricComponent;
  let fixture: ComponentFixture<DailymetricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailymetricComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailymetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
