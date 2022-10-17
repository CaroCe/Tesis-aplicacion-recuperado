import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Evolucion, FotosEvolucion } from '../paginas/consultas/consulta';
import { Observable } from 'rxjs';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}
@Injectable({
  providedIn: 'root'
})
export class EvolucionService {
  private urlService: string = environment.apiUrl+'api/Evoluciones';

  constructor(private http: HttpClient) { }

  getEvolucions():Observable<Evolucion[]>{
    return this.http.get<Evolucion[]>(this.urlService,headerOauth);
  }
  
  getEvolucionesPorConsulta(id:number):Observable<Evolucion[]>{
    return this.http.get<Evolucion[]>(this.urlService+"/PorConsulta/"+id,headerOauth);
  }

  getEvolucionId(id: number):Observable<Evolucion>{
    return this.http.get<Evolucion>(this.urlService+"/"+id,headerOauth);
  }
  postCrearEvolucion(datos: Evolucion):Observable<Evolucion>{
    return this.http.post<Evolucion>(this.urlService,datos,headerOauth)
  }
  putEditarEvolucion(datos: Evolucion,id: number):Observable<any>{
    return this.http.put(this.urlService+'/'+id,datos,headerOauth); 
  };
  postFotosEvolucion(item:FotosEvolucion){
    return this.http.post(environment.apiUrl+"api/FotosEvoluciones",item);
  }
  getImagen():Observable<FotosEvolucion[]>{
    return this.http.get<FotosEvolucion[]>(environment.apiUrl +"api/FotosExaminaciones");
  }

  getFotosEvolucion():Observable<FotosEvolucion[]>{
    return this.http.get<FotosEvolucion[]>(environment.apiUrl +"api/FotosEvoluciones");
  }

}
