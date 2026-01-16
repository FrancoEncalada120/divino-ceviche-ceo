import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdInsComponent } from './user-upd-ins.component';

describe('UserUpdInsComponent', () => {
  let component: UserUpdInsComponent;
  let fixture: ComponentFixture<UserUpdInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserUpdInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserUpdInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
