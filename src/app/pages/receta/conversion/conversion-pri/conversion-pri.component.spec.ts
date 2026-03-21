import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionPriComponent } from './conversion-pri.component';

describe('ConversionPriComponent', () => {
  let component: ConversionPriComponent;
  let fixture: ComponentFixture<ConversionPriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversionPriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversionPriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
