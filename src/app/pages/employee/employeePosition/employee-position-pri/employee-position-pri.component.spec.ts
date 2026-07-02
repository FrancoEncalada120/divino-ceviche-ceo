import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePositionPriComponent } from './employee-position-pri.component';

describe('EmployeePositionPriComponent', () => {
  let component: EmployeePositionPriComponent;
  let fixture: ComponentFixture<EmployeePositionPriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePositionPriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePositionPriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
