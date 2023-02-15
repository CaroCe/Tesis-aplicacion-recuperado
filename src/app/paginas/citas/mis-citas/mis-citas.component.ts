import { Component, OnInit } from '@angular/core';
import { CitasService } from '../citas.service';
import { Cita, CitaAdmin } from './citas';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-mis-citas',
  templateUrl: './mis-citas.component.html',
  styleUrls: ['./mis-citas.component.css']
})
export class MisCitasComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'hora','especialista', 'paciente', 'observacion', 'estado', 'accion'];
  dataSource:CitaAdmin[] = [];
  constructor(private _httpCita:CitasService,
    private _httpUsuarioService: UsuariosService,) {
    let filtro = {
      fechaDesde: "2021-01-01",
      fechaHasta: "2050-12-31",
      especialistaId:0,
      pacienteId:0,
      estado:5
    } 
    let usuarioId=Number(localStorage.getItem("userId"))
    this._httpUsuarioService.getUsuarioId(usuarioId).subscribe(resp=>{
      if(resp.rolId==1){
        filtro.especialistaId=usuarioId;
        filtro.pacienteId=0
      }else{
        if(resp.rolId==2){
          filtro.pacienteId=usuarioId;
          filtro.especialistaId=0;
        }
      }
      this._httpCita.getCitas(filtro).subscribe(c=>{
        this.dataSource = c;
      });
    });

  }

  ngOnInit(): void {
  }
  cambiarEstado(estado:number,id:number){
    this._httpCita .getCambiarEstado(id,estado).subscribe(c=>{
      
    });
  }
}
