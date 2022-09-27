import { Component, Inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'dialog-registro',
    templateUrl: 'dialog-registro.html',
  })
  export class DialogRegistro {
    constructor(
      public dialogRef: MatDialogRef<DialogRegistro>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder: FormBuilder) {
  
    }
    onSubmit(data: any) {
    }
    regresarLogin(){
      this.dialogRef.close();
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }