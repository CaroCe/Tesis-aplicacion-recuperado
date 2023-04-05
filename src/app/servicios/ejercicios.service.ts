import { Injectable, enableProdMode } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Ejercicio } from '../paginas/administracion/admin-ejercicios/ejercicio';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable()
export class EjerciciosService {

  private urlService: string = environment.apiUrl+'api/Ejercicios';

  constructor(private http: HttpClient) { }

  getEjercicios():Observable<Ejercicio[]>{
    return this.http.get<Ejercicio[]>(this.urlService,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  getEjercicioId(id: number):Observable<Ejercicio>{
    return this.http.get<Ejercicio>(this.urlService+"/"+id,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  postCrearEjercicio(datos: Ejercicio):Observable<any>{
    return this.http.post<any>(this.urlService,datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  putEjercicio(datos: Ejercicio,id: number):Observable<any>{
    return this.http.put(this.urlService+'/'+id,datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    ); 
  };

  deleteEjercicio(id: number):Observable<any>{
    return this.http.delete(this.urlService+'/'+id,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    ); 
  };
}
