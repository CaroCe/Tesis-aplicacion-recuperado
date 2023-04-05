import { Injectable, enableProdMode } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Evolucion, FotosEvolucion } from '../paginas/historia-clinica/consultas/consulta';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}
@Injectable()
export class EvolucionService {
  private urlService: string = environment.apiUrl+'api/Evoluciones';

  constructor(private http: HttpClient) { }

  getEvolucions():Observable<Evolucion[]>{
    return this.http.get<Evolucion[]>(this.urlService,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  
  getEvolucionesPorConsulta(id:number):Observable<Evolucion[]>{
    return this.http.get<Evolucion[]>(this.urlService+"/PorConsulta/"+id,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  getEvolucionId(id: number):Observable<Evolucion>{
    return this.http.get<Evolucion>(this.urlService+"/"+id,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  postCrearEvolucion(datos: Evolucion):Observable<Evolucion>{
    return this.http.post<Evolucion>(this.urlService,datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  putEditarEvolucion(datos: Evolucion,id: number):Observable<any>{
    return this.http.put(this.urlService+'/'+id,datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    ); 
  };
  postFotosEvolucion(item:FotosEvolucion){
    return this.http.post(environment.apiUrl+"api/FotosEvoluciones",item).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  getImagen():Observable<FotosEvolucion[]>{
    return this.http.get<FotosEvolucion[]>(environment.apiUrl +"api/FotosExaminaciones").pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  getFotosEvolucion():Observable<FotosEvolucion[]>{
    return this.http.get<FotosEvolucion[]>(environment.apiUrl +"api/FotosEvoluciones").pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  getFotosPorEvolucion(id:number):Observable<FotosEvolucion[]>{
    return this.http.get<FotosEvolucion[]>(environment.apiUrl +"api/FotosEvoluciones/PorEvolucionId/"+id).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

}
