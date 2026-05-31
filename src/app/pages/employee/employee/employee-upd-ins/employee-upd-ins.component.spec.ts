import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeUpdInsComponent } from './employee-upd-ins.component';

describe('EmployeeUpdInsComponent', () => {
  let component: EmployeeUpdInsComponent;
  let fixture: ComponentFixture<EmployeeUpdInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeUpdInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeUpdInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
