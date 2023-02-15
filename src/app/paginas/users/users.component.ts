import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogGeneral } from '../dialog-general/dialog-general';
import { FiltroUsuarios, Usuario } from './user';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { UsuariosService } from '../../servicios/usuarios.service';
import { RolesService } from '../../servicios/roles.service';
import { Rol } from './rol';
import { Sede } from '../admin-sedes/sede';
import { MatTableDataSource } from '@angular/material/table';
import { SedesService } from '../../servicios/sedes.service';
import { DatePipe } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{

  sedeFiltro = new FormControl(0)
  estadoUsuario = new FormControl(false)
  sedeUsuario = new FormControl(0)
  rolUsuario = new FormControl(0)
  usuarioId: number = 0;
  matcher = new MyErrorStateMatcher();
  usuarioForm= new FormGroup({
    nombre : new FormControl('',Validators.required),
    cedula : new FormControl('',Validators.required),
    fechaNacimiento : new FormControl(new Date(),Validators.required),
    telefono : new FormControl('',Validators.required),
    ocupacion : new FormControl(''),
    domicilio : new FormControl('',Validators.required),
    profesion : new FormControl(''),
    email: new FormControl('',[Validators.email,Validators.required]),
    //password:new FormControl('',Validators.required),
    rolId : this.rolUsuario,
    sedeId : this.sedeUsuario,
    estado : new FormControl(true),

  });

  filtroForm: FormGroup;
  displayedColumns: string[] = ['name', 'date', 'phone','estado'];
  listaUsuarios : Usuario[] =[];
  listaRoles: Rol[] = [];
  listaSedes: Sede[] = [];

  constructor(public dialog: MatDialog, private fb: FormBuilder, private _httpUsuarioService: UsuariosService, private _httpRolService: RolesService, private _httpSedeService: SedesService) {
    this.filtroForm = fb.group({
      nombre: new FormControl(''),
      cedula: new FormControl(''),
      sedeId: new FormControl(0),
      rolId:new FormControl(0)
    })
    
    _httpRolService.getRoles().subscribe(resp=>{
      this.listaRoles=resp;
    });
    _httpSedeService.getSedes().subscribe(resp => {
      this.listaSedes=resp;
    })
  }

  ngOnInit(): void {
    this.usuarioForm= new FormGroup({
      nombre : new FormControl('',Validators.required),
      cedula : new FormControl('',Validators.required),
      fechaNacimiento : new FormControl(new Date(),Validators.required),
      telefono : new FormControl('',Validators.required),
      ocupacion : new FormControl(''),
      domicilio : new FormControl('',Validators.required),
      profesion : new FormControl(''),
      email: new FormControl('',[Validators.email,Validators.required]),
      //password:new FormControl('',Validators.required),
      rolId : this.rolUsuario,
      sedeId : this.sedeUsuario,
      estado : new FormControl(true)
    });
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
      fechaNacimiento:item.usuarioFechaNacimiento??new Date(),
      telefono:item.usuarioTelefono,
      ocupacion: item.usuarioOcupacion,
      domicilio: item.usuarioDireccion,
      profesion: item.usuarioProfesion,
      email: item.usuarioCorreo,
      rolId: item.rolId,
      sedeId: item.sedeId,
      estado: item.usuarioEstado,
      //password: item.password??''
    });
    this.rolUsuario.patchValue(item.rolId);
    this.sedeUsuario.patchValue(item.sedeId)
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
      usuarioNombre: this.usuarioForm.value.nombre??toString(),
      usuarioIdentificacion: this.usuarioForm.value.cedula??toString(),
      usuarioFechaNacimiento: this.usuarioForm.value.fechaNacimiento??undefined,
      usuarioTelefono: this.usuarioForm.value.telefono??toString(),
      usuarioOcupacion: this.usuarioForm.value.ocupacion??toString(),
      usuarioDireccion: this.usuarioForm.value.domicilio??toString(),
      usuarioProfesion: this.usuarioForm.value.profesion??toString(),
      //password:this.usuarioForm.value.password??toString(),
      rolId: Number(this.usuarioForm.value.rolId),
      sedeId: Number(this.usuarioForm.value.sedeId),
      fecha: "",
      lateralidadId:0,
      usuarioCorreo:this.usuarioForm.value.email??toString(),
      usuarioEstado:true
    }
    this._httpUsuarioService.postCrearUsuario(usuario).subscribe(resp=> {
      const dialogRef = this.dialog.open(DialogGeneral, {
        width: '400px',
        data: {
          mensaje: 'Usuario creado exitosamente'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.cargarTabla()
      });
    })
    /**/
  }
  guardarEditado() {
    let usuario: Usuario={
      usuarioId:this.usuarioId,
      usuarioNombre: this.usuarioForm.value.nombre??toString(),
      usuarioIdentificacion: this.usuarioForm.value.cedula??toString(),
      usuarioFechaNacimiento: this.usuarioForm.value.fechaNacimiento??undefined,
      usuarioTelefono: this.usuarioForm.value.telefono??toString(),
      usuarioOcupacion: this.usuarioForm.value.ocupacion??toString(),
      usuarioDireccion: this.usuarioForm.value.domicilio??toString(),
      usuarioProfesion: this.usuarioForm.value.profesion??toString(),
      usuarioCorreo:this.usuarioForm.value.email??toString(),
      //password:this.usuarioForm.value.password??toString(),
      rolId: Number(this.usuarioForm.value.rolId),
      sedeId: Number(this.usuarioForm.value.sedeId),
      fecha: "",
      lateralidadId:0,
      usuarioEstado:this.usuarioForm.value.estado??false
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

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}