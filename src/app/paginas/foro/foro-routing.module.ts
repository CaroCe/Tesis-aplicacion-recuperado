import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminForoComponent } from './admin-foro/admin-foro.component';
import { ForoComponent } from './foro.component';

const routes: Routes = [
  {
    path:'',
    
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForoRoutingModule { }
