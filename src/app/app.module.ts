import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './paginas/login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Material } from './material';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './paginas/login/auth.guard';
import { LoginService } from './paginas/login/login.service';
import { DialogRegistro } from './paginas/login/dialogs/dialog-registro/dialog-registro';
import { ReseteoPasswordComponent } from './paginas/login/reseteo-password/reseteo-password.component';
import { ComponentesModule } from './componentes/componentes.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from './paginas/login/auth.service';
import { HomeComponent } from './paginas/home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DialogRegistro,
    ReseteoPasswordComponent,
    HomeComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    Material,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
