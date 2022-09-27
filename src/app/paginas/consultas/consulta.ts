import { FaseTratamiento } from '../tratamiento/tratamiento';
export interface Consulta {
    consultaId?:             number;
    especialistaId:         number;
    historiaId:             number;
    consultaFecha:          Date;
    consultaMotivo:         string;
    consultaDescripcion:    string;
    consultaImagen:         string;
    consultaDescripImagen:  string;
    consultaProblema:       string;
    examinacionObservacion: string;
    examinacionInspeccion:  string;
    diagnostico:            string;
    evolucions?:             Evolucion[];
    fotosExaminacions?:      FotoConsulta[];
    tratamientos?:           FaseTratamiento[];
}
export interface FotoConsulta {
    fotoExaminacionId:          number;
    consultaId:                 number;
    fotoExaminacionImagen:      string;
    fotoExaminacionDescripcion: string;
}


export interface Evolucion {
    
    evolucionId:              number;
    consultaId:               number;
    evolucionDescripcion:     string;
    evolucionFecha:           Date;
    fotosEvolucions:          FotosEvolucion[];
  }
  
  export interface FotosEvolucion {
      fotoEvolucionId:            number;
      evolucionId:                number;
      fotoEvolucionImagen:        string;
      fotoEvolucionDescripcion:   string;
  }