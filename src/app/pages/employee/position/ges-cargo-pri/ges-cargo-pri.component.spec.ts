import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GesCargoPriComponent } from './ges-cargo-pri.component';

describe('GesCargoPriComponent', () => {
  let component: GesCargoPriComponent;
  let fixture: ComponentFixture<GesCargoPriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GesCargoPriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GesCargoPriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
