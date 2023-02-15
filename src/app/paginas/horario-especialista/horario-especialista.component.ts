import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HorarioEspecialista, HorarioDia, HorarioTrabajo, HorarioPorEspecialista, HorarioTrabajoPorEspecialista } from './horario-especialista';
import { HorarioService } from '../../servicios/horario.service';
import { DialogGeneral } from '../dialog-general/dialog-general';
import { UsuariosService } from '../../servicios/usuarios.service';
import { SedesService } from '../../servicios/sedes.service';

@Component({
  selector: 'app-horario-especialista',
  templateUrl: './horario-especialista.component.html',
  styleUrls: ['./horario-especialista.component.css']
})
export class HorarioEspecialistaComponent implements OnInit, OnInit {
  sedeId:number = 0;
  horaDesde: string = '';
  horaHasta: string = '';
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

  constructor(
    public dialog: MatDialog, 
    private _htppHorarioService:HorarioService,
    private _httpUsuarioService: UsuariosService,
    private _httpSedeService: SedesService) {
    this.cargarHorarios();
   }

   ngOnInit(): void {
    let usuarioId=Number(localStorage.getItem('userId'));
    this._httpUsuarioService.getUsuarioId(usuarioId).subscribe(resp=>{
      this._httpSedeService.getSedeId(resp.sedeId).subscribe(resp=>{
        this.horaDesde=resp.sedeHoraDesde?resp.sedeHoraDesde.toString():'';
        this.horaHasta=resp.sedeHoraHasta?resp.sedeHoraHasta.toString():'';
      })
    });
   }
  cargarHorarios(){
    this._htppHorarioService.getHorarioEspecialistaUsuarios(Number(localStorage.getItem('userId'))).subscribe(resp=>{
      this.horarioDias=resp
    })
  }
  nuevoHorario(id:number){
    let item:HorarioTrabajoPorEspecialista ={
      horaDesde:this.horaDesde,
      horaHasta:this.horaHasta,
      id:0
    }
    const dialogRef = this.dialog.open(DialogHorario, {
      width: '400px',
      data: {trabajoId:0,datos:item,id:id, horaDesde: this.horaDesde, horaHasta: this.horaHasta}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cargarHorarios();
    }); 
  }
  editarHorario(horario:HorarioTrabajoPorEspecialista,id:number){
    const dialogRef = this.dialog.open(DialogHorario, {
      width: '400px',
      data: {trabajoId:horario.id,datos:horario,id:id, horaDesde: this.horaDesde, horaHasta: this.horaHasta}
    });
    dialogRef.afterClosed().subscribe(result => {
     this.cargarHorarios();
    }); 
  }

  agregarUsuario(){
    const dialogRef = this.dialog.open(DialogGeneral, {
      width: '400px',
      data: {
        mensaje:'Usuario creado exitosamente'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
     
    }); 
  }

}

@Component({
  selector: 'dialog-horario',
  templateUrl:'./dialog-horario.html',
  styleUrls:['./dialog-horario.css']
})
export class DialogHorario implements OnInit{
  id:any;
  tipo:any;
  hora:any;
  horarioForm = new FormGroup({
    horarioDesde:  new FormControl('', [Validators.min(7), Validators.max(18)]),
    horarioHasta:  new FormControl('', [Validators.min(7), Validators.max(18)]),
  });
  fecha:Date= new Date();

  constructor(public dialogRef: MatDialogRef<DialogHorario>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, public dialog: MatDialog,private _htppHorarioService:HorarioService){
      this.horarioForm = new FormGroup({
        horarioDesde:  new FormControl(data.datos.horaDesde, [Validators.min(data.horaDesde), Validators.max(data.horaHasta)]),
        horarioHasta:  new FormControl(data.datos.horaHasta, [Validators.min(data.horaDesde), Validators.max(data.horaHasta)]),
      })
      console.log(data)
  }

  ngOnInit(): void {
    

  }

  verificarHorarioDesde(event:any){
    console.log(event, this.data.horaDesde);
    let horamin=event.target.value;
    
    if(horamin<this.data.horaDesde){
      console.log('hora min < hora desde');
      event.target.value=this.data.horaDesde
    }else{
      if(horamin>this.data.horaHasta){
        console.log('hora min > hora hasta'); 
      event.target.value=this.data.horaHasta       
      }
    }

  }

  verificarHorarioHasta(event:any){
    let horamin=this.horarioForm.value.horarioDesde?this.horarioForm.value.horarioDesde:'';
    let horamax=event.target.value;
    if(horamax<horamin){
      console.log('hora max < hora desde');
      event.target.value=horamin
    }else{
      if(horamax>this.data.horaHasta){
        console.log('hora min > hora hasta'); 
      event.target.value=this.data.horaHasta       
      }
    }
  }

  guardarNuevo(){
    let datos:HorarioTrabajo={
      horarioTrabajoId: this.data.trabajoId,
      horarioTrabajoDesde: this.horarioForm.value.horarioDesde?this.horarioForm.value.horarioDesde.toString():'',
      horarioTrabajoHasta: this.horarioForm.value.horarioHasta?this.horarioForm.value.horarioHasta.toString():''
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
