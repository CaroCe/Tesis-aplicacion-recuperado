import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Ejercicio } from '../paginas/admin-ejercicios/ejercicio';
import { Observable } from 'rxjs';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable({
  providedIn: 'root'
})
export class EjerciciosService {

  private urlService: string = environment.apiUrl+'api/Ejercicios';

  constructor(private http: HttpClient) { }

  getEjercicios():Observable<Ejercicio[]>{
    return this.http.get<Ejercicio[]>(this.urlService,headerOauth);
  }

  getEjercicioId(id: number):Observable<Ejercicio>{
    return this.http.get<Ejercicio>(this.urlService+"/"+id,headerOauth);
  }
  postCrearEjercicio(datos: Ejercicio):Observable<any>{
    return this.http.post<any>(this.urlService,datos,headerOauth)
  }
  putEjercicio(datos: Ejercicio,id: number):Observable<any>{
    return this.http.put(this.urlService+'/'+id,datos,headerOauth); 
  };
}
