import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForoRoutingModule } from './foro-routing.module';
import { DialogForo, ForoComponent } from './foro.component';
import { AdminForoComponent, DialogForoFase } from './admin-foro/admin-foro.component';
import { DialogLoginForoComponent } from './dialog-login-foro/dialog-login-foro.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Material } from '../../material';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { ForoService } from '../../servicios/foro.service';
import { CitasModule } from '../citas/citas.module';
import { AdministracionModule } from '../administracion/administracion.module';
import { HistoriaClinicaModule } from '../historia-clinica/historia-clinica.module';
import { TratamientoModule } from '../tratamiento/tratamiento.module';


@NgModule({
  declarations: [
    DialogForo,
    AdminForoComponent,
    ForoComponent,
    DialogForoFase,
    DialogLoginForoComponent,
  ],
  imports: [
    CommonModule,
    ForoRoutingModule,
    MatFormFieldModule,
    MatFormFieldModule,
    Material,
    MatSortModule,
    MatCardModule,
    ReactiveFormsModule,
    AdministracionModule,
    CitasModule,
    HistoriaClinicaModule,
    TratamientoModule
  ],
  providers: [
    ForoService
  ]
})
export class ForoModule { }
