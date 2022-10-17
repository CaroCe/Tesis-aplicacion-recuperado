import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EspecialistaService } from 'src/app/servicios/especialista.service';
import { Usuario } from '../../users/user';
import { CitasService } from '../citas.service';
import { CitaAdmin } from '../mis-citas/citas';

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
  constructor(private _httpEspecialistaService:EspecialistaService,private _httpCita:CitasService) {
    
    _httpEspecialistaService.getEspecialistas().subscribe(esp=>{
      this.listaEspecialistas = esp;
    });

    _httpEspecialistaService.getPacientes().subscribe(pas=>{
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

}
