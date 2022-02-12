import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObrazciComponent } from './obrazci.component';

describe('ObrazciComponent', () => {
  let component: ObrazciComponent;
  let fixture: ComponentFixture<ObrazciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObrazciComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObrazciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
