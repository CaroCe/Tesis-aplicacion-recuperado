import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FotosEvolucion, Evolucion } from '../consulta';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EvolucionService } from '../../../servicios/evolucion.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DialogGeneral } from '../../dialog-general/dialog-general';
import { DialogGeneralErrorComponent } from '../../dialog-general-error/dialog-general-error.component';
import { DialogError } from '../../dialog-general-error/dialog-error';

@Component({
  selector: 'app-dialog-editar-evolucion',
  templateUrl: './dialog-editar-evolucion.component.html',
  styleUrls: ['./dialog-editar-evolucion.component.css']
})
export class DialogEditarEvolucionComponent implements OnInit {

  
  @ViewChild('fileInput') fileInput!: ElementRef;
  formEvolucion:FormGroup;
  fotosEvolucion: string[]=[]
  listaFotos:FotosEvolucion[]=[]
  constructor(
    private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Evolucion,
    private formBuilder: FormBuilder,
    private _httpEvolucionService:EvolucionService,private dialogRef: MatDialogRef<DialogEditarEvolucionComponent>
    ) { 
      this.formEvolucion=formBuilder.group({
        descripcion: new FormControl(data.evolucionDescripcion),
        fecha: new FormControl(data.evolucionFecha),
      })
      _httpEvolucionService.getFotosEvolucion().subscribe(resp=>{
        this.listaFotos=resp
      })

    }

  ngOnInit(): void {
  }

  inputFecha(type: string, event: MatDatepickerInputEvent<Date>) {
    this.formEvolucion.patchValue({inputFecha:event.value?.getFullYear()+'-'+(Number(event.value?.getMonth())+1)+'-'+event.value?.getDate()});
    
  }

  uploadFile() {
    let formData = new FormData();
    let files:File[]=this.fileInput.nativeElement.files;
    if (this.fileInput.nativeElement.files?.length) {
      Object.keys(files)?.forEach(async (file, i) => {
        const reader = new FileReader();
        reader.readAsDataURL(this.fileInput.nativeElement.files[i]);
        reader.onload = (e) => {
          if(reader.result){
            this.fotosEvolucion.push(reader.result?.toString());
          }
        };
      });
    } else {
      
    }
  }
  guardarEvolucion(){
    let datos:Evolucion={
      evolucionId:this.data.evolucionId,
      consultaId: this.data.consultaId,
      evolucionDescripcion: this.formEvolucion.value.descripcion,
      evolucionFecha: this.formEvolucion.value.fecha
    }
    if(this.data.evolucionId===0){
      this._httpEvolucionService.postCrearEvolucion(datos).subscribe(resp =>{
          if(this.fotosEvolucion.length==0){
            const dialogRef = this.dialog.open(DialogGeneral, {
              width: '400px',
              data: {
                mensaje:'Evolucion creada exitosamente'
              }
            });
          }
          for(let i=0; i<this.fotosEvolucion.length;i++){
            let datosFotos: FotosEvolucion={
              evolucionId: Number(resp.evolucionId),
              fotoEvolucionImagen: this.fotosEvolucion[i],
              fotoEvolucionDescripcion:'',
            }
            this._httpEvolucionService.postFotosEvolucion(datosFotos).subscribe(result=>{
              if(i==this.fotosEvolucion.length){
                const dialogRef = this.dialog.open(DialogGeneral, {
                  width: '400px',
                  data: {
                    mensaje:'Consulta creada exitosamente'
                  }
                });
              }
              this.fotosEvolucion=[];
              this.dialogRef.close()
            },error=>{
              const dialogRef = this.dialog.open(DialogError, {
                width: '400px',
              });
            });
          
        }
      });
    }else{
      this._httpEvolucionService.putEditarEvolucion(datos, Number(this.data.evolucionId)).subscribe(resp =>{
        
          if(this.fotosEvolucion.length==0){
            const dialogRef = this.dialog.open(DialogGeneral, {
              width: '400px',
              data: {
                mensaje:'Evolucion editada exitosamente'
              }
            });
          }
          for(let i=0; i<this.fotosEvolucion.length;i++){
            let datosFotos: FotosEvolucion={
              fotoEvolucionId:0,
              evolucionId: Number(this.data.evolucionId),
              fotoEvolucionImagen: this.fotosEvolucion[i],
              fotoEvolucionDescripcion:'',
            }
            this._httpEvolucionService.postFotosEvolucion(datosFotos).subscribe(result=>{
              if(i==this.fotosEvolucion.length){
                const dialogRef = this.dialog.open(DialogGeneral, {
                  width: '400px',
                  data: {
                    mensaje:'Evolucion editada exitosamente'
                  }
                });
              }
            },error=>{
              const dialogRef = this.dialog.open(DialogError, {
                width: '400px',
              });
            });
          }
      },error=>{
        const dialogRef = this.dialog.open(DialogError, {
          width: '400px',
        });
      });
    }
    
    
  }
}
