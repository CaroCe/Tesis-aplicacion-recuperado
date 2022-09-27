import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Consulta } from '../consulta';
import { DomSanitizer } from '@angular/platform-browser';
import { TratamientoDias } from '../../tratamiento-casa/tratamiento-casa';

@Component({
  selector: 'app-dialog-vista-consulta',
  templateUrl: './dialog-vista-consulta.component.html',
  styleUrls: ['./dialog-vista-consulta.component.css']
})
export class DialogVistaConsultaComponent implements OnInit {

  
  @ViewChild('canvas') canvas!: ElementRef;
  cx!: CanvasRenderingContext2D;
  cardImageBase64:any;
  dataSourceTratamientos: TratamientoDias[]=[];
  displayedColumnsTratamientos: string[] = ['fase', 'fechaInicio', 'id'];
  constructor(
    private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Consulta,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    
   }

  ngOnInit(): void {
    console.log(this.data.consultaImagen)
    this.cardImageBase64 =  this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.data.consultaImagen}`); 
  }

  guardarConsulta(){

  }

  agregarFase(){

  }
}
