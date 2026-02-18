import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePriComponent } from './purchase-pri.component';

describe('PurchasePriComponent', () => {
  let component: PurchasePriComponent;
  let fixture: ComponentFixture<PurchasePriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasePriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasePriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
