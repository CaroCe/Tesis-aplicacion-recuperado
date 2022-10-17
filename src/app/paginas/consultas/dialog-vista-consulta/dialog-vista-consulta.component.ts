import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Consulta } from '../consulta';
import { DomSanitizer } from '@angular/platform-browser';
import { TratamientoDias } from '../../tratamiento-casa/tratamiento-casa';
import { DialogTratamientoFase } from '../consultas.component';
import { FaseTratamiento } from '../../tratamiento/tratamiento';
import { TratamientoService } from '../../../servicios/tratamiento.service';

@Component({
  selector: 'app-dialog-vista-consulta',
  templateUrl: './dialog-vista-consulta.component.html',
  styleUrls: ['./dialog-vista-consulta.component.css']
})
export class DialogVistaConsultaComponent implements OnInit {

  
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  cx!: CanvasRenderingContext2D;
  cardImageBase64:any;
  dataSourceTratamientos: FaseTratamiento[]=[];
  displayedColumnsTratamientos: string[] = ['fase', 'fechaInicio', 'id'];
  constructor(
    private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Consulta,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private _httpTratamientoService: TratamientoService
  ) {
    
   }

  ngOnInit(): void {
    console.log(this.data.consultaImagen?.indexOf('data'))
    if(this.data.consultaImagen?.indexOf('data')===-1){
      this.cardImageBase64 =  this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.data.consultaImagen}`);
    }else{  
      this.cardImageBase64 =  this.sanitizer.bypassSecurityTrustResourceUrl(`${this.data.consultaImagen}`);
    }
    this.cargarFases();
    
  }

  guardarConsulta(){

  }

  cargarFases(){
    this._httpTratamientoService.getTratamientosPorConsulta(Number(this.data.consultaId)).subscribe(resp=>{
      this.dataSourceTratamientos=resp;
    })
  }

  agregarFase(){
    let datos:FaseTratamiento={
      tratamientoId:0,//1,
      tratamientoDias : 0,//2,
      tratamientoFechaInicio: new Date(),//("10/14/2022"),
      tratamientoFase :'',//'fase iniciacion',
      tratamientoDescripcion : '',// 'ejemplo',
      tratamientoObservacion : '',// 'ejemplo observacion',
      tratamientoRecomendacion : '',// 'ejemplo recomendacion',
      consultaId:Number(this.data.consultaId),//1,
      tratamientoFechaCreacion: new Date(),//("10/10/2022"),
      tratamientoCompleto: false,
      tratamientosDia:[]
    }
    const dialogRef = this.dialog.open(DialogTratamientoFase, {
      width: '500px',
      height:'430px',
      data: datos
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cargarFases();
    }); 
  }

  editarFase(datos: FaseTratamiento){
    //this._httpTratamientoService.getTratamientoId(datos.tratamientoId).subscribe(resp=>{
      const dialogRef = this.dialog.open(DialogTratamientoFase, {
        width: '500px',
        height:'430px',
        data: datos
      });
      dialogRef.afterClosed().subscribe(result => {
        this.cargarFases()
      }); 
    //});
  }

  uploadFile() {
    console.log(this.fileInput.nativeElement);
    let formData = new FormData();
    formData.append('imagen', this.fileInput.nativeElement.files[0]);

    this.fileInput.nativeElement.value = '';
  }
}
