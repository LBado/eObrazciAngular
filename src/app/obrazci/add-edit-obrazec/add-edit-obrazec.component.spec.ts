import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditObrazecComponent } from './add-edit-obrazec.component';

describe('AddEditObrazecComponent', () => {
  let component: AddEditObrazecComponent;
  let fixture: ComponentFixture<AddEditObrazecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditObrazecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditObrazecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
