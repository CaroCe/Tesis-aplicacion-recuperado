import { Component, Inject, OnInit, Pipe, PipeTransform  } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FaseTratamiento, EjercicioTratamiento } from '../tratamiento/tratamiento';
import { TratamientoService } from '../../servicios/tratamiento.service';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { DialogGeneral } from '../dialog-general/dialog-general';

@Component({
  selector: 'app-tratamiento-casa',
  templateUrl: './tratamiento-casa.component.html',
  styleUrls: ['./tratamiento-casa.component.css']
})
export class TratamientoCasaComponent implements OnInit {
  datosTratamiento: FaseTratamiento={
    tratamientoId:0,
    consultaId:0,
    tratamientoFechaCreacion:new Date(),
    tratamientoDias:0,
    tratamientoFechaInicio: new Date(),
    tratamientoObservacion:'',
    tratamientoDescripcion:'',
    tratamientoRecomendacion:'',
    tratamientoFase:'',
    tratamientoCompleto:false,
    tratamientosDia:[],
  }
  diaSemana:string[] = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  listaTratamientos:FaseTratamiento[]=[];
  constructor(private dialog:MatDialog,
    private _httpTratamientoService: TratamientoService,) { 
      this.cargarTratamiento();
    }

  ngOnInit(): void {
  }

  cargarTratamiento(){
      /*_httpTratamientoService.getTratamientoId(1).subscribe(resp=>{
        this.datosTratamiento=resp;
      });*/
    this._httpTratamientoService.getTratamientosPorConsulta(4).subscribe(resp=>{
        this.listaTratamientos=resp
      })
  }

  verEjercicio(ejercicio:EjercicioTratamiento){
    const dialogRef = this.dialog.open(DialogTratamientoCasa, {
      width: '1500px',
      height:'1000px',
      data: ejercicio
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cargarTratamiento();
    }); 
  }
  fechaDia(date:Date): string{
    let fecha= new Date(date);
    let fechaDia= this.diaSemana[fecha.getDay()]+' '+fecha.getDate() +'-'+(fecha.getMonth()+1);
    return fechaDia.toString();
  }
  
  terminarEjercicio(ejercicio:EjercicioTratamiento){
    let datos:EjercicioTratamiento={
      ejercicioTratamientoId: ejercicio.ejercicioTratamientoId,
      tratamientoDiaId: ejercicio.tratamientoDiaId,
      ejercicioId: ejercicio.ejercicioId,
      ejercicioTratamientoRepeticiones: ejercicio.ejercicioTratamientoRepeticiones,
      ejercicioTratamientoSerie: ejercicio.ejercicioTratamientoSerie,
      ejercicioEstado: !ejercicio.ejercicioEstado,
      ejercicioDescanso: ejercicio.ejercicioDescanso,
      ejercicioObservacion: ejercicio.ejercicioObservacion,
      ejercicioNombre:ejercicio.ejercicioNombre
    }
    this._httpTratamientoService.putEjercicioTratamiento(datos, ejercicio.ejercicioTratamientoId).subscribe(resp=>{
      this.cargarTratamiento();
      if(ejercicio.ejercicioEstado){
        const dialogRef = this.dialog.open(DialogGeneral, {
          width: '400px',
          data: {
            mensaje:'Ejercicio No Completado'
          }
        });
      }else{
        const dialogRef = this.dialog.open(DialogGeneral, {
          width: '400px',
          data: {
            mensaje:'Ejercicio Completado Exitosamente'
          }
        });
      }
    })
  }

}
@Component({
  selector: 'dialog-tratamiento-casa',
  templateUrl: './dialog-tratamiento-casa.html'
})
export class DialogTratamientoCasa {
  typesOfShoes: string[] = ['Fase 1', 'Fase 2', 'Fase 3'];
  constructor(
    public dialogRef1: MatDialogRef<DialogTratamientoCasa>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: EjercicioTratamiento,
    protected _sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private _httpTratamientoService:TratamientoService) {
      console.log(data)

  }

  terminarEjercicio(ejercicio:EjercicioTratamiento){
    let datos:EjercicioTratamiento={
      ejercicioTratamientoId: ejercicio.ejercicioTratamientoId,
      tratamientoDiaId: ejercicio.tratamientoDiaId,
      ejercicioId: ejercicio.ejercicioId,
      ejercicioTratamientoRepeticiones: ejercicio.ejercicioTratamientoRepeticiones,
      ejercicioTratamientoSerie: ejercicio.ejercicioTratamientoSerie,
      ejercicioEstado: !ejercicio.ejercicioEstado,
      ejercicioDescanso: ejercicio.ejercicioDescanso,
      ejercicioObservacion: ejercicio.ejercicioObservacion,
      ejercicioNombre:ejercicio.ejercicioNombre
    }
    this._httpTratamientoService.putEjercicioTratamiento(datos, ejercicio.ejercicioTratamientoId).subscribe(resp=>{
      if(ejercicio.ejercicioEstado){
        const dialogRef = this.dialog.open(DialogGeneral, {
          width: '400px',
          data: {
            mensaje:'Ejercicio No Completado'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.dialogRef1.close();
        }); 
      }else{
        const dialogRef = this.dialog.open(DialogGeneral, {
          width: '400px',
          data: {
            mensaje:'Ejercicio Completado Exitosamente'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.dialogRef1.close();
        });
      }
    })
  }

  onSubmit(data: any) {
  }

  onNoClick(): void {
    this.dialogRef1.close();
  }
}

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {
  /**
   * Pipe Constructor
   *
   * @param _sanitizer: DomSanitezer
   */
  // tslint:disable-next-line
  constructor(protected _sanitizer: DomSanitizer) {
  }

  transform(url:any):SafeUrl {
    console.log(url)
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}