import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVistaConsultaComponent } from './dialog-vista-consulta.component';

describe('DialogVistaConsultaComponent', () => {
  let component: DialogVistaConsultaComponent;
  let fixture: ComponentFixture<DialogVistaConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVistaConsultaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogVistaConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
