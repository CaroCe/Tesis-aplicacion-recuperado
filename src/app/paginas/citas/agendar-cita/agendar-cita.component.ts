import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { DateRange, MatDateRangeSelectionStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogGeneral } from '../../dialog-general/dialog-general';
import { HorarioCita } from '../horario-cita';
@Injectable()
export class FiveDayRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>) { }

  selectionFinished(date: D | null): DateRange<D> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, -2);
      const end = this._dateAdapter.addCalendarDays(date, 2);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}
@Component({
  selector: 'app-agendar-cita',
  templateUrl: './agendar-cita.component.html',
  styleUrls: ['./agendar-cita.component.css'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: FiveDayRangeSelectionStrategy,
    },
  ],
})
export class AgendarCitaComponent implements OnInit {
  displayedColumns: string[] = ['fecha1', 'fecha2', 'fecha3', 'fecha4', 'fecha5'];
  dataSource:HorarioCita[] = [
    {
      fch1:"8:00 - 9:00",
      fch2:"8:00 - 9:00",
      fch3:"8:00 - 9:00",
      fch4:"8:00 - 9:00",
      fch5:"8:00 - 9:00"
    },
    {
      fch1:"9:00 - 10:00",
      fch2:"9:00 - 10:00",
      fch3:"9:00 - 10:00",
      fch4:"9:00 - 10:00",
      fch5:"9:00 - 10:00"
    },
    {
      fch1:"10:00 - 11:00",
      fch2:"",
      fch3:"",
      fch4:"10:00 - 11:00",
      fch5:"10:00 - 11:00"
    },
    {
      fch1:"11:00 - 12:00",
      fch2:"11:00 - 12:00",
      fch3:"11:00 - 12:00",
      fch4:"11:00 - 12:00",
      fch5:"11:00 - 12:00"
    },
    {
      fch1:"",
      fch2:"",
      fch3:"",
      fch4:"",
      fch5:""
    },
    
    {
      fch1:"13:00 - 14:00",
      fch2:"13:00 - 14:00",
      fch3:"13:00 - 14:00",
      fch4:"13:00 - 14:00",
      fch5:"13:00 - 14:00"
    },
    {
      fch1:"14:00 - 15:00",
      fch2:"14:00 - 15:00",
      fch3:"14:00 - 15:00",
      fch4:"14:00 - 15:00",
      fch5:""
    },
    {
      fch1:"",
      fch2:"15:00 - 16:00",
      fch3:"15:00 - 16:00",
      fch4:"15:00 - 16:00",
      fch5:""
    }
  ];
  fecha1: string = 'Lunes 5';
  fecha2: string = 'Martes 6';
  fecha3: string = 'Miércoles 7';
  fecha4: string = 'Jueves 8';
  fecha5: string = 'Viernes 10';

  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
  }

  agendarCita(){
    const dialogRef = this.dialog.open(DialogAgendarCita, {
      width: '400px',
      data: {
        mensaje:'Ejercicio editado exitosamente'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
     
    }); 
  }

}

@Component({
  selector: 'dialog-agendar-cita',
  templateUrl: 'dialog-agendar-cita.html'
})
export class DialogAgendarCita {
  constructor(public dialogRef: MatDialogRef<DialogAgendarCita>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,private dialog:MatDialog) {

  }
  onSubmit(data: any) {
  }
  agendar(){
    const dialogRef = this.dialog.open(DialogGeneral, {
      width: '400px',
      data: {
        mensaje:'Su turno a sido reservado y deberá confirmarlo 72 horas antes de su cita'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
     
    }); 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}