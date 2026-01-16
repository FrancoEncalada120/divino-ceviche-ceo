import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPriComponent } from './user-pri.component';

describe('UserPriComponent', () => {
  let component: UserPriComponent;
  let fixture: ComponentFixture<UserPriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
