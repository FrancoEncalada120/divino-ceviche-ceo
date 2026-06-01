import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePriComponent } from './employee-pri.component';

describe('EmployeePriComponent', () => {
  let component: EmployeePriComponent;
  let fixture: ComponentFixture<EmployeePriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
