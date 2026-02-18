import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailymetricListComponent } from './dailymetric-list.component';

describe('DailymetricListComponent', () => {
  let component: DailymetricListComponent;
  let fixture: ComponentFixture<DailymetricListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailymetricListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailymetricListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
