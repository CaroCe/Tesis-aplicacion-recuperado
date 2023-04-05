import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministracionCitasComponent } from './administracion-citas/administracion-citas.component';
import { MisCitasComponent } from './mis-citas/mis-citas.component';
import { AgendarCitaComponent } from './agendar-cita/agendar-cita.component';
import { AgendarCitaAdminComponent } from './agendar-cita-admin/agendar-cita-admin.component';

const routes: Routes = [
  {
    path:'',
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
      {
        path: 'agendar-cita-admin',
        component: AgendarCitaAdminComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitasRoutingModule { }
