import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSedesComponent } from './admin-sedes/admin-sedes.component';
import { HorarioEspecialistaComponent } from './horario-especialista/horario-especialista.component';
import { AdminEjerciciosComponent } from './admin-ejercicios/admin-ejercicios.component';
import { UsersComponent } from './users/users.component';
import { AdministracionModule } from './administracion.module';
import { AdministracionCitasComponent } from '../citas/administracion-citas/administracion-citas.component';

const routes: Routes = [
  {
    path:'',
    children: [
      {
        path: 'usuarios', component: UsersComponent
      },
      {
        path: 'admin-sedes',
        component: AdminSedesComponent
      },
      {
        path: 'horario-especialista',
        component: HorarioEspecialistaComponent
      },
      {
        path: 'admin-ejercicios',
        component: AdminEjerciciosComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
