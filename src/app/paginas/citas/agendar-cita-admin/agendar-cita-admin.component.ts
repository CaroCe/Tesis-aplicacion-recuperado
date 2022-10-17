import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { DateRange, MatDateRangeSelectionStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EspecialistaService } from 'src/app/servicios/especialista.service';
import { RolesService } from 'src/app/servicios/roles.service';
import { SedesService } from 'src/app/servicios/sedes.service';
import { Sede } from '../../admin-sedes/sede';
import { DialogGeneral } from '../../dialog-general/dialog-general';
import { HorarioDia } from '../../horario-especialista/horario-especialista';
import { Rol } from '../../users/rol';
import { Usuario } from '../../users/user';
import { CitasService } from '../citas.service';
import { CitaPost, FiltroCitas, HorarioCita, HorarioDisponibleCita } from '../horario-cita';
@Injectable()
export class FiveDayRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>) { }

  selectionFinished(date: D | null): DateRange<D> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, -2);
      const end = this._dateAdapter.addCalendarDays(date, 2);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}
@Component({
  selector: 'app-agendar-cita-admin',
  templateUrl: './agendar-cita-admin.component.html',
  styleUrls: ['./agendar-cita-admin.component.css'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: FiveDayRangeSelectionStrategy,
    },
  ],
})
export class AgendarCitaAdminComponent implements OnInit {
  displayedColumns: string[] = ['fecha1', 'fecha2', 'fecha3', 'fecha4', 'fecha5'];
  dataSource:HorarioDisponibleCita[] = [];
  listaSedes: Sede[] = [];
  listaEspecialistas: Usuario[] = [];
  listaPacientes: Usuario[] = [];
  filtroForm: FormGroup;
  constructor(private dialog:MatDialog,private fb: FormBuilder,private _httpCitas:CitasService,private _httpEspecialistaService: EspecialistaService, private _httpSedeService: SedesService) {
    this.filtroForm = fb.group({
      fechaDesde: new FormControl(Date.now()),
      fechaHasta: new FormControl(Date.now()),
      sedeId: new FormControl(0),
      especialistaId:new FormControl(0),
      pacienteId: new FormControl(0)
    })
    
    _httpSedeService.getSedes().subscribe(resp => {
      this.listaSedes=resp;
    });
    _httpEspecialistaService.getEspecialistas().subscribe(esp=>{
      this.listaEspecialistas = esp;
    });
    _httpEspecialistaService.getPacientes().subscribe(pas=>{
      this.listaPacientes = pas;
    });
  }

  ngOnInit(): void {
  }
  buscar(){
    if(this.filtroForm.value.pacienteId > 0){
      let filtro: FiltroCitas ={
        sedeId: this.filtroForm.value.sedeId,
        especialistaId: this.filtroForm.value.especialistaId,
        fechaDesde: this.filtroForm.value.fechaDesde,
        fechaHasta: this.filtroForm.value.fechaHasta
      }
      this._httpCitas.getHorariosDisponibles(filtro).subscribe(c=>{
        this.dataSource = c;
      });
    }
    else{
      alert("Seleccione un paciente");
    }
    
  }

  agendarCita(dia:HorarioDisponibleCita,hora:HorarioCita){
    const dialogRef = this.dialog.open(DialogAgendarCitaAdmin, {
      width: '400px',
      data: {
        diaId:dia.horarioDiaId,hora:hora.horaCita,fecha:dia.horarioDiaFecha,pacienteId:this.filtroForm.value.pacienteId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.buscar();
    }); 
  }

}

@Component({
  selector: 'dialog-agendar-cita-admin',
  templateUrl: 'dialog-agendar-cita-admin.html'
})
export class DialogAgendarCitaAdmin {
  observacion = new FormControl();
  constructor(public dialogRef: MatDialogRef<DialogAgendarCitaAdmin>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,private dialog:MatDialog,private _httpCita:CitasService) {

  }
  onSubmit(data: any) {
  }
  agendar(){

    let cita:CitaPost = {
      citaEstado:1,
      citaFecha:this.data.fecha,
      usuarioId:this.data.pacienteId,
      citaHora:this.data.hora,
      citaId:0
    }
    this._httpCita.postCita(cita).subscribe(c=>{
      
      const dialogRef = this.dialog.open(DialogGeneral, {
        width: '400px',
        data: {
          mensaje:'El turno a sido reservado y el paciente deberá confirmarlo 72 horas antes de su cita'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.dialogRef.close();
      }); 
    });
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}