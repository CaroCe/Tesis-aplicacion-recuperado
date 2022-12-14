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

  getTratamientosPorConsulta(id:number):Observable<FaseTratamiento[]>{
    return this.http.get<FaseTratamiento[]>(this.urlService+'/PorConsulta/'+id,headerOauth);
  }
  getTratamientosPorUsuario(id:number):Observable<FaseTratamiento[]>{
    return this.http.get<FaseTratamiento[]>(this.urlService+'/PorPaciente/'+id,headerOauth);
  }

  getTratamientoId(id: number):Observable<FaseTratamiento>{
    return this.http.get<FaseTratamiento>(this.urlService+"/"+id,headerOauth);
  }
  getTratamientoDiasId(id: number):Observable<TratamientoDia[]>{
    return this.http.get<TratamientoDia[]>(environment.apiUrl+"api/TratamientosDias/"+id,headerOauth);
  }
  postCrearTratamiento(datos: FaseTratamiento):Observable<FaseTratamiento>{
    return this.http.post<FaseTratamiento>(this.urlService,datos,headerOauth)
  }
  postCrearTratamientoDia(datos: TratamientoDia):Observable<TratamientoDia>{
    return this.http.post<TratamientoDia>(environment.apiUrl+"api/TratamientosDias",datos,headerOauth);
  }
  postCrearEjercicioTratamiento(datos: EjercicioTratamiento):Observable<EjercicioTratamiento>{
    return this.http.post<EjercicioTratamiento>(environment.apiUrl+"api/EjercicioTratamientos",datos,headerOauth)
  }

  putEjercicioTratamiento(datos: EjercicioTratamiento,id: number):Observable<any>{
    return this.http.put(environment.apiUrl+'api/EjercicioTratamientos/'+id,datos,headerOauth); 
  };

  putTratamiento(datos: FaseTratamiento,id: number):Observable<any>{
    return this.http.put(this.urlService+'/'+id,datos,headerOauth); 
  };
}
