import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Sede } from '../paginas/admin-sedes/sede';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable({
  providedIn: 'root'
})
export class SedesService {

  private urlService: string = environment.apiUrl+'api/Sedes';

  constructor(private http: HttpClient) { }

  getSedes():Observable<any>{
    return this.http.get<any>(this.urlService,headerOauth)
  }

  postCrearSede(datos: Sede): Observable<any>{
    return this.http.post<any>(this.urlService, datos);
  }
}
