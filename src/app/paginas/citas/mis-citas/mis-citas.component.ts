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
  isLoadingResults:boolean=false;
  displayedColumns: string[] = ['fecha', 'hora','especialista', 'paciente', 'observacion', 'estado', 'accion'];
  dataSource:CitaAdmin[] = [];
  usuarioId:number=0;
  rolId:number=0;
  constructor(private _httpCita:CitasService,
    private _httpUsuarioService: UsuariosService,) {
    
    this.usuarioId=Number(localStorage.getItem("userId"))
    this._httpUsuarioService.getUsuarioId(this.usuarioId).subscribe(resp=>{
      this.rolId=resp.rolId;      
    });
    this.buscarCitas();
  }

  ngOnInit(): void {
  }

  buscarCitas(){
    let filtro = {
      fechaDesde: "2021-01-01",
      fechaHasta: "2050-12-31",
      especialistaId:0,
      pacienteId:0,
      estado:5
    }
    if(this.rolId==1){
      filtro.especialistaId=this.usuarioId;
      filtro.pacienteId=0
    }else if(this.rolId==2){
        filtro.pacienteId=this.usuarioId;
        filtro.especialistaId=0;
    }else{
        filtro.pacienteId=0;
        filtro.especialistaId=0;        
    }
    this._httpCita.getCitas(filtro).subscribe(c=>{
        this.dataSource = c;
        this.isLoadingResults=false;
    },error=>{
      this.isLoadingResults=false;
    });
  }

  cambiarEstado(estado:number,id:number){
    this.isLoadingResults=true;
    this._httpCita .getCambiarEstado(id,estado).subscribe(c=>{
      this.buscarCitas();
    },error=>{
      this.isLoadingResults=false;
    });
  }
}
