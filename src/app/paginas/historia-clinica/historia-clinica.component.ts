
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormControlName } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HistoriaClinicaConsulta, Lateralidad, FiltroHistoria } from './historia-clinica';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from '../users/user';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { HistoriaClinicaService } from './historia-clinica.service';
import { DialogGeneral } from '../dialog-general/dialog-general';
import { RolesService } from '../../servicios/roles.service';
import { SedesService } from '../../servicios/sedes.service';
import { Rol } from '../users/rol';
import { Sede } from '../admin-sedes/sede';
import { MatStepper } from '@angular/material/stepper';
import { EjercicioTratamiento, FaseTratamiento } from '../tratamiento/tratamiento';
import { Evolucion, Consulta } from '../consultas/consulta';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { TratamientoService } from '../../servicios/tratamiento.service';
import { ConsultasService } from '../../servicios/consulta.service';
import { FiltroConsulta } from '../consultas/buscar-consulta/buscar-consulta';
import { EvolucionService } from '../../servicios/evolucion.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent {

  usuarios: Usuario[]=[];
  filteredOptions: Observable<Usuario[]> | undefined;
  datosHistoria:HistoriaClinicaConsulta={};
  datosConsulta:Consulta={}
  datosTratamientos:FaseTratamiento[]=[];
  datosEvolucion: Evolucion[]=[];
  datosEjercicios: EjercicioTratamiento[]=[];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  
  formFiltro:FormGroup;
  displayedColumns: string[] = ['fechaRegistro', 'paciente', 'cedula', 'id'];
  dataSource= new MatTableDataSource<HistoriaClinicaConsulta>();
  constructor(private dialog:MatDialog, private _httpUsuarioService: UsuariosService, 
    private _httpHistoriaService: HistoriaClinicaService, private formBuilder: FormBuilder) {
    this._httpUsuarioService.getUsuarios().subscribe(resp=>{this.usuarios=resp});
    this.formFiltro=formBuilder.group({
      pacienteId: new FormControl(0),
      fechaDesde: new FormControl(new Date('2022-01-01')),
      fechaHasta: new FormControl(new Date()),
      cedula: new FormControl('')
    })
    this.cargarTabla();
  }
  fechaDesde(type: string, event: MatDatepickerInputEvent<Date>) {
    this.formFiltro.patchValue({fechaDesde:event.value?.getFullYear()+'-'+(Number(event.value?.getMonth())+1)+'-'+event.value?.getDate()});
  }

  fechaHasta(type: string, event: MatDatepickerInputEvent<Date>) {
    this.formFiltro.patchValue({fechaHasta:event.value?.getFullYear()+'-'+(Number(event.value?.getMonth())+1)+'-'+event.value?.getDate()});
  }

  verHistoria(datos: HistoriaClinicaConsulta) {
    const dialogRef = this.dialog.open(DialogHistoriaClinica, {
      width: '700px',
      height: '650px',
      data: {id:datos.historiaId,datos:datos}
    });
    dialogRef.afterClosed().subscribe(result => {
     this.cargarTabla();
    }); 
  }
  cargarTabla(){
    let filtro:FiltroHistoria={
      fechaDesde: this.formFiltro.value.fechaDesde,
      fechaHasta: this.formFiltro.value.fechaHasta,
      pacienteId: this.formFiltro.value.pacienteId,
      cedula: this.formFiltro.value.cedula
    }
    this._httpHistoriaService.postHistoriasFiltros(filtro).subscribe(resp => {
      this.dataSource= new MatTableDataSource<HistoriaClinicaConsulta>();
      this.dataSource.data=resp
    })
  }
  nuevaHistoria(){
    
    const dialogRef = this.dialog.open(DialogHistoriaClinica, {
      width: '700px',
      height: '650px',
      data: {id:0,datos:{}}
    });
    dialogRef.afterClosed().subscribe(result => {
     
    }); 
  }

  descargarDocumento(element: HistoriaClinicaConsulta){
    const dialogRef = this.dialog.open(DialogDescargaHistoria,{
      width: '1400px',
      height:'1000px',
      data: element
    })
  }
}


