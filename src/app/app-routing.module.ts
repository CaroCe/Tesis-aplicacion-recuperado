import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminEjerciciosComponent } from './paginas/admin-ejercicios/admin-ejercicios.component';
import { AdminForoComponent } from './paginas/admin-foro/admin-foro.component';
import { AdminSedesComponent } from './paginas/admin-sedes/admin-sedes.component';
import { AdministracionCitasComponent } from './paginas/citas/administracion-citas/administracion-citas.component';
import { AgendarCitaComponent } from './paginas/citas/agendar-cita/agendar-cita.component';
import { MisCitasComponent } from './paginas/citas/mis-citas/mis-citas.component';
import { BuscarConsultaComponent } from './paginas/consultas/buscar-consulta/buscar-consulta.component';
import { ConsultasComponent } from './paginas/consultas/consultas.component';
import { ForoComponent } from './paginas/foro/foro.component';
import { HistoriaClinicaComponent } from './paginas/historia-clinica/historia-clinica.component';
import { HorarioEspecialistaComponent } from './paginas/horario-especialista/horario-especialista.component';
import { AuthGuard } from './paginas/login/auth.guard';
import { LoginComponent } from './paginas/login/login.component';
import { NoAuthGuard } from './paginas/login/noAuth.guard';
import { NavComponent } from './paginas/nav/nav.component';
import { SeguimientoComponent } from './paginas/seguimiento/seguimiento.component';
import { TratamientoCasaComponent } from './paginas/tratamiento-casa/tratamiento-casa.component';
import { TratamientoComponent } from './paginas/tratamiento/tratamiento.component';

const routes: Routes = [{
  path: 'login',
  component: LoginComponent,
  canActivate: [NoAuthGuard],
  canActivateChild: [NoAuthGuard]
},
{
  path: '',
  component: NavComponent,
  canActivate:[AuthGuard],
  canActivateChild: [AuthGuard],
  children: [
    {
      path: 'administracion', 
      children: [
        {
          path: 'usuarios', loadChildren: () => import('./paginas/users/users.module').then(m => m.UsersModule)
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
    },
    {
      path:'foro',
      children: [
        {
          path: 'admin-foro',
          component: AdminForoComponent
        },
        {
          path: 'foro',
          component: ForoComponent
        },
      ]
    },
    {
      path:'citas',
      children:[
        {
          path: 'administracion-citas',
          component: AdministracionCitasComponent
        },
        {
          path: 'mis-citas',
          component: MisCitasComponent
        },
        {
          path: 'agendar-cita',
          component: AgendarCitaComponent
        },
      ]
    },
    {
      path:'historia-clinica',
      children: [
        {
          path: 'historia',
          component: HistoriaClinicaComponent
        },
        {
          path: 'buscar-consultas',
          component: BuscarConsultaComponent
        },
        {
          path: 'consultas',
          component: ConsultasComponent
        },
      ]
    },
    {
      path:'tratamientos',
      children:[
        {
          path: 'seguimiento',
          component: SeguimientoComponent
        },
        {
          path: 'tratamiento-casa',
          component: TratamientoCasaComponent
        },
        {
          path: 'tratamientos',
          component: TratamientoComponent
        },
      ]
    },
    {
      path: 'signed-in-redirect',
      pathMatch: 'full',
      redirectTo: ''
    },
    { path: '', pathMatch: 'full', redirectTo: '' },
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
