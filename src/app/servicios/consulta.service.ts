import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Ejercicio } from '../paginas/admin-ejercicios/ejercicio';
import { Observable } from 'rxjs';
import { Consulta, FotoConsulta } from '../paginas/consultas/consulta';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  private urlService: string = environment.apiUrl+'api/Consultas';

  constructor(private http: HttpClient) { }

  getConsultas():Observable<Consulta[]>{
    return this.http.get<Consulta[]>(this.urlService,headerOauth);
  }

  getConsultaId(id: number):Observable<Consulta>{
    return this.http.get<Consulta>(this.urlService+"/"+id,headerOauth);
  }
  postCrearConsulta(datos: Consulta):Observable<number>{
    return this.http.post<number>(this.urlService,datos,headerOauth)
  }
  putConsulta(datos: Consulta,id: number):Observable<any>{
    return this.http.put(this.urlService+'/'+id,datos,headerOauth); 
  };
  postImagen(item:FotoConsulta){
    return this.http.post(environment.apiUrl+"api/FotosExaminaciones",item);
  }
  getImagen():Observable<FotoConsulta[]>{
    return this.http.get<FotoConsulta[]>(environment.apiUrl +"api/FotosExaminaciones");
  }
}
