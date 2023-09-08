import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeesPopupComponent } from './add-employees-popup.component';

describe('AddEmployeesPopupComponent', () => {
  let component: AddEmployeesPopupComponent;
  let fixture: ComponentFixture<AddEmployeesPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEmployeesPopupComponent]
    });
    fixture = TestBed.createComponent(AddEmployeesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
