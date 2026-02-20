import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeUpInsComponent } from './recipe-up-ins.component';

describe('RecipeUpInsComponent', () => {
  let component: RecipeUpInsComponent;
  let fixture: ComponentFixture<RecipeUpInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeUpInsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeUpInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
