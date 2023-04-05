import { Component, Inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'dialog-error',
    templateUrl: 'dialog-error.html',
  })
  export class DialogError {
    mensaje:string = '';
    style:string='color:black'
    constructor(
      public dialogRef: MatDialogRef<DialogError>,
      private formBuilder: FormBuilder) {
    }
    onSubmit() {
      this.dialogRef.close();
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }