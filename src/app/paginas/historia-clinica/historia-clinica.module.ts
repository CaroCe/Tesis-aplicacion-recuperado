import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoriaClinicaRoutingModule } from './historia-clinica-routing.module';
import { DialogHistoriaClinica, HistoriaClinicaComponent, DialogDescargaHistoria } from './historia-clinica.component';
import { BuscarConsultaComponent } from './buscar-consulta/buscar-consulta.component';
import { ConsultasComponent, DialogTratamientoFase, DialogEvolucion, DialogDescargaFisioterapeutico } from './consultas/consultas.component';
import { DialogVistaConsultaComponent } from './dialog-vista-consulta/dialog-vista-consulta.component';
import { DialogConsultaDiagnosticoComponent } from './dialog-consulta-diagnostico/dialog-consulta-diagnostico.component';
import { DialogConsultaEvaluacionComponent } from './dialog-consulta-evaluacion/dialog-consulta-evaluacion.component';
import { DialogEditarEvolucionComponent } from './dialog-editar-evolucion/dialog-editar-evolucion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { Material } from '../../material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HistoriaClinicaService } from './historia-clinica.service';
import { ConsultasService } from '../../servicios/consulta.service';
import { AdministracionModule } from '../administracion/administracion.module';
import { EvolucionService } from '../../servicios/evolucion.service';
import { TratamientoService } from '../../servicios/tratamiento.service';
import { DialogDescargaEvolucionComponent } from './dialog-descarga-evolucion/dialog-descarga-evolucion.component';


@NgModule({
  declarations: [
    DialogHistoriaClinica,
    HistoriaClinicaComponent,
    DialogDescargaHistoria,
    BuscarConsultaComponent,
    ConsultasComponent,
    DialogTratamientoFase,
    DialogEvolucion,
    DialogVistaConsultaComponent,
    DialogConsultaDiagnosticoComponent,
    DialogConsultaEvaluacionComponent,
    DialogEditarEvolucionComponent,
    DialogDescargaFisioterapeutico,
    DialogDescargaEvolucionComponent,
    
  ],
  imports: [
    CommonModule,
    HistoriaClinicaRoutingModule,
    MatFormFieldModule,
    Material,
    MatSortModule,
    MatCardModule,
    ReactiveFormsModule,
    AdministracionModule,
    
    
  ],
  exports: [
    DialogTratamientoFase,
    DialogEvolucion,
    DialogConsultaDiagnosticoComponent,
    DialogConsultaEvaluacionComponent,
    DialogEditarEvolucionComponent,
    DialogDescargaFisioterapeutico,
    DialogHistoriaClinica,
    DialogDescargaHistoria
  ],
  providers: [
    HistoriaClinicaService,
    ConsultasService,EvolucionService,
    TratamientoService
    
  ],
  
})
export class HistoriaClinicaModule { }