@Component({
  selector: 'dialog-historia-clinica',
  templateUrl: 'dialog-historia-clinica.html',
  styleUrls: ['dialog-historia-clinica.css']
})
export class DialogHistoriaClinica {
  myControl = new FormControl<string | Usuario>('');;
  usuarios: Usuario[]=[];
  listaRoles: Rol[] = [];
  listaSedes: Sede[] = [];
  listaLateralidad: Lateralidad[] = [];
  filteredOptions: Observable<Usuario[]>
  usuarioForm: FormGroup;
  historiaForm: FormGroup;
  sedeUsuario = new FormControl(0);
  rolUsuario = new FormControl(0);
  lateralidadUsuario = new FormControl(0);

  constructor(
    private dialog:MatDialog,
    public dialogRef: MatDialogRef<DialogHistoriaClinica>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _httpHistoriaService:HistoriaClinicaService,
    private _httpUsuarioService: UsuariosService,
    private _httpRolService: RolesService, private _httpSedeService: SedesService
    ) {
      
    _httpRolService.getRoles().subscribe(resp=>{
      this.listaRoles=resp;
    });
    _httpSedeService.getSedes().subscribe(resp => {
      this.listaSedes=resp;
    });
    _httpHistoriaService.getLateralidades().subscribe(resp=> {
      this.listaLateralidad=resp;
    })
      this.usuarioForm=formBuilder.group({
        id: new FormControl(0),
        nombre : new FormControl(''),
        cedula : new FormControl(''),
        fechaNacimiento : new FormControl(new Date()),
        telefono : new FormControl(''),
        ocupacion : new FormControl(''),
        domicilio : new FormControl(''),
        profesion : new FormControl(''),
        email: new FormControl(''),
        rolId : this.rolUsuario,
        sedeId : this.sedeUsuario,
        lateralidadId: this.lateralidadUsuario,
      })
      this.historiaForm=this.formBuilder.group({
        historiaFuente: new FormControl(''),
        historiaAntecedentes: new FormControl(''),
        historiaPatologicos: new FormControl(''),
        historiaHabitos: new FormControl(''),
        historiaVivienda: new FormControl(''),
        historiaAlergias: new FormControl(''),
        historiaActFisica: new FormControl(''),
        historiaFecha: new FormControl(new Date)
      });
      this._httpUsuarioService.getUsuarios().subscribe(resp=>{this.usuarios=resp});
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.usuarioNombre;
          return name ? this._filter(name as string) : this.usuarios.slice();
        }),
      ); 
      if(data.id!==0){
        _httpUsuarioService.getUsuarioId(data.datos.pacienteId).subscribe(resp => {
          this.completarDatosUsuario(resp);
        })
        this.completarDatosHistoria(data.datos);
      }
  }

  
  displayFn(user: Usuario): string {
    return user && user.usuarioNombre ? user.usuarioNombre : '';
  }

  private _filter(name: string): Usuario[] {
    const filterValue = name.toLowerCase();

    return this.usuarios.filter(option => option.usuarioNombre.toLowerCase().includes(filterValue));
  }

  onSubmit(data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  completarDatosUsuario(datos:Usuario){
    this.myControl.setValue(datos.usuarioNombre);
    this.myControl.patchValue(datos.usuarioNombre)
    this.usuarioForm.patchValue({
      id:datos.usuarioId,
      nombre:datos.usuarioNombre,
      cedula:datos.usuarioIdentificacion,
      fechaNacimiento:datos.usuarioFechaNacimiento,
      telefono:datos.usuarioTelefono,
      ocupacion:datos.usuarioOcupacion,
      domicilio:datos.usuarioDireccion,
      profesion:datos.usuarioProfesion,
      email:datos.usuarioCorreo,
      rolId:datos.rolId,
      sedeId:datos.sedeId,
      lateralidadId: datos.lateralidadId
    })
  }
  guardarDatosUsuario(stepper: MatStepper){
    let datos:Usuario={
      usuarioId:this.usuarioForm.value.id,
      usuarioNombre:this.usuarioForm.value.nombre,
      usuarioIdentificacion:this.usuarioForm.value.cedula,
      usuarioFechaNacimiento:this.usuarioForm.value.fechaNacimiento,
      usuarioTelefono:this.usuarioForm.value.telefono,
      usuarioOcupacion:this.usuarioForm.value.ocupacion,
      usuarioDireccion:this.usuarioForm.value.domicilio,
      usuarioProfesion:this.usuarioForm.value.profesion,
      usuarioCorreo:this.usuarioForm.value.email,
      rolId:this.usuarioForm.value.rolId,
      sedeId:this.usuarioForm.value.sedeId,
      lateralidadId:this.usuarioForm.value.lateralidadId,
      usuarioEstado:true,
      fecha:'',
    }
    this._httpUsuarioService.putUsuario(datos,this.usuarioForm.value.id).subscribe(resp=>{
      stepper.next();
    })
  }

  completarDatosHistoria(datos: HistoriaClinicaConsulta){
    this.historiaForm.patchValue({
      historiaFuente: datos.historiaFuente,
      historiaAntecedentes: datos.historiaAntecedentes,
      historiaPatologicos: datos.historiaPatologicos,
      historiaHabitos: datos.historiaHabitos,
      historiaVivienda: datos.historiaVivienda,
      historiaAlergias: datos.historiaAlergias,
      historiaActFisica: datos.historiaActFisica,
      historiaFecha: datos.historiaFecha,
    })
  }
  guardarHistoria(){
    let datos: HistoriaClinicaConsulta={
      historiaId:this.data.id,
      pacienteId:this.usuarioForm.value.id,
      especialistaId:Number(localStorage.getItem("userId")),
      historiaFuente: this.historiaForm.value.historiaFuente,
      historiaAntecedentes: this.historiaForm.value.historiaAntecedentes,
      historiaPatologicos: this.historiaForm.value.historiaPatologicos,
      historiaHabitos: this.historiaForm.value.historiaHabitos,
      historiaVivienda: this.historiaForm.value.historiaVivienda,
      historiaAlergias: this.historiaForm.value.historiaAlergias,
      historiaActFisica: this.historiaForm.value.historiaActFisica,
      historiaFecha:this.historiaForm.value.historiaFecha
    }
    console.log(datos)
    if(this.data.id===0){
      this._httpHistoriaService.postCrearHistoria(datos).subscribe(resp=>{
        const dialogRef = this.dialog.open(DialogGeneral, {
          width: '400px',
          data: {
            mensaje:'Historia Clínica creada exitosamente'
          }
        });
      })
    }else{
      this._httpHistoriaService.putHistoria(datos,this.data.id).subscribe(resp => {
        const dialogRef = this.dialog.open(DialogGeneral, {
          width: '400px',
          data: {
            mensaje:'Historia Clínica editada exitosamente'
          }
        });
      });
    }

  }

  
}


@Component({
  selector: 'dialog-descarga-historia',
  templateUrl: './dialog-descarga-historia.html'
})
export class DialogDescargaHistoria {

  
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
    public dialogRef: MatDialogRef<DialogDescargaHistoria>,
    @Inject(MAT_DIALOG_DATA) public data: HistoriaClinicaConsulta,
    private formBuilder: FormBuilder,
    private _httpTratamientoService: TratamientoService,
    private _httpConsultaService:ConsultasService,
    private _httpEvolucionesService: EvolucionService) {
      
      let filtros:FiltroConsulta={
        fechaDesde: this.fechaDesde, 
        fechaHasta: new Date(),
        pacienteId: Number(data.pacienteId)
      }
      _httpConsultaService.postConsultaPorFiltros(filtros).subscribe(resp=> {
        this.listaConsultas=resp;
        resp.forEach((consulta,i) =>{
          _httpTratamientoService.getTratamientosPorConsulta(Number(consulta.consultaId)).subscribe(respTratamiento=>{
            this.listaConsultas[i].tratamientos=respTratamiento;
          });

          _httpEvolucionesService.getEvolucionesPorConsulta(Number(consulta.consultaId)).subscribe(respEvolucion=>{
            this.listaConsultas[i].evolucions=respEvolucion;
          })
        })
      })
      setTimeout(() => {
        this.descargar()
      }, 100);
        
      /*;*/
  }

  descargar(){
    setTimeout(() => {
      const DATA = document.getElementById('divHtml');
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
          let nombre=this.data.usuarioNombre
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
