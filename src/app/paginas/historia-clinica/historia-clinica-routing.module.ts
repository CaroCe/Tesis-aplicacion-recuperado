import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoriaClinicaComponent } from './historia-clinica.component';
import { BuscarConsultaComponent } from './buscar-consulta/buscar-consulta.component';
import { ConsultasComponent } from './consultas/consultas.component';

const routes: Routes = [
  {
    path:'',
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoriaClinicaRoutingModule { }
