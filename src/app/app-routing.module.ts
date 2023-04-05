import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './paginas/login/auth.guard';
import { LoginComponent } from './paginas/login/login.component';
import { NoAuthGuard } from './paginas/login/noAuth.guard';
import { NavComponent } from './componentes/nav/nav.component';
import { ReseteoPasswordComponent } from './paginas/login/reseteo-password/reseteo-password.component';
import { ChatComponent } from './componentes/chat/chat.component';
import { HomeComponent } from './paginas/home/home.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard]
  },{
    path: 'reseteo',
    component: ReseteoPasswordComponent,
  },
  {
    path: '',
    component: NavComponent,
    loadChildren: () => import('./componentes/componentes.module').then(m => m.ComponentesModule),
    canActivate:[AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'signed-in-redirect',
    pathMatch: 'full',
    redirectTo: ''
  },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
