import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionUpInsComponent } from './conversion-up-ins.component';

describe('ConversionUpInsComponent', () => {
  let component: ConversionUpInsComponent;
  let fixture: ComponentFixture<ConversionUpInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversionUpInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversionUpInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
