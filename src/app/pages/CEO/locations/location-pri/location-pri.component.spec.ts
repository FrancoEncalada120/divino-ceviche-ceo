import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPriComponent } from './location-pri.component';

describe('LocationPriComponent', () => {
  let component: LocationPriComponent;
  let fixture: ComponentFixture<LocationPriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationPriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationPriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
