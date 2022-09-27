import { Component, OnInit, VERSION } from '@angular/core';
import { LoginService } from './login.service';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogRegistro } from './dialogs/dialog-registro/dialog-registro';
import { EntRegistro } from './user.types';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:boolean = true;
  username: string = "";
  password: string = "";
  mensaje = false;
  ngVersion: string = VERSION.full;
  matVersion: string = '5.1.0';
  breakpoint: number = 0;
  alturaFila: string = '100%';
  numeroFilas: number = 1;
  alineacionLogo: string = "";
  alineacionFormulario: string = "";
  imagen: string = environment.logoName;
  nombreEmpresa: string = environment.tituloApp;
  isLoadingResults = false;
  formLogin = new FormGroup(
    {
      email:new FormControl('',Validators.required),
      password:new FormControl('',Validators.required)
    }
  );
  formReg = new FormGroup(
    {
      nombre:new FormControl('',Validators.required),
      cedula:new FormControl('',Validators.required),
      fechaNacimiento:new FormControl(new Date,Validators.required),
      telefono:new FormControl('',Validators.required),
      domicilio:new FormControl('',Validators.required),
      email:new FormControl('',Validators.required),
      password:new FormControl('',Validators.required),
      confirmPassword:new FormControl('',Validators.required)
    }
  );
  constructor(
    private _activatedRoute: ActivatedRoute,
    private http: LoginService,
    private _authService: AuthService,
    private _router: Router,
    private formBuilder:FormBuilder,
    public dialog: MatDialog
  ) {
    
  }

  private buildForm(){
    this.formLogin = this.formBuilder.group({
      email:['',Validators.required],
      password:['',Validators.required]
    });
    this.formReg = new FormGroup(
      {
        nombre:new FormControl('',Validators.required),
        cedula:new FormControl('',Validators.required),
        fechaNacimiento:new FormControl(new Date,Validators.nullValidator),
        telefono:new FormControl('',Validators.required),
        domicilio:new FormControl('',Validators.required),
        email:new FormControl('',Validators.required),
        password:new FormControl('',Validators.required),
        confirmPassword:new FormControl('',Validators.required)
      }
    );
  }
  reg(){
    this.loginForm = false;
  }
  log(){
    this.loginForm = true;
  }
  ngOnInit() {
    this.buildForm();
    if (window.innerWidth <= 500) {
      this.breakpoint = 1;
      this.alturaFila = "33.33%";
      this.numeroFilas = 2;
      this.alineacionLogo = "center";
      this.alineacionFormulario = "center";
    }
    else {
      this.breakpoint = 2;
      this.alturaFila = "100%";
      this.numeroFilas = 1;
      this.alineacionLogo = "right";
      this.alineacionFormulario = "left";
    }

  }
  onResize(event: any) {
    if (event.target.innerWidth <= 500) {
      this.breakpoint = 1;
      this.alturaFila = "33.33%";
      this.numeroFilas = 2;
      this.alineacionLogo = "center";
      this.alineacionFormulario = "center";
    }
    else {
      this.breakpoint = 2;
      this.alturaFila = "100%";
      this.numeroFilas = 1;
      this.alineacionLogo = "right";
      this.alineacionFormulario = "left";
    }
  }

  abrirConfirmacionRegistro(){
    const dialogRef = this.dialog.open(DialogRegistro, {
      width: '400px',
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.formReg = new FormGroup(
        {
          nombre:new FormControl('',Validators.required),
          cedula:new FormControl('',Validators.required),
          fechaNacimiento:new FormControl(new Date,Validators.nullValidator),
          telefono:new FormControl('',Validators.required),
          domicilio:new FormControl('',Validators.required),
          email:new FormControl('',Validators.required),
          password:new FormControl('',Validators.required),
          confirmPassword:new FormControl('',Validators.required)
        }
      );
      this.log();
    });
  }
  registrar(){
    let itemRegistro:EntRegistro ={
      nombre:this.formReg.value.nombre?.toString(),
      cedula:this.formReg.value.cedula?.toString(),
      domicilio:this.formReg.value.domicilio?.toString(),
      email:this.formReg.value.email?.toString(),
      telefono:this.formReg.value.telefono?.toString(),
      fechaNacimiento: this.formReg.value.fechaNacimiento??undefined,
      password:this.formReg.value.password?.toString(),
      id:0,
      rolId:3
    }
    if(itemRegistro.nombre != ''
    && itemRegistro.email != ''
    && itemRegistro.cedula != ''
    && itemRegistro.password != ''
    && itemRegistro.domicilio != ''
    ){
      if(itemRegistro.password !== this.formReg.value.confirmPassword){
        alert("La contraseña y la confirmación no son iguales");
      }
      else{
        this.http.postRegistro(itemRegistro).subscribe(
          c=>{
            this.abrirConfirmacionRegistro();
          },
          error=>{
            alert("Error al registrar usuario");
          }
          
        );
      }
    }
    else{
      alert("Se debe completar todos los campos");
    }
    

    
  }
  login() {

    this.isLoadingResults =true;

    // Return if the form is invalid
    if ( this.formLogin?.invalid )
    {
      this.isLoadingResults =false;
        return;
    }

    // Disable the form
    this.formLogin?.disable();


    // Sign in
    this._authService.signIn(this.formLogin?.value)
        .subscribe(
            (a) => {
              const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
              this.isLoadingResults =false;
              this._router.navigateByUrl(redirectURL);
            },
            (response) => {
              this.isLoadingResults =false;
              this.formLogin?.enable();
              alert("Correo o contraseña erróneas");
            }
        );
  }

}
