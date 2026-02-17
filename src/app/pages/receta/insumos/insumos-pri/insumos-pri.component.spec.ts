import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosPriComponent } from './insumos-pri.component';

describe('InsumosPriComponent', () => {
  let component: InsumosPriComponent;
  let fixture: ComponentFixture<InsumosPriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsumosPriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsumosPriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
