import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GesCargoListComponent } from './ges-cargo-list.component';

describe('GesCargoListComponent', () => {
  let component: GesCargoListComponent;
  let fixture: ComponentFixture<GesCargoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GesCargoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GesCargoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
