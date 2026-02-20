import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipePriComponent } from './recipe-pri.component';

describe('RecipePriComponent', () => {
  let component: RecipePriComponent;
  let fixture: ComponentFixture<RecipePriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipePriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipePriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
