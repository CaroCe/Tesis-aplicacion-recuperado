import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { FiltroUsuarios, Usuario } from '../paginas/administracion/users/user';
import { map, catchError } from 'rxjs/operators';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable()
export class UsuariosService {

  private urlService: string = environment.apiUrl+'api/Usuarios';

  constructor(private http: HttpClient) { }

  getUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.urlService,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }


  getUsuarioId(id:number):Observable<Usuario>{
    return this.http.get<Usuario>(this.urlService+'/'+id,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }


  getUsuariosFiltro(filtro:FiltroUsuarios):Observable<Usuario[]>{
    return this.http.post<Usuario[]>(this.urlService+"/Filtro",filtro,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  postCrearUsuario(datos: Usuario):Observable<any>{
    return this.http.post<any>(this.urlService,datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  putUsuario(datos: Usuario,id: number):Observable<any>{
    return this.http.put(this.urlService+'/'+id,datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    ); 
  };
}
