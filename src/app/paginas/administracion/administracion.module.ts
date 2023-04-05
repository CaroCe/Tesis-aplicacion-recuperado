import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { AdminEjerciciosComponent } from './admin-ejercicios/admin-ejercicios.component';
import { AdminSedesComponent } from './admin-sedes/admin-sedes.component';
import { DialogSede } from './dialog-sede/dialog-sede';
import { DialogEjercicio } from '../historia-clinica/consultas/consultas.component';
import { HorarioEspecialistaComponent, DialogHorario } from './horario-especialista/horario-especialista.component';
import { Material } from '../../material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { AppModule } from '../../app.module';
import { UsersComponent } from './users/users.component';
import { DialogError } from '../../componentes/dialog-general-error/dialog-error';
import { EjerciciosService } from '../../servicios/ejercicios.service';
import { EspecialistaService } from '../../servicios/especialista.service';
import { HorarioService } from '../../servicios/horario.service';
import { RolesService } from '../../servicios/roles.service';
import { SedesService } from '../../servicios/sedes.service';
import { UsuariosService } from '../../servicios/usuarios.service';


@NgModule({
  declarations: [
    AdminEjerciciosComponent,
    AdminSedesComponent,
    DialogSede,
    DialogEjercicio,
    HorarioEspecialistaComponent,
    DialogHorario,
    UsersComponent,
    DialogError
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    Material,
    MatFormFieldModule,
    MatSortModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  exports:[
    DialogEjercicio,
    DialogHorario,
    DialogError,
  ],
  providers: [
    EjerciciosService,
    EspecialistaService,
    HorarioService,
    RolesService,
    SedesService,
    UsuariosService
  ]
})
export class AdministracionModule { }
