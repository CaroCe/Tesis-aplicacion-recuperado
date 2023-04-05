import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'administracion', 
        loadChildren: () => import('../paginas/administracion/administracion.module').then(m => m.AdministracionModule),
      },
      {
        path:'foro',
        loadChildren: () => import('../paginas/foro/foro.module').then(m => m.ForoModule),
      },
      {
        path:'citas',
        loadChildren: () => import('../paginas/citas/citas.module').then(m => m.CitasModule),
      },
      {
        path:'historia-clinica',
        loadChildren: () => import('../paginas/historia-clinica/historia-clinica.module').then(m => m.HistoriaClinicaModule),
      },
      {
        path:'tratamientos',
        loadChildren: () => import('../paginas/tratamiento/tratamiento.module').then(m => m.TratamientoModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentesRoutingModule { }
