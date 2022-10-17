import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Evolucion, Consulta, FotosEvolucion } from '../consulta';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { EvolucionService } from '../../../servicios/evolucion.service';
import { DialogEditarEvolucionComponent } from '../dialog-editar-evolucion/dialog-editar-evolucion.component';

@Component({
  selector: 'app-dialog-consulta-evaluacion',
  templateUrl: './dialog-consulta-evaluacion.component.html',
  styleUrls: ['./dialog-consulta-evaluacion.component.css']
})
export class DialogConsultaEvaluacionComponent implements OnInit {
  
  
  @ViewChild('fileInput') fileInput!: ElementRef;

  divNuevo:boolean=false;
  displayedColumnsEvolucion: string[] = ['fecha', 'descripcion', 'id'];
  dataSourceEvolucion:Evolucion[] = [];
  formEvolucion:FormGroup;
  fotosEvolucion: string[]=[]

  constructor(
    private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Consulta,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private _httpEvolucionService:EvolucionService
  ) { 
    this.formEvolucion=formBuilder.group({
      descripcion: new FormControl(''),
      fecha: new FormControl(new Date()),
    })
    
  }

  ngOnInit(): void {
    this.cargarEvoluciones();
  }

  inputFecha(type: string, event: MatDatepickerInputEvent<Date>) {
    this.formEvolucion.patchValue({inputFecha:event.value?.getFullYear()+'-'+(Number(event.value?.getMonth())+1)+'-'+event.value?.getDate()});
      
  }

  cargarEvoluciones(){
    this._httpEvolucionService.getEvolucionesPorConsulta(Number(this.data.consultaId)).subscribe(resp=>{
      this.dataSourceEvolucion=resp;
    })
  }

  nuevaEvolucion(){
    /*this.formEvolucion.patchValue({descripcion:'',fecha:new Date()});
    this.fileInput.nativeElement.value = '';
    this.fotosEvolucion=[];*/
    let nuevaEvolucion:Evolucion={
      consultaId: this.data.consultaId,
      evolucionId:0,
      evolucionFecha: new Date(),
      evolucionDescripcion: '',
      fotosEvolucions:[]
    }
    let datos:Evolucion={
      consultaId: this.data.consultaId,
      evolucionFecha: new Date('09-12-2022'),
      evolucionDescripcion: 'ejemplo de descripcion',
      evolucionId:1,
      fotosEvolucions:[]
    }
    const dialogRef = this.dialog.open(DialogEditarEvolucionComponent, {
      width: '500px',
      height: '650px',
      data: nuevaEvolucion
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cargarEvoluciones();
    }); 
  }

  uploadFile() {
    console.log(this.fileInput);
    let formData = new FormData();
    let files:File[]=this.fileInput.nativeElement.files;
    if (this.fileInput.nativeElement.files?.length) {
      Object.keys(files)?.forEach(async (file, i) => {
        const reader = new FileReader();
        reader.readAsDataURL(this.fileInput.nativeElement.files[i]);
        reader.onload = (e) => {
          if(reader.result){
            this.fotosEvolucion.push(reader.result?.toString());
          }
          /*selectedFiles = selectedFiles?.filter(f => f?.name != files[i]?.name)
          selectedFiles.push({ name: files[i]?.name, file: files[i], base64: reader?.result as string })
          result.next(selectedFiles);
          if (files?.length === (i + 1)) {
            result.complete();
          }*/
        };
      });
    } else {
      
    }

    //this.fileInput.nativeElement.value = '';
    console.log(this.fotosEvolucion)
  }

  guardarEvolucion(){
    let datos:Evolucion={
      consultaId: this.data.consultaId,
      evolucionDescripcion: this.formEvolucion.value.descripcion
    }
    this._httpEvolucionService.postCrearEvolucion(datos).subscribe(resp =>{
      if(datos.evolucionId!==0){
        for(let i=0; i<this.fotosEvolucion.length;i++){
          let datosFotos: FotosEvolucion={
            evolucionId:Number(resp.evolucionId),
            fotoEvolucionImagen: this.fotosEvolucion[i]
          }
          this._httpEvolucionService.postFotosEvolucion(datosFotos).subscribe(result=>{
            console.log(result)
          });
        }
        
      }
    })
  }

  editarEvolucion(element:Evolucion){
    
    const dialogRef = this.dialog.open(DialogEditarEvolucionComponent, {
      width: '500px',
      height: '650px',
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
     this.cargarEvoluciones();
    }); 
  }
}
