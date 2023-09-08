import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditFilePopupComponent } from './edit-file-popup.component';

describe('EditFilePopupComponent', () => {
  let component: EditFilePopupComponent;
  let fixture: ComponentFixture<EditFilePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditFilePopupComponent]
    });
    fixture = TestBed.createComponent(EditFilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
