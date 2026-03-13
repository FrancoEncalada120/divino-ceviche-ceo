import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseStockComponent } from './purchase-stock.component';

describe('PurchaseStockComponent', () => {
  let component: PurchaseStockComponent;
  let fixture: ComponentFixture<PurchaseStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
