import { FaseTratamiento } from '../../tratamiento/tratamiento';
export interface ConsultaBuscador {
    consultaId:             number;
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
}
