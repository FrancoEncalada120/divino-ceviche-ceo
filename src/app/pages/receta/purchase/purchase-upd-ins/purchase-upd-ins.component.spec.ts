import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseUpdInsComponent } from './purchase-upd-ins.component';

describe('PurchaseUpdInsComponent', () => {
  let component: PurchaseUpdInsComponent;
  let fixture: ComponentFixture<PurchaseUpdInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseUpdInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseUpdInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
