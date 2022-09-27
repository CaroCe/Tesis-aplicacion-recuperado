import { Component, OnInit } from '@angular/core';
import { Cita } from './citas';

@Component({
  selector: 'app-mis-citas',
  templateUrl: './mis-citas.component.html',
  styleUrls: ['./mis-citas.component.css']
})
export class MisCitasComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'estado', 'observacion', 'accion'];
  dataSource:Cita[] = [{
    "id": 1,
    "fecha": "9/1/2021",
    "observacion": "VP Accounting",
    "estado": "Terminada",
    "estadoId": 1
  }, {
    "id": 2,
    "fecha": "7/19/2021",
    "observacion": "Geologist III",
    "estado": "Terminada",
    "estadoId": 2
  }, {
    "id": 3,
    "fecha": "11/16/2021",
    "observacion": "Office Assistant IV",
    "estado": "Terminada",
    "estadoId": 3
  }, {
    "id": 4,
    "fecha": "9/22/2022",
    "observacion": "Geological Engineer",
    "estado": "Pendiente",
    "estadoId": 4
  }, {
    "id": 5,
    "fecha": "3/1/2022",
    "observacion": "General Manager",
    "estado": "Terminada",
    "estadoId": 5
  }, {
    "id": 6,
    "fecha": "6/10/2022",
    "observacion": "Quality Engineer",
    "estado": "Terminada",
    "estadoId": 6
  }, {
    "id": 7,
    "fecha": "8/30/2021",
    "observacion": "Community Outreach Specialist",
    "estado": "Terminada",
    "estadoId": 7
  }, {
    "id": 8,
    "fecha": "5/8/2022",
    "observacion": "Design Engineer",
    "estado": "Terminada",
    "estadoId": 8
  }, {
    "id": 9,
    "fecha": "2/7/2022",
    "observacion": "Analyst Programmer",
    "estado": "Pendiente",
    "estadoId": 9
  }, {
    "id": 10,
    "fecha": "11/19/2021",
    "observacion": "Research Nurse",
    "estado": "Terminada",
    "estadoId": 10
  }];
  constructor() { }

  ngOnInit(): void {
  }

}
