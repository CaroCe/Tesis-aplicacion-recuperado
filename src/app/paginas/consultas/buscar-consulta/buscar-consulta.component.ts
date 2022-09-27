import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConsultaBuscador } from './buscar-consulta';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConsultasService } from '../../../servicios/consulta.service';
import { Observable } from 'rxjs';
import { Consulta } from '../consulta';
import { Usuario } from '../../users/user';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { DialogVistaConsultaComponent } from '../dialog-vista-consulta/dialog-vista-consulta.component';

@Component({
  selector: 'app-buscar-consulta',
  templateUrl: './buscar-consulta.component.html',
  styleUrls: ['./buscar-consulta.component.css']
})
export class BuscarConsultaComponent implements OnInit {
  usuarios: Usuario[]=[];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  displayedColumns: string[] = ['fecha', 'paciente', 'problema', 'diagnostico','acciones'];
  dataSource= new MatTableDataSource<Consulta>();

  constructor(
    private dialog:MatDialog, 
    private _httpConsutaService: ConsultasService, 
    private _httpUsuarioService: UsuariosService
    ) {
    this._httpUsuarioService.getUsuarios().subscribe(resp=>{this.usuarios=resp});
  }

  ngOnInit(): void {
    this.cargarTabla();
  }

  cargarTabla(){
    this._httpConsutaService.getConsultas().subscribe(resp =>{
      this.dataSource= new MatTableDataSource<Consulta>();
      this.dataSource.data=resp;
    })
  }

  verConsulta(datos: Consulta){
    const dialogRef = this.dialog.open(DialogVistaConsultaComponent, {
      width: '1000px',
      height: '800px',
      data: datos

    });
    dialogRef.afterClosed().subscribe(result => {
     
    }); 
  }
}
