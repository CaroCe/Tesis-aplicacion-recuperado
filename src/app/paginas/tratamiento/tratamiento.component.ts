import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tratamiento',
  templateUrl: './tratamiento.component.html',
  styleUrls: ['./tratamiento.component.css']
})
export class TratamientoComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'problema', 'diagnostico', 'acciones'];
  dataSource = [
    {
      fecha:'2022-03-22',
      problema: 'Dolor tobillo',
      diagnostico: 'Fractura cerca del ligamento peroneoastragalino posterior',
      id:1
    }
  ];
  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
  }
  abrirTratamiento(){
    const dialogRef = this.dialog.open(DialogTratamientos, {
      width: '500px',
      height:'430px',
      data: {
        
      }
    });
    dialogRef.afterClosed().subscribe(result => {
     
    }); 
  }

}

@Component({
  selector: 'dialog-tratamiento',
  templateUrl: './dialog-tratamiento.html'
})
export class DialogTratamientos {
  typesOfShoes: string[] = ['Fase 1', 'Fase 2', 'Fase 3'];
  constructor(
    public dialogRef: MatDialogRef<DialogTratamientos>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {

  }
  onSubmit(data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
