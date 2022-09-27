import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private urlService: string = environment.apiUrl+'api/Roles';

  constructor(private http: HttpClient) { }

  getRoles():Observable<any>{

    return this.http.get<any>(this.urlService)
  }

}
