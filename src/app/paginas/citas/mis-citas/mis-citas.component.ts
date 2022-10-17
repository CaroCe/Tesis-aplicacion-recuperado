import { Component, OnInit } from '@angular/core';
import { CitasService } from '../citas.service';
import { Cita, CitaAdmin } from './citas';

@Component({
  selector: 'app-mis-citas',
  templateUrl: './mis-citas.component.html',
  styleUrls: ['./mis-citas.component.css']
})
export class MisCitasComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'estado', 'observacion', 'accion'];
  dataSource:CitaAdmin[] = [];
  constructor(private _httpCita:CitasService) {
    let filtro = {
      fechaDesde: "2021-01-01",
      fechaHasta: "2050-12-31",
      especialistaId:0,
      pacienteId:localStorage.getItem("userId"),
      estado:5
    } 
    this._httpCita.getCitas(filtro).subscribe(c=>{
      this.dataSource = c;
    });
  }

  ngOnInit(): void {
  }
  cambiarEstado(estado:number,id:number){
    this._httpCita .getCambiarEstado(id,estado).subscribe(c=>{
      
    });
  }
}
