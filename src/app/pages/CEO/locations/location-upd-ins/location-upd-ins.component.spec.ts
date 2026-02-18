import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationUpdInsComponent } from './location-upd-ins.component';

describe('LocationUpdInsComponent', () => {
  let component: LocationUpdInsComponent;
  let fixture: ComponentFixture<LocationUpdInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationUpdInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationUpdInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
