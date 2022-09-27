import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/paginas/login/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class NavService {
 
    constructor(
        private http: HttpClient, 
        private _httpAuthService: AuthService) { }
    getPermisos(email: string,pass:string): Observable<any> {
        const headersOauth = {
            headers: new HttpHeaders()
                .append('Content-Type', 'application/json')
                
        };
        return this.http.get<any>(environment.apiUrl+'Login/'+email+'/'+pass,  headersOauth);
    }
    getEmpleadoId(parametros: any): Observable<any> {
        var datos = {};
        const headersOauth = {
            headers: new HttpHeaders()
                .append('Content-Type', 'application/json')
                
        };
        return this.http.post<any>(environment.apiUrl+'oauth/api/Account/ObtenerId', datos, headersOauth);
    }
}