import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogSede } from './dialog-sede/dialog-sede';
import { Sede } from './sede';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SedesService } from '../../servicios/sedes.service';

@Component({
  selector: 'app-admin-sedes',
  templateUrl: './admin-sedes.component.html',
  styleUrls: ['./admin-sedes.component.css']
})
export class AdminSedesComponent implements OnInit {
  listaSedes:Sede[] =[];
  sedeForm: FormGroup;

  displayedColumns:string[] =['nombre','ubicacion','telefono','horarioInicio','horarioFin','estado']
  constructor(private dialog:MatDialog, private fb: FormBuilder,private _httpSedeService:SedesService) { 
    this.sedeForm=this.fb.group({
      sedeNombre: new FormControl(''),
      sedeTelefono: new FormControl(''),
      sedeDireccion: new FormControl(''),
      horaInicio: new FormControl(''),
      horaFin: new FormControl('')
    })
  }

  ngOnInit(): void {
    this.cargarTabla()
  }

  nuevaSede(){
    const dialogRef = this.dialog.open(DialogSede, {
      width: '500px',
      data: {
        
      }
    });

    dialogRef.componentInstance.respuesta.subscribe((result)=>{
      dialogRef.close();
      this.cargarTabla();
    });
  }

  cargarTabla(){
    this._httpSedeService.getSedes().subscribe(resp => {
      this.listaSedes=resp
    })
  }
}
