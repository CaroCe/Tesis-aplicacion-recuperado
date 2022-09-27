import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CitaAdmin } from '../mis-citas/citas';

@Component({
  selector: 'app-administracion-citas',
  templateUrl: './administracion-citas.component.html',
  styleUrls: ['./administracion-citas.component.css']
})
export class AdministracionCitasComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  displayedColumns: string[] = ['fecha','hora','especialista','paciente', 'observacion', 'estado', 'accion'];
  dataSource:CitaAdmin[] = [
    {
      id:1,
      especialista:'Kevin Alomoto',
      estado:'Pendiente',
      estadoId:1,
      fecha:"2022-06-07",
      hora:"10:00",
      observacion:"Sin observación",
      paciente: "Nancy Simbaña"
    },
    {
      id:1,
      especialista:'Kevin Alomoto',
      estado:'Terminado',
      estadoId:1,
      hora:"13:00",
      fecha:"2022-05-02",
      observacion:"Emergencia",
      paciente: "Nancy Simbaña"
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
