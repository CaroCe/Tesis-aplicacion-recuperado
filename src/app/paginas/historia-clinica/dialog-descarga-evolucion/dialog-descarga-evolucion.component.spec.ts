import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDescargaEvolucionComponent } from './dialog-descarga-evolucion.component';

describe('DialogDescargaEvolucionComponent', () => {
  let component: DialogDescargaEvolucionComponent;
  let fixture: ComponentFixture<DialogDescargaEvolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDescargaEvolucionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDescargaEvolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
