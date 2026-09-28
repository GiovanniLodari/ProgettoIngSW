import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUnitPopupComponent } from './edit-file-popup.component';

describe('EditUnitPopupComponent', () => {
  let component: EditUnitPopupComponent;
  let fixture: ComponentFixture<EditUnitPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditUnitPopupComponent]
    });
    fixture = TestBed.createComponent(EditUnitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
