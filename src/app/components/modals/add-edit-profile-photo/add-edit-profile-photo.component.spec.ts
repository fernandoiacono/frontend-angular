import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProfilePhotoComponent } from './add-edit-profile-photo.component';

describe('AddEditProfilePhotoComponent', () => {
  let component: AddEditProfilePhotoComponent;
  let fixture: ComponentFixture<AddEditProfilePhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditProfilePhotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProfilePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
