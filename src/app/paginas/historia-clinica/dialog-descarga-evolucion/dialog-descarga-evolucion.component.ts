import { Component, OnInit, Inject } from '@angular/core';
import { Usuario } from '../../administracion/users/user';
import { HistoriaClinicaConsulta } from '../historia-clinica';
import { EvolucionService } from '../../../servicios/evolucion.service';
import { HistoriaClinicaService } from '../historia-clinica.service';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Consulta, Evolucion, FotosEvolucion } from '../consultas/consulta';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dialog-descarga-evolucion',
  templateUrl: './dialog-descarga-evolucion.html',
  styleUrls: ['./dialog-descarga-evolucion.component.css']
})
export class DialogDescargaEvolucionComponent implements OnInit {

  isLoadingResults:boolean=false;
  datosHistoria: HistoriaClinicaConsulta = {};
  datosUsuario: Usuario={
    usuarioId:0,lateralidadId:0,rolId:0,sedeId:0,usuarioNombre:'',usuarioIdentificacion:'',usuarioFechaNacimiento:new Date(),usuarioDireccion:'',usuarioTelefono:'',usuarioCorreo:'',usuarioOcupacion:'',usuarioProfesion:'',usuarioEstado:true,fecha:'',
  };
  datosEvolucion: Evolucion[] = [];
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogDescargaEvolucionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Consulta,
    private _httpEvolucionesService: EvolucionService,
    private _httpHistoriaService: HistoriaClinicaService,
    private _httpUsuarioService: UsuariosService
    ) { 
      _httpUsuarioService.getUsuarioId(Number(data.pacienteId)).subscribe(resp=>{
        this.datosUsuario=resp;
      });
      _httpEvolucionesService.getEvolucionesPorConsulta(Number(data.consultaId)).subscribe(respEvolucion => {
        this.datosEvolucion = respEvolucion;
        respEvolucion.forEach(element=>{
          _httpEvolucionesService.getFotosPorEvolucion(Number(element.evolucionId)).subscribe(fotos=>{
            let indice= this.datosEvolucion.findIndex(evolucion=>evolucion.evolucionId==element.evolucionId);
            this.datosEvolucion[indice].fotosEvolucions=fotos;      
            console.log(this.datosEvolucion)      
          })
        });
      });
    }

  ngOnInit(): void {
  }

  formatoFecha(date: any): string {
    let fecha=new Date(date).toISOString();
    return fecha.substring(0, 10)
  }

  calcularEdad(date: any): string {
    let fecha=new Date(date).toISOString();
    let anioNacimiento = fecha.substring(0,4);
    let fechaActual = new Date();
    let edad = Number(fechaActual.getFullYear()) - Number(anioNacimiento);
    return edad.toString();
  }

  descargar() {
    this.isLoadingResults=true;
      const DATA = document.getElementById('divHtml');
      const doc = new jsPDF('p', 'pt', 'a4');
      const options = {
        background: 'white',
        scale: 3
      };
      html2canvas(DATA!, options).then((canvas) => {

        const imgData = canvas.toDataURL('image/PNG');
        var imgWidth = 200;
        var pageHeight = 290;
        var imgHeight = (canvas.height * imgWidth / canvas.width) + 5;
        var heightLeft = imgHeight;
        var doc = new jsPDF('p', 'mm');
        var position = 5;
        doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight, 'FAST');
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {

          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight, 'FAST');
          heightLeft -= pageHeight;
          position += 5;
        }
        return doc;
      }).then((docResult) => {

        if (docResult != undefined) {
          let nombre = this.data.pacienteNombre
          docResult.save(`Historia Clínica` + nombre + `.pdf`);
          this.isLoadingResults=false;
        }
      }).catch(error => {
        this.isLoadingResults=false;
      });

  }
}
