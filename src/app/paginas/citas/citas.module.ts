import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitasRoutingModule } from './citas-routing.module';
import { AgendarCitaComponent, DialogAgendarCita } from './agendar-cita/agendar-cita.component';
import { MisCitasComponent } from './mis-citas/mis-citas.component';
import { AdministracionCitasComponent } from './administracion-citas/administracion-citas.component';
import { AgendarCitaAdminComponent, DialogAgendarCitaAdmin } from './agendar-cita-admin/agendar-cita-admin.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Material } from '../../material';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { CitasService } from './citas.service';
import { EjerciciosService } from '../../servicios/ejercicios.service';
import { EspecialistaService } from '../../servicios/especialista.service';
import { HorarioService } from '../../servicios/horario.service';
import { RolesService } from '../../servicios/roles.service';
import { SedesService } from '../../servicios/sedes.service';
import { UsuariosService } from '../administracion/users/users.service';
import { AdministracionModule } from '../administracion/administracion.module';


@NgModule({
  declarations: [
    AgendarCitaComponent,
    DialogAgendarCita,
    MisCitasComponent,
    AdministracionCitasComponent,
    AgendarCitaAdminComponent,
    DialogAgendarCitaAdmin,
  ],
  imports: [
    CommonModule,
    CitasRoutingModule,
    MatFormFieldModule,
    Material,
    MatSortModule,
    MatCardModule,
    ReactiveFormsModule,
    AdministracionModule
  ],
  providers: [
    CitasService,
    
  ]
})
export class CitasModule { }
