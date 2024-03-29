import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FiltroConsulta } from '../../historia-clinica/buscar-consulta/buscar-consulta';
import { ConsultasService } from '../../../servicios/consulta.service';
import { Consulta } from '../../historia-clinica/consultas/consulta';
import { TratamientoService } from '../../../servicios/tratamiento.service';
import { FaseTratamiento, EjercicioTratamiento, TratamientoDia } from '../../tratamiento/tratamiento';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogGeneral } from '../../../componentes/dialog-general/dialog-general';
import { TratamientoDias } from '../../tratamiento/tratamiento-casa/tratamiento-casa';
import { Foro, filtroForo } from '../foro.interface';
import { ForoService } from '../../../servicios/foro.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-foro',
  templateUrl: './admin-foro.component.html',
  styleUrls: ['./admin-foro.component.css']
})
export class AdminForoComponent implements OnInit {
  
  formFiltro:FormGroup;
  fechaDesde = new Date('January 1 2022');
  displayedColumns: string[] = ['problema', 'diagnostico', 'fases', 'foro'];
  dataSource = new MatTableDataSource<Foro>;
  datosFases: FaseTratamiento[]=[];
  constructor(private formBuilder:FormBuilder,
    private _httpConsultaService:ConsultasService,
    private _httpTratamientoService: TratamientoService,
    public dialog:MatDialog,
    private _httpForoService: ForoService) {
    this.formFiltro=formBuilder.group({
      pacienteId: new FormControl(0),
      fechaDesde: new FormControl(new Date(this.fechaDesde)),
      fechaHasta: new FormControl(new Date()),
      problema: new FormControl('')
    })
    _httpTratamientoService.getTratamientos().subscribe(resp=>{
      this.datosFases=resp;
    })
   }

  ngOnInit(): void {
    this.cargarConsultas()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  cargarConsultas(){
    let filtro:filtroForo={
      fechaDesde: this.formFiltro.value.fechaDesde,
      fechaHasta: this.formFiltro.value.fechaHasta,
      pacienteId: 0,
      problema: '',
      especialistaId:0,
      estado:1
    }

    this._httpForoService.postConsultarForos(filtro).subscribe(resp=>{
      this.dataSource.data=resp;
    });
  }

  consultarFases(id:number):FaseTratamiento[]{
   
    return this.datosFases
  }

  abrirFase(fase:FaseTratamiento){
    const dialogRef = this.dialog.open(DialogForoFase, {
      width: '1000px',
      height:'600px',
      data: fase.tratamientosDia
    });
    dialogRef.afterClosed().subscribe(result => {
      
    }); 
  }

  activarForo(element: Consulta){
    
    this._httpForoService.getCambiaEstadoForo(Number(element.consultaId), !element.foroEstado).subscribe(resp => {
      this.cargarConsultas();
      const dialogRef = this.dialog.open(DialogGeneral, {
        width: '400px',
        data: {
          mensaje:'Operación Exitosa'
        }
      });
    });
  }

}

@Component({
  selector: 'dialog-foro-fase',
  templateUrl: './dialog-foro-fase.html'
})
export class DialogForoFase {
  typesOfShoes: string[] = ['Fase 1', 'Fase 2', 'Fase 3'];
  
  diaSemana:string[] = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  constructor(
    public dialogRef1: MatDialogRef<DialogForoFase>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TratamientoDia[],
    private formBuilder: FormBuilder,
    private _httpTratamientoService:TratamientoService) {
      

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

  formatoFecha(date:Date): string{
    let fecha = new Date(date)
    let dia = this.diaSemana[fecha.getDay()]+' '+fecha.getDate() +'-'+(fecha.getMonth()+1)
   return dia.toString();
  }

  onSubmit(data: any) {
  }

  onNoClick(): void {
    this.dialogRef1.close();
  }
}
