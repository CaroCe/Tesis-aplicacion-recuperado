import { Component, EventEmitter, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Sede } from '../sede';
import { SedesService } from '../../../servicios/sedes.service';

@Component({
    selector: 'dialog-sede',
    templateUrl: 'dialog-sede.html',
    styleUrls: ['dialog-sede.css']
  })
  export class DialogSede {
    
  sedeForm: FormGroup;
  respuesta = new EventEmitter();

    constructor(
      public dialogRef: MatDialogRef<DialogSede>,
      @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,private _httpSedeService:SedesService
      ) { 
        this.sedeForm=this.fb.group({
          sedeNombre: new FormControl(''),
          sedeTelefono: new FormControl(''),
          sedeDireccion: new FormControl(''),
          horaInicio: new FormControl(''),
          horaFin: new FormControl(''),
          estado: new FormControl(false)
        })

    }
    onSubmit(data: any) {
      console.log(data)
    }

    guardarSede(){
      console.log(this.sedeForm);
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
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }