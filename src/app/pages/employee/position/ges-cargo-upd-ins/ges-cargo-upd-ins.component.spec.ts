import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GesCargoUpdInsComponent } from './ges-cargo-upd-ins.component';

describe('GesCargoUpdInsComponent', () => {
  let component: GesCargoUpdInsComponent;
  let fixture: ComponentFixture<GesCargoUpdInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GesCargoUpdInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GesCargoUpdInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
