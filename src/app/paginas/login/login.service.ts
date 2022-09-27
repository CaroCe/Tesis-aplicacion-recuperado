import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient, HttpParams} from '@angular/common/http';
import { Login } from './login.interface';
import { environment } from 'src/environments/environment';
import { EntRegistro} from './user.types';
const headersOauth = {
  headers: new HttpHeaders()
    .append('Content-Type', 'application/x-www-form-urlencoded')
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

  getLogin(user: Login) {
    return this.http.get<any>(environment.apiUrl + 'api/Usuarios/Entrar/'+user.email+'/'+user.password);
  }
  postRegistro(registro:EntRegistro){
    return this.http.post( environment.apiUrl+'api/Usuarios/RegistroPaciente',registro);
  }
}
