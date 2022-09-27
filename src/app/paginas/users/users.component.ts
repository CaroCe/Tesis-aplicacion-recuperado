import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogGeneral } from '../dialog-general/dialog-general';
import { FiltroUsuarios, Usuario } from './user';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '../../servicios/usuarios.service';
import { RolesService } from '../../servicios/roles.service';
import { Rol } from './rol';
import { Sede } from '../admin-sedes/sede';
import { MatTableDataSource } from '@angular/material/table';
import { SedesService } from '../../servicios/sedes.service';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{

  usuarioId: number = 0;
  usuarioForm: FormGroup;
  filtroForm: FormGroup;
  displayedColumns: string[] = ['name', 'date', 'phone','estado'];
  listaUsuarios : Usuario[] =[];
  listaRoles: Rol[] = [];
  listaSedes: Sede[] = [];
  sedeFiltro = new FormControl(0)
  estadoUsuario = new FormControl(false)
  sedeUsuario = new FormControl(0)
  rolUsuario = new FormControl(0)

  constructor(public dialog: MatDialog, private fb: FormBuilder, private _httpUsuarioService: UsuariosService, private _httpRolService: RolesService, private _httpSedeService: SedesService) {
    this.filtroForm = fb.group({
      nombre: new FormControl(''),
      cedula: new FormControl(''),
      sedeId: new FormControl(0),
      rolId:new FormControl(0)
    })
    this.usuarioForm= this.fb.group({
      nombre : new FormControl(''),
      cedula : new FormControl(''),
      fechaNacimiento : new FormControl(new Date()),
      telefono : new FormControl(''),
      ocupacion : new FormControl(''),
      domicilio : new FormControl(''),
      profesion : new FormControl(''),
      email: new FormControl(''),
      rolId : this.rolUsuario,
      sedeId : this.sedeUsuario,
      estado : new FormControl(false)
    })
    _httpRolService.getRoles().subscribe(resp=>{
      this.listaRoles=resp;
    });
    _httpSedeService.getSedes().subscribe(resp => {
      this.listaSedes=resp;
    })
  }

  ngOnInit(): void {
    this.cargarTabla();
  }
  buscar(){
    let filtro:FiltroUsuarios ={
      nombre:this.filtroForm.value.nombre,
      cedula:this.filtroForm.value.cedula,
      sede:this.filtroForm.value.sedeId,
      rol:this.filtroForm.value.rolId
    }

    this._httpUsuarioService.getUsuariosFiltro(filtro).subscribe(
      c=>{
        for(let i=0;i<c.length;i++){
          let pipe = new DatePipe('en-US');
          c[i].fecha = pipe.transform(c[i].usuarioFechaNacimiento, 'yyyy-MM-dd')?.toString()??'';
        }
        this.listaUsuarios =c;
      }
    )

  }
  cargarTabla(){
    this._httpUsuarioService.getUsuarios().subscribe(resp => {
    
      for(let i=0;i<resp.length;i++){
        let pipe = new DatePipe('en-US');
        resp[i].fecha = pipe.transform(resp[i].usuarioFechaNacimiento, 'yyyy-MM-dd')?.toString()??'';
      }
      this.listaUsuarios =resp;

    })
  }
  nuevoUsuario(){
    this.usuarioForm.reset();
  }
  crearUsuario(){
    
  }

  editarUsuario(item:Usuario) {
    
    this.usuarioId = item.usuarioId;
    this.usuarioForm.setValue({
      nombre:item.usuarioNombre,
      cedula:item.usuarioIdentificacion,
      fechaNacimiento:item.usuarioFechaNacimiento,
      telefono:item.usuarioTelefono,
      ocupacion: item.usuarioOcupacion,
      domicilio: item.usuarioDireccion,
      profesion: item.usuarioProfesion,
      email: item.usuarioCorreo,
      rolId: item.rolId,
      sedeId: item.sedeId,
      estado: item.usuarioEstado
    });

  }



  guardar(){
    if(this.usuarioId===0){
      this.guardarNuevo();
    }else{
      this.guardarEditado();
    }
  }


  guardarNuevo() {
    let usuario: Usuario={
      usuarioId:0,
      usuarioNombre: this.usuarioForm.value.nombre,
      usuarioIdentificacion: this.usuarioForm.value.cedula,
      usuarioFechaNacimiento: this.usuarioForm.value.fechaNacimiento,
      usuarioTelefono: this.usuarioForm.value.telefono,
      usuarioOcupacion: this.usuarioForm.value.ocupacion,
      usuarioDireccion: this.usuarioForm.value.domicilio,
      usuarioProfesion: this.usuarioForm.value.profesion,
      rolId: this.usuarioForm.value.rolId,
      sedeId: this.usuarioForm.value.sedeId,
      fecha: "",
      lateralidadId:this.usuarioForm.value.lateralidadId,
      usuarioCorreo:this.usuarioForm.value.email,
      usuarioEstado:this.usuarioForm.value.estado
    }
    this._httpUsuarioService.postCrearUsuario(usuario).subscribe(resp=> {
      const dialogRef = this.dialog.open(DialogGeneral, {
        width: '400px',
        data: {
          mensaje: 'Usuario creado exitosamente'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
  
      });
    })
    /**/
  }
  guardarEditado() {
    let usuario: Usuario={
      usuarioId:this.usuarioId,
      usuarioNombre: this.usuarioForm.value.nombre,
      usuarioIdentificacion: this.usuarioForm.value.cedula,
      usuarioFechaNacimiento: this.usuarioForm.value.fechaNacimiento,
      usuarioTelefono: this.usuarioForm.value.telefono,
      usuarioOcupacion: this.usuarioForm.value.ocupacion,
      usuarioDireccion: this.usuarioForm.value.domicilio,
      usuarioProfesion: this.usuarioForm.value.profesion,
      usuarioCorreo:    this.usuarioForm.value.email,
      rolId: this.usuarioForm.value.rolId,
      sedeId: this.usuarioForm.value.sedeId,
      fecha: "",
      lateralidadId:this.usuarioForm.value.lateralidadId,
      usuarioEstado:this.usuarioForm.value.estado
    }
    this._httpUsuarioService.putUsuario(usuario,this.usuarioId).subscribe(resp=> {
      const dialogRef = this.dialog.open(DialogGeneral, {
        width: '400px',
        data: {
          mensaje: 'Usuario editado exitosamente'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.cargarTabla();
      });
    })
    
  }
}
