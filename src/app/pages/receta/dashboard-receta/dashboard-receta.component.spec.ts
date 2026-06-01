import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRecetaComponent } from './dashboard-receta.component';

describe('DashboardRecetaComponent', () => {
  let component: DashboardRecetaComponent;
  let fixture: ComponentFixture<DashboardRecetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRecetaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRecetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
