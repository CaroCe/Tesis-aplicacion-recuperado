import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { Sede } from '../paginas/administracion/admin-sedes/sede';
import { map, catchError } from 'rxjs/operators';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable()
export class SedesService {

  private urlService: string = environment.apiUrl+'api/Sedes';

  constructor(private http: HttpClient) { }

  getSedeId(id:number):Observable<Sede>{
    return this.http.get<Sede>(this.urlService+'/'+id,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  getSedes():Observable<any>{
    return this.http.get<any>(this.urlService,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  postCrearSede(datos: Sede): Observable<any>{
    return this.http.post<any>(this.urlService, datos).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  putEditarSede(datos: Sede): Observable<any>{
    return this.http.put<any>(this.urlService+'/'+datos.sedeId, datos).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
}
