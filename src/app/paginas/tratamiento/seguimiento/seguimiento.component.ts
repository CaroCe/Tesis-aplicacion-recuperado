import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Usuario } from '../../administracion/users/user';
import { MatTableDataSource } from '@angular/material/table';
import { Consulta } from '../../historia-clinica/consultas/consulta';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FiltroConsulta } from '../../historia-clinica/buscar-consulta/buscar-consulta';
import { ConsultasService } from '../../../servicios/consulta.service';
import { TratamientoService } from '../../../servicios/tratamiento.service';
import { FaseTratamiento, EjercicioTratamiento } from '../tratamiento';
import { DialogGeneral } from '../../../componentes/dialog-general/dialog-general';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {
  isLoadingResults=false;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  
  formFiltro:FormGroup;

  listaUsuarios:Usuario[]=[];
  displayedColumns: string[] = ['fecha', 'paciente', 'problema', 'diagnostico', 'acciones'];
  dataSource  = new MatTableDataSource<Consulta>();
  constructor(private dialog:MatDialog, private _httpUsuariosService: UsuariosService,private formBuilder:FormBuilder,
    private _httpConsutaService: ConsultasService,) { 
    
    this.formFiltro=formBuilder.group({
      pacienteId: new FormControl(0),
      fechaDesde: new FormControl(new Date()),
      fechaHasta: new FormControl(new Date()),
      problema: new FormControl('')
    })
    _httpUsuariosService.getUsuarios().subscribe(resp=>{
      this.listaUsuarios=resp;
    })
  }

  ngOnInit(): void {
    this.cargarTabla();
  }

  fechaDesde(type: string, event: MatDatepickerInputEvent<Date>) {
    this.formFiltro.patchValue({fechaDesde:event.value?.getFullYear()+'-'+(Number(event.value?.getMonth())+1)+'-'+event.value?.getDate()});
  }

  fechaHasta(type: string, event: MatDatepickerInputEvent<Date>) {
    this.formFiltro.patchValue({fechaHasta:event.value?.getFullYear()+'-'+(Number(event.value?.getMonth())+1)+'-'+event.value?.getDate()});
  }
  cargarTabla(){
    this.isLoadingResults=true;
    let filtro: FiltroConsulta={
      fechaDesde: this.formFiltro.value.fechaDesde,
      fechaHasta: this.formFiltro.value.fechaHasta,
      pacienteId: this.formFiltro.value.pacienteId,
      problema: ''
    }
    this._httpConsutaService.postConsultaPorFiltros(filtro).subscribe(resp =>{
      this.dataSource= new MatTableDataSource<Consulta>();
      this.dataSource.data=resp;
      this.isLoadingResults=false;
    },error=>{
      this.isLoadingResults=false;
    })
  }

  verTratamiento(element:Consulta){
    const dialogRef = this.dialog.open(DialogSeguimiento, {
      width: '900px',
      height:'430px',
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cargarTabla();
    }); 
  }

}

@Component({
  selector: 'dialog-seguimiento',
  templateUrl: './dialog-seguimiento.html'
})
export class DialogSeguimiento {
  typesOfShoes: string[] = ['Fase 1', 'Fase 2', 'Fase 3'];
  listaFases: FaseTratamiento[]=[];
  
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
    public dialogRef1: MatDialogRef<DialogSeguimiento>,
    @Inject(MAT_DIALOG_DATA) public data: Consulta,
    public dialog: MatDialog,
    private formBuilder: FormBuilder, private _httpTratamientoService:TratamientoService) {
      _httpTratamientoService.getTratamientosPorConsulta(Number(data.consultaId)).subscribe(resp=>{
        this.listaFases=resp;
      })
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

  formatoFecha(date: Date):string{
    let fecha = new Date(date)
    let dia = this.diaSemana[fecha.getDay()]+' '+fecha.getDate() +'-'+(fecha.getMonth()+1)
    return dia.toString();
  }
}
