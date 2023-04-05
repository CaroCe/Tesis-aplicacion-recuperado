import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Ejercicio } from '../paginas/administracion/admin-ejercicios/ejercicio';
import { Observable, throwError } from 'rxjs';
import { EjercicioTratamiento, FaseTratamiento, TratamientoDia } from '../paginas/tratamiento/tratamiento';
import { map, catchError } from 'rxjs/operators';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable()
export class TratamientoService {

  private urlService: string = environment.apiUrl+'api/Tratamientos';

  constructor(private http: HttpClient) { }

  getTratamientos():Observable<FaseTratamiento[]>{
    return this.http.get<FaseTratamiento[]>(this.urlService,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  getTratamientosPorConsulta(id:number):Observable<FaseTratamiento[]>{
    return this.http.get<FaseTratamiento[]>(this.urlService+'/PorConsulta/'+id,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  getTratamientosPorUsuario(id:number):Observable<FaseTratamiento[]>{
    return this.http.get<FaseTratamiento[]>(this.urlService+'/PorPaciente/'+id,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  getTratamientoId(id: number):Observable<FaseTratamiento>{
    return this.http.get<FaseTratamiento>(this.urlService+"/"+id,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  getTratamientoDiasId(id: number):Observable<TratamientoDia[]>{
    return this.http.get<TratamientoDia[]>(environment.apiUrl+"api/TratamientosDias/"+id,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  postCrearTratamiento(datos: FaseTratamiento):Observable<FaseTratamiento>{
    return this.http.post<FaseTratamiento>(this.urlService,datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  postCrearTratamientoDia(datos: TratamientoDia):Observable<TratamientoDia>{
    return this.http.post<TratamientoDia>(environment.apiUrl+"api/TratamientosDias",datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  postCrearEjercicioTratamiento(datos: EjercicioTratamiento):Observable<EjercicioTratamiento>{
    return this.http.post<EjercicioTratamiento>(environment.apiUrl+"api/EjercicioTratamientos",datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  putEjercicioTratamiento(datos: EjercicioTratamiento,id: number):Observable<any>{
    return this.http.put(environment.apiUrl+'api/EjercicioTratamientos/'+id,datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    ); 
  };

  putTratamiento(datos: FaseTratamiento,id: number):Observable<any>{
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
