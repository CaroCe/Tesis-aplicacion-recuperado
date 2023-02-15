import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fromEvent, map, Observable, pairwise, startWith, Subscription, switchMap, takeUntil } from 'rxjs';
import { Usuario } from '../users/user';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Consulta, FotoConsulta, Evolucion } from './consulta';
import { ConsultasService } from 'src/app/servicios/consulta.service';
import { FaseTratamiento, TratamientoDia, EjercicioTratamiento } from '../tratamiento/tratamiento';
import { TratamientoService } from 'src/app/servicios/tratamiento.service';
import { Ejercicio } from '../admin-ejercicios/ejercicio';
import { EjerciciosService } from 'src/app/servicios/ejercicios.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DialogGeneral } from '../dialog-general/dialog-general';
import { HistoriaClinicaConsulta } from '../historia-clinica/historia-clinica';
import { EvolucionService } from '../../servicios/evolucion.service';
import { FiltroConsulta } from './buscar-consulta/buscar-consulta';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { HistoriaClinicaService } from '../historia-clinica/historia-clinica.service';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements AfterViewInit, OnDestroy {
  @Input() width = 520;
  @Input() height = 450;
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  cx!: CanvasRenderingContext2D;
  drawingSubscription!: Subscription;
  pacId: Number = 0;
  pacienteId = new FormControl<string | Usuario>('');;
  usuarios: Usuario[] = [];
  filteredOptions: Observable<Usuario[]> | undefined;
  outlineImage = new Image();
  listaArchivos:string[] =[];
  displayedColumns: string[] = ['fase', 'fechaInicio', 'id'];
  displayedColumnsEvolucion: string[] = ['fecha', 'descripcion', 'id'];
  dataSource = [];
  dataSourceEvolucion = []
  consultaId:number =0;
  historiaId:number =0;
  problema = new FormControl('');
  motivo = new FormControl('');
  descripcion = new FormControl('');
  imagenEsquema: string = "";
  descripcionDolor = new FormControl('');
  observacion = new FormControl('');
  inspeccion = new FormControl('');
  diagnostico = new FormControl('');
  pacienteNombre:string="";

  constructor(private _formBuilder: FormBuilder, private dialog: MatDialog, private _httpUsuarioService: UsuariosService, private _httpConsulta:ConsultasService) {
    this._httpUsuarioService.getUsuarios().subscribe(resp => { this.usuarios = resp });
    this.filteredOptions = this.pacienteId.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.usuarioNombre;
        return name ? this._filter(name as string) : this.usuarios.slice();
      }),
    );


  }
  private _filter(name: string): Usuario[] {
    const filterValue = name.toLowerCase();
    return this.usuarios.filter(option => option.usuarioNombre.toLowerCase().includes(filterValue));
  }
  displayFn(user: Usuario): string {
    return user && user.usuarioNombre ? user.usuarioNombre : '';
  }
  agregarEvolucion() {
    const dialogRef = this.dialog.open(DialogEvolucion, {
      width: '400px',
      height: '550px',
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  ngOnInit(): void {
  }
  crearConulta(item: Usuario) {
    
    this.pacId = item.usuarioId;
    this.pacienteNombre=item.usuarioNombre;
    this.historiaId = item.historiaId??0;
  }
  guardarEsquema() {
    this.imagenEsquema = this.canvas.nativeElement.toDataURL();
    const dialogRef = this.dialog.open(DialogGeneral, {
      width: '400px',
      data: {
        mensaje:'Imagen agregada'
      }
    });
  }
  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d')!;
    canvasEl.width = this.width;
    canvasEl.height = this.height;
    this.outlineImage.src = '/assets/cuerpo-humano.png';
    this.outlineImage.height = 450;
    this.outlineImage.width = 520;
    setTimeout(() => {
      this.cx.drawImage(this.outlineImage, 0, 0);
    }, 500);
    this.cx.lineWidth = 11;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#FF0000';
    this.captureEvents(canvasEl);
  }
  captureEvents(canvasEl: HTMLCanvasElement) {
    this.drawingSubscription = fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap(e => {
          return fromEvent(canvasEl, 'mousemove').pipe(
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            takeUntil(fromEvent(canvasEl, 'mouseleave')),
            pairwise()
          );
        })
      )
      .subscribe((res: any) => {
        const rect = canvasEl.getBoundingClientRect();

        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        this.drawOnCanvas(prevPos, currentPos);
      });

  }
  guardarConsulta(){
    let itemConsulta:Consulta ={
      consultaMotivo:this.motivo.value??'',
      consultaDescripcion:this.descripcion.value??'',
      consultaDescripImagen:this.descripcionDolor.value??'',
      examinacionObservacion:this.observacion.value??'',
      examinacionInspeccion:this.inspeccion.value??'',
      diagnostico:this.diagnostico.value??'',
      consultaFecha:new Date(Date.now()),
      consultaImagen: this.imagenEsquema,
      consultaProblema:this.problema.value??'',
      especialistaId:Number(localStorage.getItem('userId')),
      historiaId:this.historiaId,
      pacienteNombre:this.pacienteNombre
    }
    this._httpConsulta.postCrearConsulta(itemConsulta).subscribe(respuestaId=>{
      this.consultaId = respuestaId;
      if(this.listaArchivos.length==0){
        const dialogRef = this.dialog.open(DialogGeneral, {
          width: '400px',
          data: {
            mensaje:'Consulta creada exitosamente'
          }
        });
      }
      this.listaArchivos.forEach((cx, i)=>{
        let item:FotoConsulta ={
          fotoExaminacionImagen:cx,
          fotoExaminacionDescripcion:"",
          consultaId:this.consultaId,
          fotoExaminacionId:0
        }
        this._httpConsulta.postImagen(item).subscribe(h=>{
          console.log(i)
          if(i==this.listaArchivos.length){
            const dialogRef = this.dialog.open(DialogGeneral, {
              width: '400px',
              data: {
                mensaje:'Consulta creada exitosamente'
              }
            });
          }
        });
      });
    });
    
  }
  borrarTodo() {
    this.cx.clearRect(0, 0, 520, 450);
    this.cx.drawImage(this.outlineImage, 0, 0);
  }

  drawOnCanvas(
    prevPos: { x: number; y: number },
    currentPos: { x: number; y: number }
  ) {

    if (!this.cx) {
      return;
    }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);

      this.cx.stroke();
    }
  }
  agregarFase() {
    let datos:FaseTratamiento={
      tratamientoId:0,
      tratamientoDias : 0,
      tratamientoFechaInicio: new Date(),
      tratamientoFase :'',
      tratamientoDescripcion : '',
      tratamientoObservacion : '',
      tratamientoRecomendacion : '',
      consultaId:Number(this.consultaId),
      tratamientoFechaCreacion: new Date(),
      tratamientoCompleto: false,
      tratamientosDia:[]
    }
    const dialogRef = this.dialog.open(DialogTratamientoFase, {
      width: '1400px',
      height: '1000px',
      data: datos
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  ngOnDestroy() {
    this.drawingSubscription.unsubscribe();
  }
  limpiarImagenes(){
    this.listaArchivos = [];
  }
  toBase64(file:File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  uploadFile() {
    this.toBase64(this.fileInput.nativeElement.files[0]).then(
      (c:any)=>{
        this.listaArchivos.push(c);
        this.fileInput.nativeElement.value = '';
      }
    ).catch(e=>{
    });

  }

}
@Component({
  selector: 'dialog-tratamiento-fase',
  templateUrl: 'dialog-tratamiento-fase.html',
  styleUrls: ['dialog-tratamiento-fase.css']
})
export class DialogTratamientoFase implements AfterViewInit{
  mensaje: string = '';
  form:FormGroup;
  @ViewChild('fechaInput') fechaInput!: MatDatepickerInputEvent<Date>;
  @ViewChild('diaInput') diaInput!: ElementRef;
  dias = new FormControl('',Validators.required);
  fechaInicio = new FormControl(new Date(Date.now()));
  descripcion = new FormControl('');
  observacion = new FormControl('');
  recomendacion = new FormControl('');
  diaSemana:string[] = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  listaDias: TratamientoDia[] = [];


  constructor(
    public dialogRef1: MatDialogRef<DialogTratamientoFase>,
    @Inject(MAT_DIALOG_DATA) public data: FaseTratamiento,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _httpTratamiento:TratamientoService) {
      
      this.form=formBuilder.group({
        fase : new FormControl(data.tratamientoFase, Validators.required),
        dias : new FormControl(data.tratamientoDias,Validators.required),
        fechaInicio : new FormControl(new Date(data.tratamientoFechaInicio), Validators.required),
        descripcion : new FormControl(data.tratamientoDescripcion),
        observacion : new FormControl(data.tratamientoObservacion),
        recomendacion : new FormControl(data.tratamientoRecomendacion),
        fechaCreacion: new FormControl(data.tratamientoFechaCreacion)
      })
      if(data.tratamientoId!==0){
        this.cargarDias();
      }      
  }

  ngAfterViewInit(): void {
    //this.fechaInput.target.dateInput.subscribe(resp=>{console.log("cambio fecha")})
  }
  generarDias(){
    this.listaDias=[]
      for(let i=0;i<Number(this.form.value.dias);i++){
        let add:number =i*(24*60*60*1000);
        let fech:number = this.form.value.fechaInicio?.getTime()??0;
        let itemDia:TratamientoDia={
          tratamientoDiaFecha: new Date(add + fech ),
          tratamientoDiaId:0,
          tratamientoId:0,
          ejercicioTratamientos:[],
          fecha:''
        }
        //console.log(this.fechaInput.value?.getDate());
        //console.log(i*(24*60*60*1000));
        itemDia.fecha = this.diaSemana[itemDia.tratamientoDiaFecha.getDay()]+' '+itemDia.tratamientoDiaFecha.getDate() +'-'+(itemDia.tratamientoDiaFecha.getMonth()+1)
        this.listaDias.push(itemDia);
      }
  }

  cargarDias(){
    console.log(this.data)
    this.listaDias=this.data.tratamientosDia;
    this.listaDias?.forEach(dia=>{
    let fecha= new Date(dia.tratamientoDiaFecha);
    dia.fecha=this.diaSemana[fecha.getDay()]+' '+fecha.getDate() +'-'+(fecha.getMonth()+1);
      dia.ejercicioTratamientos= dia.ejercicioTratamientos;
      //this.listaDias.push(dia);
    });
  }

  onSubmit(data: any) {
  }

  guardarFase(){
    let itemFase:FaseTratamiento ={
      consultaId:this.data.consultaId,
      tratamientoCompleto:this.data.tratamientoCompleto,
      tratamientoDescripcion:this.form.value.descripcion,
      tratamientoDias:Number(this.form.value.dias),
      tratamientoFase:this.form.value.fase,//this.data.numero+1,
      tratamientoFechaCreacion: this.form.value.fechaCreacion,
      tratamientoFechaInicio: this.form.value.fechaInicio,//??new Date(Date.now()),
      tratamientoRecomendacion: this.form.value.recomendacion,
      tratamientoObservacion:this.form.value.observacion,
      tratamientoId:this.data.tratamientoId,
      tratamientosDia:[]
    }
    if(this.data.tratamientoId==0){
      this._httpTratamiento.postCrearTratamiento(itemFase).subscribe(respuestaTratamiento=>{
        this.listaDias.forEach((dia,i)=>{
          dia.tratamientoId=respuestaTratamiento.tratamientoId;
          let datosDia:TratamientoDia={
            tratamientoDiaId:0,
            tratamientoId:dia.tratamientoId,
            tratamientoDiaFecha: dia.tratamientoDiaFecha,
            ejercicioTratamientos:[]
          }
          this._httpTratamiento.postCrearTratamientoDia(datosDia).subscribe(respuestaDia=>{
            dia.tratamientoDiaId=respuestaDia.tratamientoDiaId;
            if(i+1===this.listaDias.length){
              const dialogRef = this.dialog.open(DialogGeneral, {
                width: '400px',
                data: {
                  mensaje:'Fase de Tratamiento creada exitosamente'
                }
              });
              dialogRef.afterClosed().subscribe(result => {
                
              });
            }
          })
        });
      });
    }else{
      this._httpTratamiento.putTratamiento(itemFase, this.data.tratamientoId).subscribe(respuestaTratamiento=>{
        const dialogRef = this.dialog.open(DialogGeneral, {
          width: '400px',
          data: {
            mensaje:'Fase de Tratamiento editada exitosamente'
          }
        });
      });
    }
  }

  agregarEjercicio(diaId:number) {
    let ejercicio:EjercicioTratamiento={
      tratamientoDiaId:diaId,
      ejercicioTratamientoId:0,
      ejercicioTratamientoRepeticiones:0,
      ejercicioTratamientoSerie:0,
      ejercicioDescanso:'',
      ejercicioId:0,
      ejercicioNombre:'',
      ejercicioEstado:false,
      ejercicioObservacion:''
    }
    const dialogRef = this.dialog.open(DialogEjercicio, {
      width: '450px',
      height: '550px',
      data: ejercicio
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result!==undefined){
        this.listaDias[this.listaDias.findIndex(c=>c.tratamientoDiaId == result.tratamientoDiaId)].ejercicioTratamientos?.push(result);
      }
      
    });
  }

  editarEjercicioTratamiento(element:EjercicioTratamiento){
    const dialogRef = this.dialog.open(DialogEjercicio, {
      width: '450px',
      height: '550px',
      data: element
    });
  }

  onNoClick(): void {
    this.dialogRef1.close();
  }
}

@Component({
  selector: 'dialog-ejercicio',
  templateUrl: 'dialog-ejercicio.html',
  styleUrls: ['dialog-ejercicio.css']
})
export class DialogEjercicio {
  repeticiones = new FormControl('');
  series = new FormControl('');
  descanso = new FormControl('');
  observacion = new FormControl('');
  listaEjercicios:Ejercicio[] =[];
  form:FormGroup;
  
  constructor(
    private dialog:MatDialog,
    public dialogRef1: MatDialogRef<DialogEjercicio>,
    @Inject(MAT_DIALOG_DATA) public data: EjercicioTratamiento,
    private formBuilder: FormBuilder,
    private _httpEjercicio:EjerciciosService,
    private _httpTratamientoService: TratamientoService) {
      _httpEjercicio.getEjercicios().subscribe(c=>{
        this.listaEjercicios = c;
      });
      this.form=formBuilder.group({
        repeticiones: new FormControl(data.ejercicioTratamientoRepeticiones,Validators.required),
        series: new FormControl(data.ejercicioTratamientoSerie,Validators.required),
        descanso: new FormControl(data.ejercicioDescanso,Validators.required),
        observacion: new FormControl(data.ejercicioObservacion),
        ejercicioId: new FormControl(data.ejercicioId),
        ejercicioNombre: new FormControl(data.ejercicioNombre),
      })
  }
  onSubmit(data: any) {
  }

  ejercicioSeleccionado(value: Ejercicio){
    console.log(value)
    this.form.patchValue({ejercicioNombre:value.ejercicioNombre});

  }

  guardar(){
    let item:EjercicioTratamiento = {
      ejercicioTratamientoId:this.data.ejercicioTratamientoId,
      tratamientoDiaId:this.data.tratamientoDiaId,
      ejercicioTratamientoRepeticiones:Number(this.form.value.repeticiones),
      ejercicioTratamientoSerie:Number(this.form.value.series),
      ejercicioDescanso:this.form.value.descanso,
      ejercicioObservacion: this.form.value.observacion??'',
      ejercicioEstado:false,
      ejercicioNombre:this.form.value.ejercicioNombre,
      ejercicioId:this.form.value.ejercicioId,
    }
    if(this.data.ejercicioTratamientoId==0){
      this._httpTratamientoService.postCrearEjercicioTratamiento(item).subscribe(resp=>{
        item.ejercicioTratamientoId=resp.ejercicioTratamientoId;
        item.ejercicio={ejercicioId:this.form.value.ejercicioId,ejercicioNombre:this.form.value.ejercicioNombre,ejercicioDescripcion:'',ejercicioGrafico:''}
        this.form.reset();
        const dialogRef = this.dialog.open(DialogGeneral, {
          width: '400px',
          data: {
            mensaje:'Ejercicio de Tratamiento agregado exitosamente'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.dialogRef1.close(item);
        });
      })
    }else{
      this._httpTratamientoService.putEjercicioTratamiento(item,Number(this.data.ejercicioTratamientoId)).subscribe(resp=>{
        const dialogRef = this.dialog.open(DialogGeneral, {
          width: '400px',
          data: {
            mensaje:'Ejercicio de Tratamiento editado Correctamente'
          }
        });
      })
    }
  }
}

@Component({
  selector: 'dialog-evolucion',
  templateUrl: 'dialog-evolucion.html',
  styleUrls: ['dialog-evolucion.css']
})
export class DialogEvolucion {

  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<DialogEvolucion>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {
  }
  onSubmit(data: any) {
  }
  uploadFile() {
    console.log(this.fileInput.nativeElement);
    let formData = new FormData();
    formData.append('imagen', this.fileInput.nativeElement.files[0]);

    this.fileInput.nativeElement.value = '';
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'dialog-descarga-fisioterapeutico',
  templateUrl: './dialog-descarga-fisioterapeutico.html'
})
export class DialogDescargaFisioterapeutico {

  
  datosHistoria:HistoriaClinicaConsulta={};
  listaConsultas: Consulta[]=[];
  datosTratamientos:FaseTratamiento[]=[];
  datosEvolucion: Evolucion[]=[];
  datosEjercicios: EjercicioTratamiento[]=[];
  fechaDesde= new Date("January 1, 2021 00:00:00");

  nombrePaciente: string="";
  dias:number=7;
  diaSemana:string[] = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogDescargaFisioterapeutico>,
    @Inject(MAT_DIALOG_DATA) public data: Consulta,
    private formBuilder: FormBuilder,
    private _httpTratamientoService: TratamientoService,
    private _httpConsultaService:ConsultasService,
    private _httpEvolucionesService: EvolucionService,
    private _httpHistoriaService: HistoriaClinicaService) {
      
          _httpHistoriaService.getHistorias().subscribe(resp=>{
            resp.forEach(element=>{
              if(element.historiaId===data.historiaId){
                this.datosHistoria=element;
              }
            })
            console.log(this.datosHistoria);
          })
          _httpTratamientoService.getTratamientosPorConsulta(Number(data.consultaId)).subscribe(respTratamiento=>{
            this.datosTratamientos=respTratamiento;
          });

          _httpEvolucionesService.getEvolucionesPorConsulta(Number(data.consultaId)).subscribe(respEvolucion=>{
            this.datosEvolucion=respEvolucion;
          })
     
      setTimeout(() => {
        this.descargar()
      }, 100);
        
      /*;*/
  }

  descargar(){
    setTimeout(() => {
      const DATA = document.getElementById('divHtmlFisio');
      console.log(DATA?.offsetHeight)
      const doc = new jsPDF('p', 'pt', 'a4');
      const options = {
        background: 'white',
        scale: 3
      };
      html2canvas(DATA!, options).then((canvas) => {

        const imgData = canvas.toDataURL('image/PNG');
        var imgWidth = 200;
        var pageHeight = 290;
        var imgHeight = (canvas.height * imgWidth / canvas.width)+5;
        var heightLeft = imgHeight;
        var doc = new jsPDF('p', 'mm');
        var position = 5;
        doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight,'FAST');
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {

          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight,'FAST');
          heightLeft -= pageHeight;
          position+=5;
        }
        return doc;
      }).then((docResult) => {
        
        if(docResult!= undefined){
          //this.isLoadingResults=false
          let nombre=this.data.pacienteNombre
          docResult.save(`Historia Clínica`+nombre+`.pdf`);
          
          
        }

      }).catch(error=>{
        
      });
      
    }, 500);
  }

  formatoFecha(date:any): string{
    let fecha = date.toString();
    
   return fecha.substring(0,10)
  }

  calcularEdad(date:any): string{
    let fechaNacimiento = new Date(date)
    let fechaActual = new Date();
    let edad = Number(fechaActual.getFullYear())-Number(fechaNacimiento.getFullYear());
    return edad.toString();
  }

}