import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowPriComponent } from './cashflow-pri.component';

describe('CashflowPriComponent', () => {
  let component: CashflowPriComponent;
  let fixture: ComponentFixture<CashflowPriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashflowPriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashflowPriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
