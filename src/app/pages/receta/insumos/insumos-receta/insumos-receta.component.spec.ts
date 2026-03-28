import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosRecetaComponent } from './insumos-receta.component';

describe('InsumosRecetaComponent', () => {
  let component: InsumosRecetaComponent;
  let fixture: ComponentFixture<InsumosRecetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsumosRecetaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsumosRecetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
