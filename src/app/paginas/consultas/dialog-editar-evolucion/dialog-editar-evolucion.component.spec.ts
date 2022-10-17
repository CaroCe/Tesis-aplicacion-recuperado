import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditarEvolucionComponent } from './dialog-editar-evolucion.component';

describe('DialogEditarEvolucionComponent', () => {
  let component: DialogEditarEvolucionComponent;
  let fixture: ComponentFixture<DialogEditarEvolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditarEvolucionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditarEvolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
