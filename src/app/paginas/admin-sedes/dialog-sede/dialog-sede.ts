import { Component, EventEmitter, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Sede } from '../sede';
import { SedesService } from '../../../servicios/sedes.service';

@Component({
    selector: 'dialog-sede',
    templateUrl: 'dialog-sede.html',
    styleUrls: ['dialog-sede.css']
  })
  export class DialogSede {
    
    sedeId: number = 0;
    sedeForm: FormGroup;
    respuesta = new EventEmitter();

      constructor(
        public dialogRef: MatDialogRef<DialogSede>,
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
        console.log(data)
      }

    guardarSede(){
      console.log(this.sedeForm);
      if(this.sedeForm.valid){
        if(this.data.id==0){
          let sede:Sede={
            sedeNombre: this.sedeForm.value.sedeNombre,
            sedeTelefono: this.sedeForm.value.sedeTelefono,
            sedeDireccion: this.sedeForm.value.sedeDireccion,
            sedeHoraDesde: this.sedeForm.value.horaInicio,
            sedeHoraHasta: this.sedeForm.value.horaFin,
            sedeEstado: this.sedeForm.value.estado
          }
          this._httpSedeService.postCrearSede(sede).subscribe(resp =>{
            this.respuesta.emit()
          })
        }else{
          let sede:Sede={
            sedeId: this.data.id,
            sedeNombre: this.sedeForm.value.sedeNombre,
            sedeTelefono: this.sedeForm.value.sedeTelefono,
            sedeDireccion: this.sedeForm.value.sedeDireccion,
            sedeHoraDesde: this.sedeForm.value.horaInicio,
            sedeHoraHasta: this.sedeForm.value.horaFin,
            sedeEstado: this.sedeForm.value.estado
          }
          this._httpSedeService.putEditarSede(sede).subscribe(resp =>{
            this.respuesta.emit()
          })
        }
      }

    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }