import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../../environments/environment';

const headersOauth = {
  headers: new HttpHeaders()
    .append('Content-Type', 'application/json'),
};

@Injectable()
export class UsuariosService {
  urlServices = environment.apiUrl;

  constructor(private http: HttpClient) {
  }
}

