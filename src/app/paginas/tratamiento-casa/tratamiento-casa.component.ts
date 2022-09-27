import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tratamiento-casa',
  templateUrl: './tratamiento-casa.component.html',
  styleUrls: ['./tratamiento-casa.component.css']
})
export class TratamientoCasaComponent implements OnInit {

  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
  }

  verEjercicio(){
    const dialogRef = this.dialog.open(DialogTratamientoCasa, {
      width: '500px',
      height:'440px',
      data: {
        
      }
    });
    dialogRef.afterClosed().subscribe(result => {
     
    }); 
  }
}


@Component({
  selector: 'dialog-tratamiento-casa',
  templateUrl: './dialog-tratamiento-casa.html'
})
export class DialogTratamientoCasa {
  typesOfShoes: string[] = ['Fase 1', 'Fase 2', 'Fase 3'];
  constructor(
    public dialogRef: MatDialogRef<DialogTratamientoCasa>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {

  }
  onSubmit(data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}