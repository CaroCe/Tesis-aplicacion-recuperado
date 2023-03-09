import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HorarioEspecialista, HorarioDia, HorarioTrabajo, HorarioPorEspecialista, HorarioTrabajoPorEspecialista } from './horario-especialista';
import { HorarioService } from '../../servicios/horario.service';
import { DialogGeneral } from '../dialog-general/dialog-general';
import { UsuariosService } from '../../servicios/usuarios.service';
import { SedesService } from '../../servicios/sedes.service';
import { EspecialistaService } from '../../servicios/especialista.service';
import { Usuario } from '../users/user';

@Component({
  selector: 'app-horario-especialista',
  templateUrl: './horario-especialista.component.html',
  styleUrls: ['./horario-especialista.component.css']
})
export class HorarioEspecialistaComponent implements OnInit, OnInit {
  sedeId:number = 0;
  administrador:boolean=false;
  especialistaId = new FormControl(0);
  horaDesde: string = '';
  horaHasta: string = '';
  horarioDias: HorarioPorEspecialista[]=[];
  listaEspecialistas: Usuario[] = [];
  listaEspecialistaFiltrada: Usuario[] = [];
  horarioLunes:HorarioDia[]=[];
  horarioMartes:HorarioDia[]=[
  ];

  constructor(
    public dialog: MatDialog, 
    private _htppHorarioService:HorarioService,
    private _httpUsuarioService: UsuariosService,
    private _httpSedeService: SedesService) {
    this.cargarHorarios();
    _httpUsuarioService.getUsuarios().subscribe(esp=>{
      this.listaEspecialistas = esp.filter(element=>element.rolId==1);
    });
   }

   ngOnInit(): void {
    
    let usuarioId=Number(localStorage.getItem('userId'));
    this._httpUsuarioService.getUsuarioId(usuarioId).subscribe(resp=>{
      if(resp.rolId==1){
        this.especialistaId.patchValue(usuarioId);
        this.administrador=false;
        this.cargarHorarios();
      }else if(resp.rolId==3){
        this.administrador=true;
      }

      this._httpSedeService.getSedeId(resp.sedeId).subscribe(resp=>{
        this.horaDesde=resp.sedeHoraDesde?resp.sedeHoraDesde.toString():'';
        this.horaHasta=resp.sedeHoraHasta?resp.sedeHoraHasta.toString():'';
      })
    });
   }

   cambioEspecialista(){
    this.cargarHorarios();
   }

  cargarHorarios(){
    this._htppHorarioService.getHorarioEspecialistaUsuarios(Number(this.especialistaId.value)).subscribe(resp=>{
      this.horarioDias=resp
    })
  }
  nuevoHorario(dia:HorarioPorEspecialista){
    let item:HorarioTrabajoPorEspecialista ={
      horaDesde:this.horaDesde,
      horaHasta:this.horaHasta,
      id:0
    }
    if(dia.horarioTrabajo.length>0){
      item.horaDesde=dia.horarioTrabajo[dia.horarioTrabajo.length-1].horaHasta;
    }
    
    const dialogRef = this.dialog.open(DialogHorario, {
      width: '400px',
      data: {especialistaId:this.especialistaId.value,trabajoId:0,datos:item,id:dia.horarioDiaId, horaDesde: item.horaDesde, horaHasta: this.horaHasta}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cargarHorarios();
    }); 
  }

  editarHorario(horario:HorarioTrabajoPorEspecialista,dia:HorarioPorEspecialista, indice:number){
    let item:HorarioTrabajoPorEspecialista ={
      horaDesde:horario.horaDesde,
      horaHasta:horario.horaHasta,
      id:horario.id
    }
    if(dia.horarioTrabajo.length>1 && indice!==0){
      item.horaDesde=dia.horarioTrabajo[indice-1].horaHasta
    }
    
    const dialogRef = this.dialog.open(DialogHorario, {
      width: '400px',
      data: {especialistaId:this.especialistaId.value,trabajoId:horario.id,datos:item,id:dia.horarioDiaId, horaDesde: item.horaDesde, horaHasta: this.horaHasta}
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
  }

  ngOnInit(): void {
    

  }

  verificarHorarioDesde(event:any){
    let horamin=event.target.value;
    
    if(horamin<this.data.horaDesde){
      event.target.value=this.data.horaDesde
    }else{
      if(horamin>this.data.horaHasta){
      event.target.value=this.data.horaHasta       
      }
    }

  }

  verificarHorarioHasta(event:any){
    let horamin=this.horarioForm.value.horarioDesde?this.horarioForm.value.horarioDesde:'';
    let horamax=event.target.value;
    if(horamax<horamin){
      event.target.value=horamin
    }else{
      if(horamax>this.data.horaHasta){
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
          especialistaId:Number(this.data.especialistaId),
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
