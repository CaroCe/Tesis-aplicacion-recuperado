import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogGeneral } from '../../../componentes/dialog-general/dialog-general';
import { Ejercicio } from './ejercicio';
import { FormGroup, FormBuilder, FormControl, FormControlName, Validators } from '@angular/forms';
import { EjerciciosService } from '../../../servicios/ejercicios.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { DialogError } from '../../../componentes/dialog-general-error/dialog-error';

@Component({
  selector: 'app-admin-ejercicios',
  templateUrl: './admin-ejercicios.component.html',
  styleUrls: ['./admin-ejercicios.component.css']
})
export class AdminEjerciciosComponent implements OnInit {

  isLoadingResults:boolean=false;
  urlGrafico: SafeResourceUrl ="";
  ejercicioId:number=0;
  dataSource= new MatTableDataSource<Ejercicio>();
  urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  urlValido:boolean=true;
  ejercicioForm= new FormGroup({
    ejercicioNombre: new FormControl('',Validators.required),
    ejercicioGrafico: new FormControl('',[Validators.required, Validators.pattern(this.urlRegex)]),
    ejercicioDescripcion: new FormControl(''),
    ejercicioEstado: new FormControl(true)
  });
  displayedColumns:string[]=['nombre','descripcion','estado']
  constructor(
    private dialog:MatDialog, private fb: FormBuilder, private _httpEjercicioService:EjerciciosService,public sanitizer:DomSanitizer
  ) {
    this.ejercicioForm=this.fb.group({
      ejercicioNombre: new FormControl('',Validators.required),
      ejercicioGrafico: new FormControl('',Validators.required),
      ejercicioDescripcion: new FormControl(''),
      ejercicioEstado: new FormControl(true)
    })
   }

  ngOnInit(): void {
    this.cargarTabla();
    this.urlGrafico = this.sanitizer.bypassSecurityTrustResourceUrl("");
  }

  nuevo(){
    this.ejercicioForm.reset();
    this.ejercicioId=0;
    this.urlGrafico=this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  applyFilter(event: Event) {
    const filterValues = (event.target as HTMLInputElement).value;
    this.dataSource.filter=filterValues.trim().toLowerCase();
  }


  cargarTabla(){
    this._httpEjercicioService.getEjercicios().subscribe(resp=>{
      this.dataSource= new MatTableDataSource<Ejercicio>();
      this.dataSource.data=resp
      this.isLoadingResults=false;
    },error=>{
      this.isLoadingResults=false;
    })
  }

  guardarEjercicio(){
    if(this.ejercicioForm.valid){
      this.isLoadingResults=true;
      if(this.ejercicioId==0){
        let ejercicio:Ejercicio={
          ejercicioNombre: this.ejercicioForm.value.ejercicioNombre??'',
          ejercicioDescripcion: this.ejercicioForm.value.ejercicioDescripcion??'',
          ejercicioGrafico:this.ejercicioForm.value.ejercicioGrafico??'',
          ejercicioEstado: true
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
        },error=>{
          this.isLoadingResults=false;
        })
      }else{
        let ejercicioEditado:Ejercicio={
          ejercicioId:this.ejercicioId,
          ejercicioNombre: this.ejercicioForm.value.ejercicioNombre??'',
          ejercicioDescripcion: this.ejercicioForm.value.ejercicioDescripcion??'',
          ejercicioGrafico:this.ejercicioForm.value.ejercicioGrafico??'',
          ejercicioEstado: this.ejercicioForm.value.ejercicioEstado??true
        }
        this._httpEjercicioService.putEjercicio(ejercicioEditado,this.ejercicioId).subscribe(resp=>{
          const dialogRef = this.dialog.open(DialogGeneral, {
            width: '400px',
            data: {
              mensaje:'Ejercicio creado exitosamente'
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            this.cargarTabla();
          }); 
        },error=>{
          const dialogRef = this.dialog.open(DialogError, {
            width: '400px'
          });
          this.isLoadingResults=false;
        })
      }
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
  editarEjercicio(item:Ejercicio){
    this.ejercicioId=Number(item.ejercicioId);
    this.ejercicioForm.patchValue({
      ejercicioNombre:item.ejercicioNombre,
      ejercicioDescripcion:item.ejercicioDescripcion,
      ejercicioGrafico:item.ejercicioGrafico,
      ejercicioEstado: item.ejercicioEstado
    });
    this.urlGrafico = this.sanitizer.bypassSecurityTrustResourceUrl(item.ejercicioGrafico);
  }

  eliminarEjercicio(id:number){
    this._httpEjercicioService.deleteEjercicio(id).subscribe(resp=>{
      this.cargarTabla();
    })
  }
  visualizarGrafico(event: any){
    try {
      new URL(event.target.value);
      this.urlGrafico = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.value);
      this.urlValido=true;
    } catch (err) {
      this.urlValido=false;
    }
    
  }

  cambiarEstado(estado:boolean, datos:Ejercicio){
    this.isLoadingResults=true;
    let ejercicio:Ejercicio={
      ejercicioId: datos.ejercicioId,
      ejercicioNombre: datos.ejercicioNombre,
      ejercicioDescripcion: datos.ejercicioDescripcion,
      ejercicioGrafico: datos.ejercicioGrafico,
      ejercicioEstado: estado
    }
    this._httpEjercicioService.putEjercicio(ejercicio,Number(datos.ejercicioId)).subscribe(resp =>{
      this.cargarTabla();
      const dialogRef = this.dialog.open(DialogGeneral, {
        width: '400px',
        data: {
          mensaje:'Cambio de estado exitosamente'
        }
      });
    },error=>{
      this.isLoadingResults=false;
      const dialogRef = this.dialog.open(DialogError, {
        width: '400px'
      });
    })
  }
}
