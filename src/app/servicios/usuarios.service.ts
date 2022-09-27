import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FiltroUsuarios, Usuario } from '../paginas/users/user';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private urlService: string = environment.apiUrl+'api/Usuarios';

  constructor(private http: HttpClient) { }

  getUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.urlService,headerOauth)
  }


  getUsuarioId(id:number):Observable<Usuario>{
    return this.http.get<Usuario>(this.urlService+'/'+id,headerOauth)
  }


  getUsuariosFiltro(filtro:FiltroUsuarios):Observable<Usuario[]>{
    return this.http.post<Usuario[]>(this.urlService+"/Filtro",filtro,headerOauth)
  }

  postCrearUsuario(datos: Usuario):Observable<any>{
    return this.http.post<any>(this.urlService,datos,headerOauth)
  }
  putUsuario(datos: Usuario,id: number):Observable<any>{
    return this.http.put(this.urlService+'/'+id,datos,headerOauth); 
  };
}
