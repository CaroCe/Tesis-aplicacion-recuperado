import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogGeneral } from '../dialog-general/dialog-general';
import { Ejercicio } from './ejercicio';
import { FormGroup, FormBuilder, FormControl, FormControlName } from '@angular/forms';
import { EjerciciosService } from '../../servicios/ejercicios.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-ejercicios',
  templateUrl: './admin-ejercicios.component.html',
  styleUrls: ['./admin-ejercicios.component.css']
})
export class AdminEjerciciosComponent implements OnInit {

  urlGrafico: SafeResourceUrl ="";
  ejercicioId:number=0;
  dataSource= new MatTableDataSource<Ejercicio>();
  ejercicioForm: FormGroup;
  displayedColumns:string[]=['nombre','descripcion','estado']
  constructor(
    private dialog:MatDialog, private fb: FormBuilder, private _httpEjercicioService:EjerciciosService,public sanitizer:DomSanitizer
  ) {
    this.ejercicioForm=this.fb.group({
      ejercicioNombre: new FormControl(''),
      ejercicioGrafico: new FormControl(''),
      ejercicioDescripcion: new FormControl(''),
    })
   }

  ngOnInit(): void {
    this.cargarTabla();
    this.urlGrafico = this.sanitizer.bypassSecurityTrustResourceUrl("");
  }

  applyFilter(event: Event) {
    const filterValues = (event.target as HTMLInputElement).value;
    this.dataSource.filter=filterValues.trim().toLowerCase();
  }


  cargarTabla(){
    this._httpEjercicioService.getEjercicios().subscribe(resp=>{
      this.dataSource= new MatTableDataSource<Ejercicio>();
      this.dataSource.data=resp
    })
  }

  guardarEjercicio(){
    if(this.ejercicioId==0){
      let ejercicio:Ejercicio={
        ejercicioNombre: this.ejercicioForm.value.ejercicioNombre,
        ejercicioDescripcion: this.ejercicioForm.value.ejercicioDescripcion,
        ejercicioGrafico:this.ejercicioForm.value.ejercicioGrafico
      }
      this._httpEjercicioService.postCrearEjercicio(ejercicio).subscribe(resp=>{
        const dialogRef = this.dialog.open(DialogGeneral, {
          width: '400px',
          data: {
            mensaje:'Ejercicio creado exitosamente'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.cargarTabla();
        }); 
      })
    }else{
      let ejercicio:Ejercicio={
        ejercicioNombre: this.ejercicioForm.value.ejercicioNombre,
        ejercicioDescripcion: this.ejercicioForm.value.ejercicioDescripcion,
        ejercicioGrafico:this.ejercicioForm.value.ejercicioGrafico
      }
      this._httpEjercicioService.putEjercicio(ejercicio,this.ejercicioId).subscribe(resp=>{
        const dialogRef = this.dialog.open(DialogGeneral, {
          width: '400px',
          data: {
            mensaje:'Ejercicio creado exitosamente'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.cargarTabla();
        }); 
      })
    }

    
  }
  guardarEditarEjercicio(){
    const dialogRef = this.dialog.open(DialogGeneral, {
      width: '400px',
      data: {
        mensaje:'Ejercicio editado exitosamente'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
     
    }); 
  }
  editarEjercicio(item:any){
    this.ejercicioId=item.ejercicioId;
    this.ejercicioForm.patchValue({ejercicioNombre:item.ejercicioNombre,ejercicioDescripcion:item.ejercicioDescripcion,ejercicioGrafico:item.ejercicioGrafico});
    this.urlGrafico = this.sanitizer.bypassSecurityTrustResourceUrl(item.ejercicioGrafico);
  }

  visualizarGrafico(event: any){
    this.urlGrafico = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.value);
  }
}
