import { HttpClient, HttpParams, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Login } from '../login/login.interface';
import { AuthUtils } from './auth.utils';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment'

@Injectable()
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false); // {1}
  private _authenticated: boolean = false;
  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }

  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService
  ) {
  }
  set userId(id: number) {
    Number(localStorage.setItem('userId', id.toString()));
  }

  get userId(): number {
    return Number(localStorage.getItem('userId') ?? 0);
  }

  
  signIn(credentials: any): Observable<any> {

    if (this._authenticated) {
      return throwError('User is already logged in.');
    }

    return this._httpClient.get(environment.apiUrl+'api/Usuarios/Entrar/'+credentials.email + '/' + credentials.password).pipe(
      switchMap((response: any) => {
        localStorage.setItem('userId', response.id);
        localStorage.setItem('userName', response.nombre);
        localStorage.setItem('userEmail', response.email);
        localStorage.setItem('menu',JSON.stringify(response.menu));
        this._authenticated = true;
        return of(response);
      })
    );
  }


  /**
   * Sign out
   */
  signOut(): Observable<any> {
    localStorage.removeItem('userId');

    this._authenticated = false;

    return of(true);
  }

  check(): Observable<boolean> {
    if (this._authenticated) {
      return of(true);
    }
    if (this.userId === 0) {
      return of(false);
    }
    return of(true);
  }
}