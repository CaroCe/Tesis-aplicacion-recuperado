import { Component, EventEmitter, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Sede } from '../admin-sedes/sede';
import { SedesService } from '../../../servicios/sedes.service';
import { DialogError } from '../../../componentes/dialog-general-error/dialog-error';
import { DialogGeneral } from '../../../componentes/dialog-general/dialog-general';

@Component({
    selector: 'dialog-sede',
    templateUrl: 'dialog-sede.html',
    styleUrls: ['dialog-sede.css']
  })
  export class DialogSede {
    
    isLoadingResults:boolean=false;
    sedeId: number = 0;
    sedeForm= new  FormGroup({
      sedeNombre: new FormControl('', Validators.required),
      sedeTelefono: new FormControl('', Validators.required),
      sedeDireccion: new FormControl('', Validators.required),
      horaInicio: new FormControl('', Validators.required),
      horaFin: new FormControl('', Validators.required),
      estado: new FormControl(true)
    });
    respuesta = new EventEmitter();

      constructor(
        private dialog:MatDialog,
        public dialogSede: MatDialogRef<DialogSede>,
        @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,private _httpSedeService:SedesService
        ) { 
          this.sedeForm=this.fb.group({
            sedeNombre: new FormControl(data.datos.sedeNombre, Validators.required),
            sedeTelefono: new FormControl(data.datos.sedeTelefono, Validators.required),
            sedeDireccion: new FormControl(data.datos.sedeDireccion, Validators.required),
            horaInicio: new FormControl(data.datos.sedeHoraDesde, Validators.required),
            horaFin: new FormControl(data.datos.sedeHoraHasta, Validators.required),
            estado: new FormControl(data.datos.sedeEstado)
          })

      }
      onSubmit(data: any) {
      }

    guardarSede(){
      if(this.sedeForm.valid){
        this.isLoadingResults=true;
        if(this.data.id==0){
          let sede:Sede={
            sedeNombre: this.sedeForm.value.sedeNombre??'',
            sedeTelefono: this.sedeForm.value.sedeTelefono??'',
            sedeDireccion: this.sedeForm.value.sedeDireccion??'',
            sedeHoraDesde: this.sedeForm.value.horaInicio??'',
            sedeHoraHasta: this.sedeForm.value.horaFin??'',
            sedeEstado: this.sedeForm.value.estado??true
          }
          this._httpSedeService.postCrearSede(sede).subscribe(resp =>{
            const dialogGeneral = this.dialog.open(DialogGeneral, {
              width: '400px',
              data: {
                mensaje:'Sede creada exitosamente'
              }
            });
            dialogGeneral.afterClosed().subscribe(result=>{
              this.isLoadingResults=false;
              this.respuesta.emit();
              this.dialogSede.close();
            });
            
          },error=>{
            const dialogError = this.dialog.open(DialogError, {
              width: '400px'
            });
            this.isLoadingResults=false;
          })
        }else{
          let sede:Sede={
            sedeId: this.data.id,
            sedeNombre: this.sedeForm.value.sedeNombre??'',
            sedeTelefono: this.sedeForm.value.sedeTelefono??'',
            sedeDireccion: this.sedeForm.value.sedeDireccion??'',
            sedeHoraDesde: this.sedeForm.value.horaInicio??'',
            sedeHoraHasta: this.sedeForm.value.horaFin??'',
            sedeEstado: this.sedeForm.value.estado??true
          }
          this._httpSedeService.putEditarSede(sede).subscribe(resp =>{
            const dialogRefGeneral = this.dialog.open(DialogGeneral, {
              width: '400px',
              data: {
                mensaje:'Sede editada exitosamente'
              }
            });
            dialogRefGeneral.afterClosed().subscribe(result=>{
              this.isLoadingResults=false;
              this.respuesta.emit();
              this.dialogSede.close();
            })
          },error=>{
            const dialogRef = this.dialog.open(DialogError, {
              width: '400px'
            });
            this.isLoadingResults=false;
          })
        }
      }

    }
  
    onNoClick(): void {
      this.dialogSede.close();
    }
  }