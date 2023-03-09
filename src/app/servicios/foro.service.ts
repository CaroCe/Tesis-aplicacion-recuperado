import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Foro, comentarioForo, filtroForo } from '../paginas/foro/foro.interface';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable({
  providedIn: 'root'
})
export class ForoService {

  private urlService: string = environment.apiUrl+'api/Foros';

  constructor(private http: HttpClient) { }

  getForos():Observable<Foro[]>{
    return this.http.get<Foro[]>(this.urlService,headerOauth);
  }

  postConsultarForos(filtro: filtroForo):Observable<Foro[]>{
    return this.http.post<Foro[]>(this.urlService+'/Filtro',filtro,headerOauth)
  }


  getCambiaEstadoForo(consultaId: number, estado:boolean):Observable<Foro>{
    return this.http.get<Foro>(this.urlService+"/CambiarEstado/"+consultaId+"/"+estado,headerOauth);
  }

  postComentarioForo(datos: comentarioForo):Observable<any>{
    return this.http.post<any>(this.urlService+"/ComentarioForo/",datos,headerOauth)
  }
  putForo(datos: Foro,id: number):Observable<any>{
    return this.http.put(this.urlService+'/'+id,datos,headerOauth); 
  };

  getComentarios(foroId:number):Observable<comentarioForo[]>{
    return this.http.get<comentarioForo[]>(this.urlService+"/ComentarioForo/"+foroId,headerOauth);
  }
}
