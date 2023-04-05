import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { CitaPost, FiltroCitas, HorarioDisponibleCita } from './horario-cita';
import { CitaAdmin } from './mis-citas/citas';
import { map, catchError } from 'rxjs/operators';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable({
  providedIn:'root'
})
export class CitasService {

  private urlService: string = environment.apiUrl+'api/Citas/HorarioDisponible';
  private urlServiceCita: string = environment.apiUrl+'api/Citas';

  constructor(private http: HttpClient) { }

  getHorariosDisponibles(filtro:FiltroCitas):Observable<HorarioDisponibleCita[]>{
    return this.http.post<HorarioDisponibleCita[]>(this.urlService,filtro,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  postCita(item:CitaPost){
    return this.http.post(this.urlServiceCita,item,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  getCitas(filtro:any):Observable<CitaAdmin[]>{
    return this.http.post<CitaAdmin[]>(this.urlServiceCita+"/Admin",filtro,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  getCambiarEstado(id:number,estado:number){
    return this.http.get(this.urlServiceCita+"/Estado/"+id+"/"+estado,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

}
