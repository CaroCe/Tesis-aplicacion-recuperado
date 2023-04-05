import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGeneralErrorComponent } from './dialog-general-error.component';

describe('DialogGeneralErrorComponent', () => {
  let component: DialogGeneralErrorComponent;
  let fixture: ComponentFixture<DialogGeneralErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogGeneralErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogGeneralErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
