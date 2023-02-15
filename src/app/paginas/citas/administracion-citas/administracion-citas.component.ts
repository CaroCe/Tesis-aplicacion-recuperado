import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EspecialistaService } from 'src/app/servicios/especialista.service';
import { Usuario } from '../../users/user';
import { CitasService } from '../citas.service';
import { CitaAdmin } from '../mis-citas/citas';
import { UserService } from '../../login/user.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Correo } from '../../login/login.interface';
import { environment } from '../../../../environments/environment.prod';
import { LoginService } from '../../login/login.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogGeneral } from '../../dialog-general/dialog-general';

@Component({
  selector: 'app-administracion-citas',
  templateUrl: './administracion-citas.component.html',
  styleUrls: ['./administracion-citas.component.css']
})
export class AdministracionCitasComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl<Date>(new Date()),
    end: new FormControl<Date>(new Date()),
  });
  displayedColumns: string[] = ['fecha','hora','especialista','paciente', 'observacion', 'estado', 'accion'];
  dataSource:CitaAdmin[] = [];
  
  listaEspecialistas: Usuario[] = [];
  
  listaPacientes: Usuario[] = [];

  especialistaId = new FormControl(0);
  pacienteId = new FormControl(0);
  estado = new FormControl(5);
  constructor(
    private dialog:MatDialog,
    private _httpEspecialistaService:EspecialistaService,private _httpCita:CitasService, private _httpUsuarioService:UsuariosService, private http: LoginService) {
    
    _httpEspecialistaService.getEspecialistas().subscribe(esp=>{
      this.listaEspecialistas = esp;
    });

    _httpUsuarioService.getUsuarios().subscribe(pas=>{
      this.listaPacientes = pas;
    });
  }
  buscar(){
    let filtro = {
      fechaDesde:this.range.value.start,
      fechaHasta:this.range.value.end,
      especialistaId:this.especialistaId.value,
      pacienteId:this.pacienteId.value,
      estado:this.estado.value
    } 
    this._httpCita.getCitas(filtro).subscribe(c=>{
      this.dataSource = c;
    });
  }
  cambiarEstado(estado:number,id:number){
    this._httpCita.getCambiarEstado(id,estado).subscribe(c=>{
      this.buscar();
    });
  }
  ngOnInit(): void {
  }

  enviarCorreo(cita:CitaAdmin){
    let correo:Correo={
      "correo": 'carito.kt1995@gmail.com',
      "correo_trading":environment.emailEmpresa,
      "asunto":"Recordatorio de Cita",
      "body":"<div style='width:80%;padding:10px'><h2>Recordatorio</h2></div><div style='padding: 10px;background: #f3f3f3;border: 1px solid #d6d5d5;text-align:center'><p> Usted tiene una cita pendiente el día: <strong>"+cita.fecha+"</strong> a la hora: <strong>"+cita.hora+"</strong></p><br><p>Por favor confirme su cita o caso contrario cancele la cita para reagendar proximamente.</p></div></div>"
    }
    this.http.postEnviarCodigo(correo).subscribe(resp=>{
      const dialogRef = this.dialog.open(DialogGeneral, {
        width: '400px',
        data: {
          mensaje:'Correo enviado exitosamente'
        }
      });
    },error=>{
      alert("Hubo un error al enviar mensaje de confirmación");
    })
  }
}
