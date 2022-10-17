import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HorarioEspecialista, HorarioDia, HorarioTrabajo, HorarioPorEspecialista, HorarioTrabajoPorEspecialista } from './horario-especialista';
import { HorarioService } from '../../servicios/horario.service';
import { DialogGeneral } from '../dialog-general/dialog-general';

@Component({
  selector: 'app-horario-especialista',
  templateUrl: './horario-especialista.component.html',
  styleUrls: ['./horario-especialista.component.css']
})
export class HorarioEspecialistaComponent implements OnInit {
  horarioDias: HorarioPorEspecialista[]=[];
  horarioLunes:HorarioDia[]=[
   /* {
      id:1,
      diaId:1,
      valor:'8:00am-3:00pm'
    }*/
  ];
  horarioMartes:HorarioDia[]=[
   /* {
      id:1,
      diaId:1,
      valor:'7:30am-11:00am'
    },
    {
      id:1,
      diaId:1,
      valor:'12:00pm-2:30pm'
    },
    {
      id:1,
      diaId:1,
      valor:'2:30am-5:00pm'
    },*/
  ];

  constructor(public dialog: MatDialog, private _htppHorarioService:HorarioService) {
    this.cargarHorarios();
   }

  cargarHorarios(){
    this._htppHorarioService.getHorarioEspecialistaUsuarios(Number(localStorage.getItem('userId'))).subscribe(resp=>{
      this.horarioDias=resp
    })
  }
  nuevoHorario(id:number){
    let item:HorarioTrabajoPorEspecialista ={
      horaDesde:'00:00',
      horaHasta:'00:00',
      id:0
    }
    const dialogRef = this.dialog.open(DialogHorario, {
      width: '400px',
      data: {trabajoId:0,datos:item,id:id}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cargarHorarios();
    }); 
  }
  editarHorario(horario:HorarioTrabajoPorEspecialista,id:number){
    const dialogRef = this.dialog.open(DialogHorario, {
      width: '400px',
      data: {trabajoId:horario.id,datos:horario,id:id}
    });
    dialogRef.afterClosed().subscribe(result => {
     this.cargarHorarios();
    }); 
  }

  agregarUsuario(){
    const dialogRef = this.dialog.open(DialogHorario, {
      width: '400px',
      data: {
        mensaje:'Usuario creado exitosamente'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
     
    }); 
  }

  ngOnInit(): void {
  }

}

@Component({
  selector: 'dialog-horario',
  templateUrl:'./dialog-horario.html',
  styleUrls:['./dialog-horario.css']
})
export class DialogHorario{
  id:any;
  tipo:any;
  hora:any;
  horarioForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<DialogHorario>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, public dialog: MatDialog,private _htppHorarioService:HorarioService){
      this.horarioForm = fb.group({
        horarioDesde:   new FormControl(data.datos.horaDesde),
        horarioHasta:  new FormControl(data.datos.horaHasta),
      })
  }

  guardarNuevo(){
    let datos:HorarioTrabajo={
      horarioTrabajoId: this.data.trabajoId,
      horarioTrabajoDesde: this.horarioForm.value.horarioDesde,
      horarioTrabajoHasta: this.horarioForm.value.horarioHasta
    }
    if(this.data.trabajoId==0){
      this._htppHorarioService.postHorarioTrabajo(datos).subscribe(resp=> {
        datos = resp;
        let hEsp:HorarioEspecialista ={
          especialistaId:Number(localStorage.getItem('userId')),
          horarioId:this.data.id,
          horarioTrabajoId:datos.horarioTrabajoId,
          horarioEspecialistaId:0,
          horarioEspecialistaEstado:true
        }
        this._htppHorarioService.postHorarioEspecialista(hEsp).subscribe(r=>{

        });
        const dialogRef = this.dialog.open(DialogGeneral, {
          width: '400px',
          data: {
            mensaje:'Horario creado exitosamente'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.dialogRef.close();
        }); 
      })
    }else{


      this._htppHorarioService.putHorarioTrabajo(datos,this.data.trabajoId).subscribe(resp=>{
        this.dialogRef.close();
        const dialogRef = this.dialog.open(DialogGeneral, {
          width: '400px',
          data: {
            mensaje:'Horario editado exitosamente'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.dialogRef.close();
        }); 
      })
    }
  }
}
