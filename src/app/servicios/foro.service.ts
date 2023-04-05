import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable, throwError } from 'rxjs';
import { Foro, comentarioForo, filtroForo } from '../paginas/foro/foro.interface';
import { map, catchError } from 'rxjs/operators';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable()
export class ForoService {

  private urlService: string = environment.apiUrl+'api/Foros';

  constructor(private http: HttpClient) { }

  getForos():Observable<Foro[]>{
    return this.http.get<Foro[]>(this.urlService,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  postConsultarForos(filtro: filtroForo):Observable<Foro[]>{
    return this.http.post<Foro[]>(this.urlService+'/Filtro',filtro,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }


  getCambiaEstadoForo(consultaId: number, estado:boolean):Observable<Foro>{
    return this.http.get<Foro>(this.urlService+"/CambiarEstado/"+consultaId+"/"+estado,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }

  postComentarioForo(datos: comentarioForo):Observable<any>{
    return this.http.post<any>(this.urlService+"/ComentarioForo/",datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
  putForo(datos: Foro,id: number):Observable<any>{
    return this.http.put(this.urlService+'/'+id,datos,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    ); 
  };

  getComentarios(foroId:number):Observable<comentarioForo[]>{
    return this.http.get<comentarioForo[]>(this.urlService+"/ComentarioForo/"+foroId,headerOauth).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    );
  }
}
