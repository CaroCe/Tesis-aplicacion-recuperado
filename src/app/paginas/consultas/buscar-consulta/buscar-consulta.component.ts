import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ConsultaBuscador, FiltroConsulta } from './buscar-consulta';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConsultasService } from '../../../servicios/consulta.service';
import { Observable } from 'rxjs';
import { Consulta, Evolucion } from '../consulta';
import { Usuario } from '../../users/user';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { DialogVistaConsultaComponent } from '../dialog-vista-consulta/dialog-vista-consulta.component';
import { DialogConsultaDiagnosticoComponent } from '../dialog-consulta-diagnostico/dialog-consulta-diagnostico.component';
import { DialogConsultaEvaluacionComponent } from '../dialog-consulta-evaluacion/dialog-consulta-evaluacion.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DialogDescargaFisioterapeutico } from '../consultas.component';

@Component({
  selector: 'app-buscar-consulta',
  templateUrl: './buscar-consulta.component.html',
  styleUrls: ['./buscar-consulta.component.css']
})
export class BuscarConsultaComponent implements OnInit {

  datosConsulta: Consulta={};
  datosEvolucion: Evolucion[]=[];
  usuarios: Usuario[]=[];
  fechaActual: Date = new Date();
  
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  displayedColumns: string[] = ['fecha', 'paciente', 'problema', 'diagnostico','acciones'];
  dataSource= new MatTableDataSource<Consulta>();
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
    this.cargarTabla();
  }
  fechaDesde(type: string, event: MatDatepickerInputEvent<Date>) {
    this.formFiltro.patchValue({fechaDesde:event.value?.getFullYear()+'-'+(Number(event.value?.getMonth())+1)+'-'+event.value?.getDate()});
  }

  fechaHasta(type: string, event: MatDatepickerInputEvent<Date>) {
    this.formFiltro.patchValue({fechaHasta:event.value?.getFullYear()+'-'+(Number(event.value?.getMonth())+1)+'-'+event.value?.getDate()});
  }

  cargarTabla(){
    let filtro: FiltroConsulta={
      fechaDesde: this.formFiltro.value.fechaDesde,
      fechaHasta: this.formFiltro.value.fechaHasta,
      pacienteId: this.formFiltro.value.pacienteId,
      problema: this.formFiltro.value.problema
    }
    this._httpConsutaService.postConsultaPorFiltros(filtro).subscribe(resp =>{
      this.dataSource= new MatTableDataSource<Consulta>();
      this.dataSource.data=resp;
    })
  }

  verConsulta(datos: Consulta){
    const dialogRef = this.dialog.open(DialogVistaConsultaComponent, {
      data: datos

    });
    dialogRef.afterClosed().subscribe(result => {
     
    }); 
  }

  verEvaluacion(datos:Consulta){
    const dialogRef = this.dialog.open(DialogConsultaEvaluacionComponent, {
      data:datos
    })
  }

  abrirDescarga(element: Consulta){
    const dialogRef = this.dialog.open(DialogDescargaFisioterapeutico,{
      width: '1400px',
      height:'1000px',
      data: element
    })
  }
}
