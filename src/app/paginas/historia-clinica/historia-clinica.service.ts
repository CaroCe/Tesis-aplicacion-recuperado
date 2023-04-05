import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Observable, throwError } from 'rxjs';
import { HistoriaClinicaConsulta, Lateralidad, FiltroHistoria } from './historia-clinica';
import { map, catchError } from 'rxjs/operators';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}
@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {

  private urlService: string = environment.apiUrl+'api/HistoriaClinicas';

  constructor(private http: HttpClient) { }

  getHistorias():Observable<HistoriaClinicaConsulta[]>{
    return this.http.get<HistoriaClinicaConsulta[]>(this.urlService,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  postHistoriasFiltros(filtro:FiltroHistoria):Observable<HistoriaClinicaConsulta[]>{
    return this.http.post<HistoriaClinicaConsulta[]>(this.urlService+'/Filtros',filtro,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }


  getHistoriaId(id: number):Observable<HistoriaClinicaConsulta>{
    return this.http.get<HistoriaClinicaConsulta>(this.urlService+"/"+id,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  postCrearHistoria(datos: HistoriaClinicaConsulta):Observable<HistoriaClinicaConsulta>{
    return this.http.post<HistoriaClinicaConsulta>(this.urlService,datos,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    )
  }
  putHistoria(datos: HistoriaClinicaConsulta,id: number):Observable<any>{
    return this.http.put(this.urlService+'/'+id,datos,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    ); 
  };
  getLateralidades():Observable<Lateralidad[]>{
    return this.http.get<Lateralidad[]>(environment.apiUrl+'api/Lateralidades',headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

}
