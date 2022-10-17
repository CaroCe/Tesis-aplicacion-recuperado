import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogGeneral } from '../dialog-general/dialog-general';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dialog-general-error',
  templateUrl: './dialog-general-error.component.html',
  styleUrls: ['./dialog-general-error.component.css']
})
export class DialogGeneralErrorComponent {
  
  mensaje:string = '';
  constructor(
    public dialogRef: MatDialogRef<DialogGeneralErrorComponent>,
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
