import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const headerOauth = {
  headers: new  HttpHeaders()
    .append('Content-Type','application/json'),
}

@Injectable()
export class RolesService {

  private urlService: string = environment.apiUrl+'api/Roles';

  constructor(private http: HttpClient) { }

  getRoles():Observable<any>{

    return this.http.get<any>(this.urlService).pipe(
      map(resp => {
        return resp
      }),
      catchError(error => {
        return throwError("error");
      })
    )
  }

}
