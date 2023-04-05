import { enableProdMode, Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Ejercicio } from '../paginas/administracion/admin-ejercicios/ejercicio';
import { Observable, throwError } from 'rxjs';
import { Consulta, FotoConsulta } from '../paginas/historia-clinica/consultas/consulta';
import { FiltroConsulta } from '../paginas/historia-clinica/buscar-consulta/buscar-consulta';
import { map, catchError } from 'rxjs/operators';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable()
export class ConsultasService {

  private urlService: string = environment.apiUrl+'api/Consultas';

  constructor(private http: HttpClient) { }

  getConsultas():Observable<Consulta[]>{
    return this.http.get<Consulta[]>(this.urlService,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );;
  }

  postConsultaPorFiltros(filtro:FiltroConsulta):Observable<Consulta[]>{
    return this.http.post<Consulta[]>(this.urlService+'/Filtros',filtro,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  getConsultaId(id: number):Observable<Consulta>{
    return this.http.get<Consulta>(this.urlService+"/"+id,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );;
  }
  postCrearConsulta(datos: Consulta):Observable<number>{
    return this.http.post<number>(this.urlService,datos,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  putConsulta(datos: Consulta,id: number):Observable<any>{
    return this.http.put(this.urlService+'/'+id,datos,headerOauth).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );; 
  };
  postImagen(item:FotoConsulta){
    return this.http.post(environment.apiUrl+"api/FotosExaminaciones",item).pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );;
  }
  getImagen():Observable<FotoConsulta[]>{
    return this.http.get<FotoConsulta[]>(environment.apiUrl +"api/FotosExaminaciones").pipe(
      map(resp => {
        return resp

      }),
      catchError(error => {
        return throwError("error");
      })
    );;
  }
}
