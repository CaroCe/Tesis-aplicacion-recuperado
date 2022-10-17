import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLoginForoComponent } from './dialog-login-foro.component';

describe('DialogLoginForoComponent', () => {
  let component: DialogLoginForoComponent;
  let fixture: ComponentFixture<DialogLoginForoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLoginForoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogLoginForoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
