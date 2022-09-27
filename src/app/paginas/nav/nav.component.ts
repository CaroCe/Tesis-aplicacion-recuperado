import { Component, OnInit, Inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { AuthService } from '../login/auth.service';
import { NavService } from './nav.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ThemePalette } from '@angular/material/core';
declare const $: any;
let ROUTES: any = [];
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  colorPrimario: ThemePalette = 'primary';
  nombre_empresa = environment.tituloApp;
  userEmail: string = '';
  userName: string = '';
  userPass: string = '';
  menuItems: any[] = [];
  imagen: string = environment.logoName;
  panelOpenState = false;
  email: any;
  isLoggedIn$: Observable<boolean> | undefined;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private _httpPermisos: NavService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,

    @Inject(DOCUMENT) private document: Document) {


    document.title = environment.tituloApp;
    this.userEmail = localStorage.getItem('userEmail')!;
    this.userName = localStorage.getItem('userName')!;
    this.menuItems = JSON.parse(localStorage.getItem('menu')??'');
  }


  ngOnInit() {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this._unsubscribeAll)
    ).subscribe(() => {

    });
  }
  logout() {
    localStorage.clear();
    this.isLoggedIn$ = new BehaviorSubject<boolean>(false);
    this.isLoggedIn$ = this.authService.isLoggedIn;
    window.location.reload();
    this._router.navigate(['/login']);

  }

}
