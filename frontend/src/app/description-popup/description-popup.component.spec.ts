import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescriptionPopupComponent } from './description-popup.component';

describe('DescriptionPopupComponent', () => {
  let component: DescriptionPopupComponent;
  let fixture: ComponentFixture<DescriptionPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescriptionPopupComponent]
    });
    fixture = TestBed.createComponent(DescriptionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
