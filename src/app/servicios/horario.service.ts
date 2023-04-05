import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { HorarioDia, HorarioEspecialista, HorarioPorEspecialista, HorarioTrabajo } from '../paginas/administracion/horario-especialista/horario-especialista';
import { map, catchError } from 'rxjs/operators';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable()
export class HorarioService {

  private urlServiceHorarioDia: string = environment.apiUrl+'api/HorariosDias';
  private urlServiceHorarioDiaPorUsuario: string = environment.apiUrl+'api/HorariosEspecialistas/PorUsuario/';
  private urlServiceHorarioEspecialista: string = environment.apiUrl+'api/HorariosEspecialistas';
  private urlServiceHorarioTrabajos: string = environment.apiUrl+'api/HorariosTrabajos';

  constructor(private http: HttpClient) { }

  getHorariosDias():Observable<HorarioDia[]>{
    return this.http.get<HorarioDia[]>(this.urlServiceHorarioDia,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  getHorarioEspecialistaUsuarios(id:number):Observable<HorarioPorEspecialista[]>{
    return this.http.get<HorarioPorEspecialista[]>(this.urlServiceHorarioDiaPorUsuario+id,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  getHorarioDiaId(id: number):Observable<HorarioDia>{
    return this.http.get<HorarioDia>(this.urlServiceHorarioDia+"/"+id,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  postCrearHorarioDia(datos: HorarioDia):Observable<any>{
    return this.http.post<any>(this.urlServiceHorarioDia,datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  putHorarioDia(datos: HorarioDia,id: number):Observable<any>{
    return this.http.put(this.urlServiceHorarioDia+'/'+id,datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    ); 
  };

  getHorariosTrabajo():Observable<HorarioTrabajo[]>{
    return this.http.get<HorarioTrabajo[]>(this.urlServiceHorarioTrabajos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  postHorarioTrabajo(datos:HorarioTrabajo):Observable<any>{
    return this.http.post<any>(this.urlServiceHorarioTrabajos,datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  putHorarioTrabajo(datos:HorarioTrabajo,id:number):Observable<any>{
    return this.http.put<any>(this.urlServiceHorarioTrabajos+'/'+id,datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  postHorarioEspecialista(datos: HorarioEspecialista):Observable<any>{
    return this.http.post(this.urlServiceHorarioEspecialista,datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    ); 
  };
}
