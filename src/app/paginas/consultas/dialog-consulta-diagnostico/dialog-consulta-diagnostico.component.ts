import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-consulta-diagnostico',
  templateUrl: './dialog-consulta-diagnostico.component.html',
  styleUrls: ['./dialog-consulta-diagnostico.component.css']
})
export class DialogConsultaDiagnosticoComponent implements OnInit {

  displayedColumnsEvolucion: string[] = ['fecha', 'descripcion', 'id'];
  dataSource = [];
  dataSourceEvolucion = []
  constructor() { }

  ngOnInit(): void {
  }

  agregarEvolucion(){

  }
}
