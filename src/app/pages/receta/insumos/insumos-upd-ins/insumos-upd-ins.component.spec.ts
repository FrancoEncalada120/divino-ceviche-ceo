import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosUpdInsComponent } from './insumos-upd-ins.component';

describe('InsumosUpdInsComponent', () => {
  let component: InsumosUpdInsComponent;
  let fixture: ComponentFixture<InsumosUpdInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsumosUpdInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsumosUpdInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
