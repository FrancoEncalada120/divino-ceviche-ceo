import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePositionListComponent } from './employee-position-list.component';

describe('EmployeePositionListComponent', () => {
  let component: EmployeePositionListComponent;
  let fixture: ComponentFixture<EmployeePositionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePositionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePositionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
