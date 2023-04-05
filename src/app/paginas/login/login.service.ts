import { Injectable, enableProdMode } from '@angular/core';
import {HttpHeaders, HttpClient, HttpParams} from '@angular/common/http';
import { Login, Correo } from './login.interface';
import { environment } from 'src/environments/environment';
import { EntRegistro} from './user.types';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const headersOauth = {
  headers: new HttpHeaders()
    .append('Content-Type', 'application/x-www-form-urlencoded')
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

  getLogin(user: Login) {
    return this.http.get<any>(environment.apiUrl + 'api/Usuarios/Entrar/'+user.email+'/'+user.password).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  postRegistro(registro:EntRegistro){
    return this.http.post( environment.apiUrl+'api/Usuarios/RegistroPaciente',registro).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  getResetearPassword(user: Login):Observable<any[]>{
    return this.http.get<any>( environment.apiUrl+'api/Usuarios/ResetPassword/'+user.email+'/'+user.password,{}).pipe(
      map(resp => {
        
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );;
  }

  postEnviarCodigo(correo:Correo):Observable<any[]>{
    return this.http.post<any>( environment.correoUrl,JSON.stringify(correo)).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );;
  }

  getValidarEmail(correo:string):Observable<any[]>{
    return this.http.get<any>( environment.apiUrl+'api/Usuarios/ValidarCorreo/'+correo).pipe(
      map(resp => {
        return resp;
      }),
      catchError(error => {
        return throwError("error");
      })
    );;
  }
}
