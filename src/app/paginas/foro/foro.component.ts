import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FiltroConsulta } from '../consultas/buscar-consulta/buscar-consulta';
import { ConsultasService } from '../../servicios/consulta.service';
import { Consulta } from '../consultas/consulta';
import { TratamientoService } from '../../servicios/tratamiento.service';
import { FaseTratamiento } from '../tratamiento/tratamiento';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { comentarioForo, filtroForo, Foro } from './foro.interface';
import { Usuario } from '../users/user';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ForoService } from '../../servicios/foro.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.css']
})
export class ForoComponent implements OnInit {

  formFiltro:FormGroup;
  fechaDesde = new Date('January 1 2022');
  displayedColumns: string[] = ['problema', 'diagnostico', 'accion'];
  listaForo: Foro[]=[];
  dataSource = new MatTableDataSource<Foro>;
  datosFases: FaseTratamiento[]=[];
  constructor(private formBuilder:FormBuilder,
    private _httpConsultaService:ConsultasService,
    private _httpTratamientoService: TratamientoService,
    private _httpForoService: ForoService,
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
    this.cargarForos()
  }

  cargarForos(){
    let filtro:filtroForo={
      fechaDesde: new Date('January 1 2022'),
      fechaHasta: new Date(),
      pacienteId: 0,
      problema: "",
      estado: 1,
      especialistaId:0
    }
    this._httpForoService.postConsultarForos(filtro).subscribe(resp=>{
      this.listaForo=resp.filter(element=>element.foroEstado===true);
      resp.forEach((element,i) => {
        this._httpTratamientoService.getTratamientosPorConsulta(Number(element.consultaId)).subscribe(respTratamientos=>{
          this.listaForo[i].tratamientos=respTratamientos;
        })
        
      });
      this.dataSource.data=this.listaForo;
    })

  }

  abirForo(element:Foro){
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
export class DialogForo implements OnInit{
  fasesTratamiento: FaseTratamiento[]=[];
  dataSource: any[]=[];
  displayedColumns:string[]=['dia','ejercicio','repeticion','series','descanso','observacion']
  form:FormGroup;
  usuario="carolina"
  fecha= new Date();

  listaComentarios: comentarioForo[]=[];  
  public messageToSend = '';
  private urlService: string = environment.apiUrl+'mensajehub';
  private connection: HubConnection;
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogForo>,
    @Inject(MAT_DIALOG_DATA) public data: Foro,
    private formBuilder: FormBuilder,
    private _httpTratamientoService: TratamientoService,
    private _httpForoService: ForoService) {
      this.connection = new HubConnectionBuilder()
      .withUrl(this.urlService)
      .build();
      this.connection.on("grupo1", message => this.cargarComentarios());
      this.dataSource.push(
        {item:'Descripción:',dato:data.consultaDescripcion},
        {item:'Dolor:',dato:data.consultaMotivo},
        {item:'Examinación:',dato:data.examinacionInspeccion},
        {item:'Diagnóstico:',dato:data.diagnostico},)
      this.cargarFases();

      this.form=formBuilder.group({
        usuarioId: new FormControl(0),
        comentario: new FormControl('')
      });
  }

  ngOnInit(): void {
    this.cargarComentarios();
    this.connection.start()
      .then(_ => {
        console.log('Connection Started');
      }).catch(error => {
        return console.error(error);
      });
  }

  public sendMessage() {
    this.connection.invoke('SendMessage', this.messageToSend)
      .then(_ =>{
        this.messageToSend = ''
      }
        );
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
    let comentario:comentarioForo={
      usuarioId: Number(localStorage.getItem("userId")),
      comentarioForoId:0,
      comentarioForoMensaje:this.form.value.comentario,
      foroId: this.data.foroId
    }
    this._httpForoService.postComentarioForo(comentario).subscribe(resp=>{
      this.sendMessage();
    })
  }

  cargarComentarios(){
    this._httpForoService.getComentarios(this.data.foroId).subscribe(resp=>{
      this.listaComentarios=resp
    });
  }
}

