import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPriComponent } from './inventory-pri.component';

describe('InventoryPriComponent', () => {
  let component: InventoryPriComponent;
  let fixture: ComponentFixture<InventoryPriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryPriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryPriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
