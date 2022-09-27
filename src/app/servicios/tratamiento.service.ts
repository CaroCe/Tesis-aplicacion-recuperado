import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Ejercicio } from '../paginas/admin-ejercicios/ejercicio';
import { Observable } from 'rxjs';
import { EjercicioTratamiento, FaseTratamiento, TratamientoDia } from '../paginas/tratamiento/tratamiento';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable({
  providedIn: 'root'
})
export class TratamientoService {

  private urlService: string = environment.apiUrl+'api/Tratamientos';

  constructor(private http: HttpClient) { }

  getTratamientos():Observable<FaseTratamiento[]>{
    return this.http.get<FaseTratamiento[]>(this.urlService,headerOauth);
  }

  getTratamientoId(id: number):Observable<FaseTratamiento>{
    return this.http.get<FaseTratamiento>(this.urlService+"/"+id,headerOauth);
  }
  getTratamientoDiasId(id: number):Observable<TratamientoDia[]>{
    return this.http.get<TratamientoDia[]>(environment.apiUrl+"api/TratamientosDias/"+id,headerOauth);
  }
  postCrearTratamiento(datos: FaseTratamiento):Observable<any>{
    return this.http.post<any>(this.urlService,datos,headerOauth)
  }
  postCrearTratamientoDia(datos: TratamientoDia):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"api/TratamientosDias",datos,headerOauth);
  }
  postCrearEjercicioTratamiento(datos: EjercicioTratamiento):Observable<any>{
    return this.http.post<any>(environment.apiUrl+"api/EjercicioTratamientos",datos,headerOauth)
  }
  putTratamiento(datos: FaseTratamiento,id: number):Observable<any>{
    return this.http.put(this.urlService+'/'+id,datos,headerOauth); 
  };
}
