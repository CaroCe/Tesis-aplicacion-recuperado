import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs';
import { HistoriaClinicaConsulta, Lateralidad } from './historia-clinica';

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
    return this.http.get<HistoriaClinicaConsulta[]>(this.urlService,headerOauth);
  }

  getHistoriaId(id: number):Observable<HistoriaClinicaConsulta>{
    return this.http.get<HistoriaClinicaConsulta>(this.urlService+"/"+id,headerOauth);
  }
  postCrearHistoria(datos: HistoriaClinicaConsulta):Observable<any>{
    return this.http.post<any>(this.urlService,datos,headerOauth)
  }
  putHistoria(datos: HistoriaClinicaConsulta,id: number):Observable<any>{
    return this.http.put(this.urlService+'/'+id,datos,headerOauth); 
  };
  getLateralidades():Observable<Lateralidad[]>{
    return this.http.get<Lateralidad[]>(environment.apiUrl+'api/Lateralidades',headerOauth);
  }

}
