import { Component, Inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'dialog-general',
    templateUrl: 'dialog-general.html',
  })
  export class DialogGeneral {
    mensaje:string = '';
    constructor(
      public dialogRef: MatDialogRef<DialogGeneral>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder: FormBuilder) {
        this.mensaje = data.mensaje;
    }
    onSubmit() {
      this.dialogRef.close();
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }