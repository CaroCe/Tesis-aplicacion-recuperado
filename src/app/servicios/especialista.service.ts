import { Injectable, enableProdMode } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Ejercicio } from '../paginas/administracion/admin-ejercicios/ejercicio';
import { Observable, throwError } from 'rxjs';
import { Consulta, FotoConsulta } from '../paginas/historia-clinica/consultas/consulta';
import { Usuario } from '../paginas/administracion/users/user';
import { map, catchError } from 'rxjs/operators';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable()
export class EspecialistaService {

  private urlService: string = environment.apiUrl+'api/Usuarios/Especialista';

  constructor(private http: HttpClient) { }

  getEspecialistas():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.urlService,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  getPacientes():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.urlService,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
}
