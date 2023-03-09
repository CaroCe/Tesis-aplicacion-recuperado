import { Component, OnInit, VERSION  } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ErrorStateMatcher } from '@angular/material/core';
import { LoginService } from '../login.service';
import { Login, Correo } from '../login.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reseteo-password',
  templateUrl: './reseteo-password.component.html',
  styleUrls: ['./reseteo-password.component.css']
})
export class ReseteoPasswordComponent implements OnInit {

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
  matcher = new MyErrorStateMatcher();
  myTimeout: any;

  envioCodigo:boolean = true;
  verificacionCodigo: boolean = false;
  reseteoCodigo: boolean = false;
  codigo: number = 0;

  formCodigo = new FormGroup(
    {
      email:new FormControl('',[Validators.email,Validators.required])
    }
  );
  formVerificacion = new FormGroup(
    {
      codigo:new FormControl('',[Validators.required])
    }
  );
  formReg = new FormGroup(
    {
      email:new FormControl('',[Validators.email,Validators.required]),
      password:new FormControl('',Validators.required)
    }
  );
  constructor(
    private _router: Router,
    private formBuilder:FormBuilder,
    private http: LoginService,
  ) {
    this.formCodigo = this.formBuilder.group(
      {
        email:new FormControl('',[Validators.email,Validators.required])
      }
    );
    this.formVerificacion = this.formBuilder.group(
      {
        codigo:new FormControl('',[Validators.required])
      }
    );
    this.formReg = this.formBuilder.group(
      {        
        email:new FormControl('',[Validators.email,Validators.required]),
        password:new FormControl('',Validators.required)
      }
    );
   }

  ngOnInit(): void {
  }

  resetear(){
    let datos:Login={
      email:this.formReg.value.email?this.formReg.value.email.toString():'',
      password: this.formReg.value.password?this.formReg.value.password.toString():''
    }
    this.http.getResetearPassword(datos).subscribe(resp=>{
      this.envioCodigo =true;
      this.verificacionCodigo = false;
      this.reseteoCodigo = false;
      this._router.navigate(['/login']);
    },error=>{
      this.envioCodigo =true;
      this.verificacionCodigo = false;
      this.reseteoCodigo = false;
      location.reload();
    })
  }

  enviarCodigo(){
   this.codigo=Math.floor((Math.random() * (999999 - 100000 + 1)) + 100000);
    let emailUsuario:string=this.formCodigo.value.email?this.formCodigo.value.email.toString():'';
    this.http.getValidarEmail(emailUsuario).subscribe(resp=>{
      if(resp){
       let correo:Correo={
          "correo": emailUsuario,
          "correo_trading":environment.emailEmpresa,
          "asunto":"Codigo de Verificacion",
          "body":"<div style='width:80%;padding:10px'><div style='background:#f7bb26;padding:10px;text-align:center'><h2>Código de Verificación</h2></div><div style='padding: 10px;background: #f3f3f3;border: 1px solid #d6d5d5;text-align:center'><p> Hemos recibido una solicitud para acceder al sistema de Flores Fisioterapia. Tu código de verificación es: </p><br><p style='font-size:20px'><strong>"+this.codigo+"</strong></p><br><p>Si no has solicitado este código, puede que alguien esté intentado acceder a su cuenta.</p></div></div>"
        }
        this.http.postEnviarCodigo(correo).subscribe(resp=>{
          this.envioCodigo=false;
          this.verificacionCodigo=true;
          this.myTimeout=setTimeout(() => {
            this._router.navigate(['/login']);
          }, 360000);
        },error=>{
          alert("No se pudo enviar el Código de Verificación. Por favor vuelva a intentarlo")
        })
      }else{
        alert("Verifique el correo y vuelva a intentarlo");
      }
 
    },error=>{
      alert("Verifique el correo y vuelva a intentarlo")
    })

    

  }

  verificarCodigo(){
    if(Number(this.formVerificacion.value.codigo)==this.codigo){
      clearTimeout(this.myTimeout);
      this.verificacionCodigo=false;
      this.reseteoCodigo=true;
    }else{
      this.formVerificacion.patchValue({codigo:''});
    }
  }

  
  
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}