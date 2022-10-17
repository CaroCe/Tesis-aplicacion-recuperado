import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConsultaEvaluacionComponent } from './dialog-consulta-evaluacion.component';

describe('DialogConsultaEvaluacionComponent', () => {
  let component: DialogConsultaEvaluacionComponent;
  let fixture: ComponentFixture<DialogConsultaEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConsultaEvaluacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConsultaEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
