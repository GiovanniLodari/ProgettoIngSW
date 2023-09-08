import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrganigramComponentComponent } from './edit-organigram-component.component';

describe('EditOrganigramComponentComponent', () => {
  let component: EditOrganigramComponentComponent;
  let fixture: ComponentFixture<EditOrganigramComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditOrganigramComponentComponent]
    });
    fixture = TestBed.createComponent(EditOrganigramComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
