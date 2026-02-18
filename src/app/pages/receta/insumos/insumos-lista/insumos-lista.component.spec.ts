import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosListaComponent } from './insumos-lista.component';

describe('InsumosListaComponent', () => {
  let component: InsumosListaComponent;
  let fixture: ComponentFixture<InsumosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsumosListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsumosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
