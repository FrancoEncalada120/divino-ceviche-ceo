import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePositionUpdInsComponent } from './employee-position-upd-ins.component';

describe('EmployeePositionUpdInsComponent', () => {
  let component: EmployeePositionUpdInsComponent;
  let fixture: ComponentFixture<EmployeePositionUpdInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePositionUpdInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePositionUpdInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
