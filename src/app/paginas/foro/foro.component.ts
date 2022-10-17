import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FiltroConsulta } from '../consultas/buscar-consulta/buscar-consulta';
import { ConsultasService } from '../../servicios/consulta.service';
import { Consulta } from '../consultas/consulta';
import { TratamientoService } from '../../servicios/tratamiento.service';
import { FaseTratamiento } from '../tratamiento/tratamiento';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { comentarioForo } from './foro.interface';
import { Usuario } from '../users/user';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.css']
})
export class ForoComponent implements OnInit {

  formFiltro:FormGroup;
  fechaDesde = new Date('January 1 2022');
  displayedColumns: string[] = ['problema', 'diagnostico', 'accion'];
  dataSource: Consulta[] = [];
  datosFases: FaseTratamiento[]=[];
  constructor(private formBuilder:FormBuilder,
    private _httpConsultaService:ConsultasService,
    private _httpTratamientoService: TratamientoService,
    private dialog:MatDialog, ) {
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

  cargarConsultas(){
    let filtro:FiltroConsulta={
      fechaDesde: this.formFiltro.value.fechaDesde,
      fechaHasta: this.formFiltro.value.fechaHasta,
      pacienteId: 0,
      problema: this.formFiltro.value.problema
    }
    this._httpConsultaService.postConsultaPorFiltros(filtro).subscribe(resp=>{
      this.dataSource=resp;
      resp.forEach((element,i) => {
        this._httpTratamientoService.getTratamientosPorConsulta(Number(element.consultaId)).subscribe(respTratamientos=>{
          this.dataSource[i].tratamientos=respTratamientos;
        })
        
      });
    })

  }

  abirForo(element:Consulta){
    const dialogRef = this.dialog.open(DialogForo,{
      width: '1500px',
      height:'1000px',
      data: element
    })
  }

}

@Component({
  selector: 'dialog-foro',
  templateUrl: './dialog-foro.html',
  styleUrls: ['./foro.component.css']
})
export class DialogForo {
  fasesTratamiento: FaseTratamiento[]=[];
  dataSource: any[]=[];
  displayedColumns:string[]=['dia','ejercicio','repeticion','series','descanso','observacion']
  form:FormGroup;
  usuario="carolina"
  fecha= new Date();

  listaComentarios: comentarioForo[]=[];
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogForo>,
    @Inject(MAT_DIALOG_DATA) public data: Consulta,
    private formBuilder: FormBuilder,
    private _httpTratamientoService: TratamientoService) {
      this.dataSource.push(
        {item:'Descripción:',dato:data.consultaDescripcion},
        {item:'Dolor:',dato:data.consultaMotivo},
        {item:'Examinación:',dato:data.examinacionInspeccion},
        {item:'Diagnóstico:',dato:data.diagnostico},)
      this.cargarFases();

      this.form=formBuilder.group({
        usuarioId: new FormControl(0),
        comentario: new FormControl('')
      })
  }
  onSubmit(data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  cargarFases(){
    this._httpTratamientoService.getTratamientosPorConsulta(Number(this.data.consultaId)).subscribe(resp=>{
      this.fasesTratamiento=resp
    });
  }

  agregarBorde(indice:number, total:number): any{
    let style="border-bottom: 1px solid rgba(0,0,0,.12);"
    if(indice+1===total){
      style=""
    }
    return style
  }

  guardarComentario(){

  }
}

