import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { usersRoutes } from './users.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Material } from '../../material';
import { UsuariosService } from './users.service';



@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(usersRoutes),
    ReactiveFormsModule,
    FormsModule,
    Material
  ],
  providers:[
    UsuariosService
  ]
})
export class UsersModule { }
