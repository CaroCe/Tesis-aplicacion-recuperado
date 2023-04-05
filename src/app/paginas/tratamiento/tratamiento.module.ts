import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TratamientoRoutingModule } from './tratamiento-routing.module';
import { TratamientoComponent, DialogTratamientos, DialogDescargaTratamiento } from './tratamiento.component';
import { TratamientoCasaComponent, DialogTratamientoCasa, SafePipe } from './tratamiento-casa/tratamiento-casa.component';
import { SeguimientoComponent, DialogSeguimiento } from './seguimiento/seguimiento.component';
import { TratamientoService } from 'src/app/servicios/tratamiento.service';
import { CitasModule } from '../citas/citas.module';
import { HistoriaClinicaModule } from '../historia-clinica/historia-clinica.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Material } from '../../material';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { EvolucionService } from '../../servicios/evolucion.service';


@NgModule({
  declarations: [
    TratamientoComponent,
    DialogTratamientos,
    TratamientoCasaComponent,
    DialogTratamientoCasa,
    DialogDescargaTratamiento,
    SafePipe,
    SeguimientoComponent,
    DialogSeguimiento,
  ],
  imports: [
    CommonModule,
    TratamientoRoutingModule,
    HistoriaClinicaModule,
    MatFormFieldModule,
    Material,
    MatSortModule,
    MatCardModule,
    ReactiveFormsModule,
    HistoriaClinicaModule
  ],
  exports:[
    DialogTratamientoCasa,
    DialogDescargaTratamiento,
    DialogSeguimiento,
    
  ],
  providers:[
    TratamientoService
  ]
})
export class TratamientoModule { }
