import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConsultaDiagnosticoComponent } from './dialog-consulta-diagnostico.component';

describe('DialogConsultaDiagnosticoComponent', () => {
  let component: DialogConsultaDiagnosticoComponent;
  let fixture: ComponentFixture<DialogConsultaDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConsultaDiagnosticoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConsultaDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
