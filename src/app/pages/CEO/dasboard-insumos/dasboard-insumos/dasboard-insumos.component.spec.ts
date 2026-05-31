import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasboardInsumosComponent } from './dasboard-insumos.component';

describe('DasboardInsumosComponent', () => {
  let component: DasboardInsumosComponent;
  let fixture: ComponentFixture<DasboardInsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DasboardInsumosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DasboardInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
