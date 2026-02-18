import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailymetriUpdInsComponent } from './dailymetri-upd-ins.component';

describe('DailymetriUpdInsComponent', () => {
  let component: DailymetriUpdInsComponent;
  let fixture: ComponentFixture<DailymetriUpdInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailymetriUpdInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailymetriUpdInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
