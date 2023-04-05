import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { TratamientoCasaComponent } from './tratamiento-casa/tratamiento-casa.component';
import { TratamientoComponent } from './tratamiento.component';

const routes: Routes = [
  {
    path:'',
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TratamientoRoutingModule { }
