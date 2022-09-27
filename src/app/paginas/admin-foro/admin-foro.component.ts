import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-foro',
  templateUrl: './admin-foro.component.html',
  styleUrls: ['./admin-foro.component.css']
})
export class AdminForoComponent implements OnInit {
  displayedColumns: string[] = ['problema', 'diagnostico', 'fases', 'foro'];
  dataSource = [
    {
      problema:'Dolor tobillo',
      diagnostico:'Fractura cerca del ligamento peroneoastragalino posterior',
      fases:['-Fase 1: Este es un texto de ejemplo de la descripción de la fase','-Fase 2: Este es un texto de ejemplo de la descripción de la fase','-Fase 3: Este es un texto de ejemplo de la descripción de la fase'] ,
      foro:true
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
