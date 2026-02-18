import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceUpdInsComponent } from './invoice-upd-ins.component';

describe('InvoiceUpdInsComponent', () => {
  let component: InvoiceUpdInsComponent;
  let fixture: ComponentFixture<InvoiceUpdInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceUpdInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceUpdInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
