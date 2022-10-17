import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Ejercicio } from '../paginas/admin-ejercicios/ejercicio';
import { Observable } from 'rxjs';
import { Consulta, FotoConsulta } from '../paginas/consultas/consulta';
import { Usuario } from '../paginas/users/user';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {

  private urlService: string = environment.apiUrl+'api/Usuarios/Especialista';

  constructor(private http: HttpClient) { }

  getEspecialistas():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.urlService,headerOauth);
  }
  getPacientes():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.urlService,headerOauth);
  }
}
