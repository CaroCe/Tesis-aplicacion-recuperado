import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsultasService } from '../../servicios/consulta.service';

import { Usuario } from '../users/user';
import { MatTableDataSource } from '@angular/material/table';
import { Consulta } from '../consultas/consulta';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { EjercicioTratamiento, FaseTratamiento } from './tratamiento';
import { DialogTratamientoFase } from '../consultas/consultas.component';
import { TratamientoService } from '../../servicios/tratamiento.service';
import { DialogGeneral } from '../dialog-general/dialog-general';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FiltroConsulta } from '../consultas/buscar-consulta/buscar-consulta';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-tratamiento',
  templateUrl: './tratamiento.component.html',
  styleUrls: ['./tratamiento.component.css']
})
export class TratamientoComponent implements OnInit {
  isLoadingResults=false;
  usuarios: Usuario[]=[];
  displayedColumns: string[] = ['fecha', 'paciente', 'problema', 'diagnostico', 'acciones'];
  dataSource = new MatTableDataSource<Consulta>();
  datosConsulta: Consulta={};
  datosTratamientos: FaseTratamiento[]=[];
  nombrePaciente: string="";
  datosEjercicios: EjercicioTratamiento[]=[]
  descargando:boolean=false;
  formFiltro:FormGroup;

  constructor(
    private dialog:MatDialog, 
    private formBuilder:FormBuilder,
    private _httpConsutaService: ConsultasService, 
    private _httpUsuarioService: UsuariosService
    ) { 
      this.formFiltro=formBuilder.group({
        pacienteId: new FormControl(0),
        fechaDesde: new FormControl(new Date()),
        fechaHasta: new FormControl(new Date()),
        problema: new FormControl('')
      })
      this._httpUsuarioService.getUsuarios().subscribe(resp=>{this.usuarios=resp});
    }

  ngOnInit(): void {
    this.cargarTabla()
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

  abrirTratamiento(element: Consulta ){
    const dialogRef = this.dialog.open(DialogTratamientos, {
      width: '500px',
      height:'430px',
      data: {
        id:element.consultaId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
     
    }); 
  }

  abrirDescarga(element:Consulta){
    const dialogRef = this.dialog.open(DialogDescargaTratamiento,{
      width: '1400px',
      height:'1000px',
      data: element
    })
  }

}

@Component({
  selector: 'dialog-tratamiento',
  templateUrl: './dialog-tratamiento.html'
})
export class DialogTratamientos {
  typesOfShoes: string[] = ['Fase 1', 'Fase 2', 'Fase 3'];
  fasesTratamiento: FaseTratamiento[]=[];

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogTratamientos>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _httpTratamientoService: TratamientoService) {
      this.cargarFases();

  }
  onSubmit(data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  cargarFases(){
    this._httpTratamientoService.getTratamientosPorConsulta(this.data.id).subscribe(resp=>{
      this.fasesTratamiento=resp
    });
  }
  
  completarFase(fase:FaseTratamiento){
    let datos:FaseTratamiento={
      tratamientoId: fase.tratamientoId,
      tratamientoDias: fase.tratamientoDias,
      tratamientoFechaInicio: fase.tratamientoFechaInicio,
      tratamientoFase: fase.tratamientoFase,
      tratamientoDescripcion: fase.tratamientoDescripcion,
      tratamientoObservacion: fase.tratamientoObservacion,
      tratamientoRecomendacion: fase.tratamientoRecomendacion,
      consultaId: fase.consultaId,
      tratamientoFechaCreacion: fase.tratamientoFechaCreacion,
      tratamientoCompleto: !fase.tratamientoCompleto,
      tratamientosDia:[]
    }
    this._httpTratamientoService.putTratamiento(datos, Number(fase.tratamientoId)).subscribe(resp=>{
      const dialogRef = this.dialog.open(DialogGeneral, {
        width: '400px',
        data: {
          mensaje:'Fase de Tratamiento completada exitosamente'
        }
      });
    })
  }

  abrirFase(fase:FaseTratamiento){
      const dialogRef = this.dialog.open(DialogTratamientoFase, {
        width: '1400px',
        height: '1000px',
        data: fase
      });
      dialogRef.afterClosed().subscribe(result => {
  
      });
  }
}

@Component({
  selector: 'dialog-descarga-tratamiento',
  templateUrl: './dialog-descarga-tratamiento.html'
})
export class DialogDescargaTratamiento {
  datosConsulta: Consulta={};
  datosTratamientos: FaseTratamiento[]=[];
  nombrePaciente: string="";
  datosEjercicios: EjercicioTratamiento[]=[]
  dias:number=7;
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
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogTratamientos>,
    @Inject(MAT_DIALOG_DATA) public data: Consulta,
    private formBuilder: FormBuilder,
    private _httpTratamientoService: TratamientoService) {
      this.datosConsulta=data;
      _httpTratamientoService.getTratamientosPorConsulta(Number(data.consultaId)).subscribe(resp=>{
        this.datosTratamientos=resp;
        this.descargar();
      });
  }

  descargar(){
    setTimeout(() => {
      const DATA = document.getElementById('divHtmlFisio');
      const doc = new jsPDF('p', 'pt', 'a4');
      const options = {
        background: 'white',
        scale: 3
      };
      html2canvas(DATA!, options).then((canvas) => {

        const imgData = canvas.toDataURL('image/PNG');
        var imgWidth = 200;
        var pageHeight = 290;
        var imgHeight = (canvas.height * imgWidth / canvas.width)+5;
        var heightLeft = imgHeight;
        var doc = new jsPDF('p', 'mm');
        var position = 5;
        doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight,'FAST');
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {

          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight,'FAST');
          heightLeft -= pageHeight;
          position+=5;
        }
        return doc;
      }).then((docResult) => {
        
        if(docResult!= undefined){
          let nombre=this.data.pacienteNombre+' '+this.data.consultaFecha;
          docResult.save(`Tratamiento`+nombre+`.pdf`);
        }

      }).catch(error=>{
        
      });
      
    }, 500);
  }

  formatoFecha(date:Date): string{
    let fecha = new Date(date)
    let dia = this.diaSemana[fecha.getDay()]+' '+fecha.getDate() +'-'+(fecha.getMonth()+1)
   return dia.toString();
  }

}