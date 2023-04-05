import { Component, Inject, Injectable, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { DateRange, MatDateRangeSelectionStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EspecialistaService } from 'src/app/servicios/especialista.service';
import { RolesService } from 'src/app/servicios/roles.service';
import { SedesService } from 'src/app/servicios/sedes.service';
import { Sede } from '../../administracion/admin-sedes/sede';
import { DialogGeneral } from '../../../componentes/dialog-general/dialog-general';
import { HorarioDia } from '../../administracion/horario-especialista/horario-especialista';
import { Rol } from '../../administracion/users/rol';
import { Usuario } from '../../administracion/users/user';
import { CitasService } from '../citas.service';
import { CitaPost, FiltroCitas, HorarioCita, HorarioDisponibleCita } from '../horario-cita';
import { environment } from '../../../../environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';
@Injectable()
export class FiveDayRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D>, OnInit {
  

  constructor(private _dateAdapter: DateAdapter<D>) {

  }

  ngOnInit(): void {
    
  }

  selectionFinished(date: D | null): DateRange<D> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, 0);
      const end = this._dateAdapter.addCalendarDays(date, 4);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}
@Component({
  selector: 'app-agendar-cita',
  templateUrl: './agendar-cita.component.html',
  styleUrls: ['./agendar-cita.component.css'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: FiveDayRangeSelectionStrategy,
    },
  ],
})
export class AgendarCitaComponent implements OnInit {
  todayDate:Date = new Date();
  displayedColumns: string[] = ['fecha1', 'fecha2', 'fecha3', 'fecha4', 'fecha5'];
  dataSource:HorarioDisponibleCita[] = [];
  listaSedes: Sede[] = [];
  listaEspecialistas: Usuario[] = [];
  listaEspecialistaFiltrada: Usuario[] = [];
  filtroForm: FormGroup;
  fecha= new Date();
  
  public messageToSend = '';
  public conversation: string[] = [];

  private urlService: string = environment.apiUrl+'mensajehub';
  private connection: HubConnection;

  constructor(
    private dialog:MatDialog,
    private fb: FormBuilder,
    private _httpCitas:CitasService,
    private _httpEspecialistaService: EspecialistaService, 
    private _httpSedeService: SedesService,
    private _httpUsuarioService: UsuariosService,
    private _router: Router,
    ) {
      
    let usuarioId=Number(localStorage.getItem('userId'));
    this._httpUsuarioService.getUsuarioId(usuarioId).subscribe(resp=>{
      if(resp.rolId==3){
        this._router.navigateByUrl('/citas/agendar-cita-admin');
      }

    });
    this.connection = new HubConnectionBuilder()
      .withUrl(this.urlService)
      .build();
      this.connection.on("grupo1", message => this.buscar());
    this.filtroForm = fb.group({
      fechaDesde: new FormControl(new Date()),
      fechaHasta: new FormControl(new Date()),
      sedeId: new FormControl(0),
      especialistaId:new FormControl(0)
    })
    
    _httpSedeService.getSedes().subscribe(resp => {
      this.listaSedes=resp;
    });
    _httpEspecialistaService.getEspecialistas().subscribe(esp=>{
      this.listaEspecialistas = esp.filter(element=>element.rolId==1);
    });
  }

  ngOnInit(): void {
    this.connection.start()
      .then(_ => {
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

  private newMessage(message: string) {
    this.conversation.push(message);
  }
  buscar(){
    if(this.filtroForm.value.sedeId > 0){
      let filtro: FiltroCitas ={
        sedeId: this.filtroForm.value.sedeId,
        especialistaId: this.filtroForm.value.especialistaId,
        fechaDesde: this.filtroForm.value.fechaDesde,
        fechaHasta: this.filtroForm.value.fechaHasta
      }
      this._httpCitas.getHorariosDisponibles(filtro).subscribe(c=>{
        this.dataSource = c;
      });
    }else{
      alert("Seleccione una sede");
    }
  }
    

  agendarCita(dia:HorarioDisponibleCita,hora:HorarioCita){
    let datosCita:CitaPost={
      diaId: dia.horarioDiaId,
      citaEstado:1,
      citaFecha:dia.horarioDiaFecha,
      usuarioId:Number(localStorage.getItem("userId")),
      citaHora:hora.horaCita,
      citaId:0,
      especialistaId: this.filtroForm.value.especialistaId, 
      citaObservacion: "Fecha: "+ dia.horarioDiaFecha.toString().substring(0,10)+ " - Hora: "+hora.horaCita
    }
    const dialogRef = this.dialog.open(DialogAgendarCita, {
      width: '400px',
      data: datosCita
    });
    dialogRef.afterClosed().subscribe(result => {
      this.sendMessage()
      this.buscar();
    }); 
  }

  tiempoFinal(tiempo:string){
    let hora=tiempo.split(':');
    let horaFin: string ='';
    let num=Number(hora[0]);
    horaFin=(num+1)+':0'

    return horaFin;
  }
  bloquearHora(horario:HorarioDisponibleCita, tiempo:string){
    let bloqueado: boolean=false;
    let fechaHorario=new Date(horario.horarioDiaFecha).setHours(0,0,0,0);
    let fechaActual= new Date().setHours(0,0,0,0);
    if(fechaHorario==fechaActual){
      let hora=tiempo.split(':');
      let horaActual=Number(this.fecha.getHours());
      if(horaActual >= Number(hora[0])){
        bloqueado=true;
      }
    }
    
    return bloqueado;
  }

  obtenerEstilo(disponible:number){
    let style='width: 95%;height: 70px;margin-top: 5px;';
    if(disponible<0){
      style='width: 95%;height: 30px;margin-top: 5px;'
    }
    return style;
  }

  filtrarPacientes(event:any){
    this.listaEspecialistaFiltrada=this.listaEspecialistas.filter(element=>element.sedeId===event);
  }
}

@Component({
  selector: 'dialog-agendar-cita',
  templateUrl: 'dialog-agendar-cita.html'
})
export class DialogAgendarCita {
  observacion = new FormControl();
  isLoadingResults:boolean=false;
  respuesta = new EventEmitter();
  constructor(public dialogRef: MatDialogRef<DialogAgendarCita>,
    @Inject(MAT_DIALOG_DATA) public data: CitaPost,
    private formBuilder: FormBuilder,private dialog:MatDialog,private _httpCita:CitasService) {
      this.observacion.patchValue(data.citaObservacion);
  }
  onSubmit(data: any) {
  }
  agendar(){
    this.isLoadingResults=true;
    let cita:CitaPost = {
      citaEstado:1,
      citaFecha:this.data.citaFecha,
      usuarioId:Number(localStorage.getItem("userId")),
      citaHora:this.data.citaHora,
      citaId:0,
      especialistaId: this.data.especialistaId, 
      citaObservacion: this.observacion.value
    }
    this._httpCita.postCita(cita).subscribe(c=>{
      this.isLoadingResults=false;
      const dialogRef = this.dialog.open(DialogGeneral, {
        width: '400px',
        data: {
          mensaje:'Su turno a sido reservado y deberá confirmarlo 72 horas antes de su cita'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.dialogRef.close();
      }); 
    },error=>{
      this.isLoadingResults=false;
    });
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}