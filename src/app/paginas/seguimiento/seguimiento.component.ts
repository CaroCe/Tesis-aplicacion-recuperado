import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Usuario } from '../users/user';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  listaUsuarios:Usuario[]=[];
  displayedColumns: string[] = ['fecha', 'problema', 'diagnostico', 'acciones'];
  dataSource = [
    {
      fecha:'2022-03-22',
      problema: 'Dolor tobillo',
      diagnostico: 'Fractura cerca del ligamento peroneoastragalino posterior',
      id:1
    }
  ];
  constructor(private dialog:MatDialog, private _httpUsuariosService: UsuariosService) { 
    _httpUsuariosService.getUsuarios().subscribe(resp=>{
      this.listaUsuarios=resp;
    })
  }

  ngOnInit(): void {
  }
  verTratamiento(){
    const dialogRef = this.dialog.open(DialogSeguimiento, {
      width: '900px',
      height:'430px',
      data: {
        
      }
    });
    dialogRef.afterClosed().subscribe(result => {
     
    }); 
  }

}

@Component({
  selector: 'dialog-seguimiento',
  templateUrl: './dialog-seguimiento.html'
})
export class DialogSeguimiento {
  typesOfShoes: string[] = ['Fase 1', 'Fase 2', 'Fase 3'];
  constructor(
    public dialogRef: MatDialogRef<DialogSeguimiento>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {

  }
  onSubmit(data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
