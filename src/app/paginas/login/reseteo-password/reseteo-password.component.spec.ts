import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReseteoPasswordComponent } from './reseteo-password.component';

describe('ReseteoPasswordComponent', () => {
  let component: ReseteoPasswordComponent;
  let fixture: ComponentFixture<ReseteoPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReseteoPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReseteoPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
