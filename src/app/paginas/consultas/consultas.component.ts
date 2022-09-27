import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fromEvent, map, Observable, pairwise, startWith, Subscription, switchMap, takeUntil } from 'rxjs';
import { Usuario } from '../users/user';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Consulta, FotoConsulta } from './consulta';
import { ConsultasService } from 'src/app/servicios/consulta.service';
import { FaseTratamiento, TratamientoDia } from '../tratamiento/tratamiento';
import { TratamientoService } from 'src/app/servicios/tratamiento.service';
import { Ejercicio } from '../admin-ejercicios/ejercicio';
import { EjercicioTratamiento } from '../tratamiento/tratamiento';
import { EjerciciosService } from 'src/app/servicios/ejercicios.service';

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
    this.historiaId = item.historiaId??0;
  }
  guardarEsquema() {
    this.imagenEsquema = this.canvas.nativeElement.toDataURL();
    console.log(this.imagenEsquema);
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
    }
    this._httpConsulta.postCrearConsulta(itemConsulta).subscribe(c=>{
      this.consultaId = c;
      this.listaArchivos.forEach(cx=>{
        let item:FotoConsulta ={
          fotoExaminacionImagen:cx,
          fotoExaminacionDescripcion:"",
          consultaId:this.consultaId,
          fotoExaminacionId:0
        }
        this._httpConsulta.postImagen(item).subscribe(h=>{
          console.log(item);
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
    const dialogRef = this.dialog.open(DialogTratamiento, {
      width: '1400px',
      height: '600px',
      data: {
        id:this.consultaId,
        numero:this.listaArchivos.length
      }
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
        console.log(e);
    });

  }

}
@Component({
  selector: 'dialog-tratamiento',
  templateUrl: 'dialog-tratamiento.html',
  styleUrls: ['dialog-tratamiento.css']
})
export class DialogTratamiento {
  mensaje: string = '';

  dias = new FormControl('');
  fechaInicio = new FormControl(new Date(Date.now()));
  descripcion = new FormControl('');
  detalles = new FormControl('');
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
    public dialogRef: MatDialogRef<DialogTratamiento>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _httpTratamiento:TratamientoService) {
      this.fechaInicio.valueChanges.subscribe(c=>{
        this.listaDias=[]
        for(let i=0;i<Number(this.dias.value);i++){
          let add:number =i*(24*60*60*1000);
          let fech:number = c?.getTime()??0;
          let itemDia:TratamientoDia={
            tratamientoDiaFecha: new Date(add + fech ),
            tratamientoDiaId:0,
            tratamientoId:0,
            ejercicios:[],
            fecha:''
          }
          console.log(c?.getDate());
          console.log(i*(24*60*60*1000));
          itemDia.fecha = this.diaSemana[itemDia.tratamientoDiaFecha.getDay()]+' '+itemDia.tratamientoDiaFecha.getDate() +'-'+(itemDia.tratamientoDiaFecha.getMonth()+1)
          this.listaDias.push(itemDia);
        }
      });
  }
  onSubmit(data: any) {
  }
  guardar(){
    let itemFase:FaseTratamiento ={
      consultaId:this.data.id,
      tratamientoCompleto:false,
      tratamientoDescripcion:this.descripcion.value??'',
      tratamientoDias:Number(this.dias.value),
      tratamientoFase:this.data.numero+1,
      tratamientoFechaCreacion: new Date(Date.now()),
      tratamientoFechaInicio: this.fechaInicio.value??new Date(Date.now()),
      tratamientoRecomendacion: this.recomendacion.value??"",
      tratamientoObservacion:'',
      tratamientoId:0
    }
    this._httpTratamiento.postCrearTratamiento(itemFase).subscribe(t=>{
      this.listaDias.forEach(d=>{
        d.tratamientoId = t.id;
        this._httpTratamiento.postCrearTratamientoDia(d).subscribe(h=>{
          
          d.ejercicios.forEach(k=>{
            k.tratamientoDiaId = h.id
            this._httpTratamiento.postCrearEjercicioTratamiento(k).subscribe(
              e=>{
                
              }
            )
          });
        })
      });
    });
  }

  agregar(id:number) {
    const dialogRef = this.dialog.open(DialogEjercicio, {
      width: '450px',
      height: '550px',
      data: {
        diaId:id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.listaDias[this.listaDias.findIndex(c=>c.tratamientoDiaId == id)].ejercicios.push(result);
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
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
  constructor(
    public dialogRef: MatDialogRef<DialogEjercicio>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _httpEjercicio:EjerciciosService) {
      _httpEjercicio.getEjercicios().subscribe(c=>{
        this.listaEjercicios = c;
      });
  }
  onSubmit(data: any) {
  }
  guardar(){
    let item:EjercicioTratamiento = {
      ejercicioTratamientoRepeticiones:Number(this.repeticiones.value),
      ejercicioDescanso:this.descanso.value??'',
      tratamientoDiaId:this.data.diaId,
      ejercicioObservacion: this.observacion.value??'',
      ejercicioTratamientoSerie:Number(this.series.value),
      ejercicioEstado:false,
      ejercicioNombre:'',
      ejercicioId:0,
      ejercicioTratamientoId:0
    }
    this.dialogRef.close(item);
  }

  onNoClick(): void {
    this.dialogRef.close();
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
