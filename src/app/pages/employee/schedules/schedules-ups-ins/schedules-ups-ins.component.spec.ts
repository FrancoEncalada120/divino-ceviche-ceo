import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulesUpsInsComponent } from './schedules-ups-ins.component';

describe('SchedulesUpsInsComponent', () => {
  let component: SchedulesUpsInsComponent;
  let fixture: ComponentFixture<SchedulesUpsInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulesUpsInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulesUpsInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
