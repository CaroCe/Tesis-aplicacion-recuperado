import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './paginas/nav/nav.component';
import { LoginComponent } from './paginas/login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Material } from './material';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './paginas/login/auth.service';
import { AuthGuard } from './paginas/login/auth.guard';
import { LoginService } from './paginas/login/login.service';
import { NavService } from './paginas/nav/nav.service';
import { DialogRegistro } from './paginas/login/dialogs/dialog-registro/dialog-registro';
import { DialogHistoriaClinica, HistoriaClinicaComponent, DialogDescargaHistoria } from './paginas/historia-clinica/historia-clinica.component';
import { DialogHorario, HorarioEspecialistaComponent } from './paginas/horario-especialista/horario-especialista.component';
import { DialogGeneral } from './paginas/dialog-general/dialog-general';
import { DialogError } from './paginas/dialog-general-error/dialog-error';
import { AdminEjerciciosComponent } from './paginas/admin-ejercicios/admin-ejercicios.component';
import { AdminSedesComponent } from './paginas/admin-sedes/admin-sedes.component';
import { DialogSede } from './paginas/admin-sedes/dialog-sede/dialog-sede';
import { AgendarCitaComponent, DialogAgendarCita } from './paginas/citas/agendar-cita/agendar-cita.component';
import { MisCitasComponent } from './paginas/citas/mis-citas/mis-citas.component';
import { AdministracionCitasComponent } from './paginas/citas/administracion-citas/administracion-citas.component';
import { ConsultasComponent, DialogDescargaFisioterapeutico, DialogEjercicio, DialogEvolucion, DialogTratamientoFase } from './paginas/consultas/consultas.component';
import { BuscarConsultaComponent } from './paginas/consultas/buscar-consulta/buscar-consulta.component';
import { DialogTratamientos, TratamientoComponent, DialogDescargaTratamiento } from './paginas/tratamiento/tratamiento.component';
import { DialogTratamientoCasa, TratamientoCasaComponent, SafePipe } from './paginas/tratamiento-casa/tratamiento-casa.component';
import { DialogSeguimiento, SeguimientoComponent } from './paginas/seguimiento/seguimiento.component';
import { AdminForoComponent, DialogForoFase } from './paginas/admin-foro/admin-foro.component';
import { DialogForo, ForoComponent } from './paginas/foro/foro.component';
import { DialogVistaConsultaComponent } from './paginas/consultas/dialog-vista-consulta/dialog-vista-consulta.component';
import { DialogConsultaDiagnosticoComponent } from './paginas/consultas/dialog-consulta-diagnostico/dialog-consulta-diagnostico.component';
import { DialogConsultaEvaluacionComponent } from './paginas/consultas/dialog-consulta-evaluacion/dialog-consulta-evaluacion.component';
import { DialogEditarEvolucionComponent } from './paginas/consultas/dialog-editar-evolucion/dialog-editar-evolucion.component';
import { DialogGeneralErrorComponent } from './paginas/dialog-general-error/dialog-general-error.component';
import { DialogLoginForoComponent } from './paginas/foro/dialog-login-foro/dialog-login-foro.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    DialogRegistro,
    HistoriaClinicaComponent,
    HorarioEspecialistaComponent,
    DialogGeneral,
    DialogError,
    DialogHorario,
    AdminEjerciciosComponent,
    AdminSedesComponent,
    DialogSede,
    AgendarCitaComponent,
    DialogAgendarCita,
    MisCitasComponent,
    AdministracionCitasComponent,
    ConsultasComponent,
    DialogHistoriaClinica,
    BuscarConsultaComponent,
    DialogTratamientoFase,
    DialogEjercicio,
    DialogEvolucion,
    TratamientoComponent,
    DialogTratamientos,
    TratamientoCasaComponent,
    DialogTratamientoCasa,
    SeguimientoComponent,
    DialogSeguimiento,
    AdminForoComponent,
    ForoComponent,
    DialogVistaConsultaComponent,
    DialogConsultaDiagnosticoComponent,
    DialogConsultaEvaluacionComponent,
    DialogEditarEvolucionComponent,
    DialogGeneralErrorComponent,
    DialogDescargaTratamiento,
    DialogDescargaHistoria,
    DialogDescargaFisioterapeutico,
    DialogForo,
    SafePipe,
    DialogForoFase,
    DialogLoginForoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Material,
    HttpClientModule,
  ],
  providers: [AuthService,
    AuthGuard,
    LoginService,
    NavService],
  bootstrap: [AppComponent]
})
export class AppModule { }
