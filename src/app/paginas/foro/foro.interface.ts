import { FaseTratamiento } from '../tratamiento/tratamiento';
export interface Foro{
    consultaId: number;
    especialistaId: number;
    pacienteId: number;
    foroId: number;
    foroEstado: boolean;
    pacienteNombre: string;
    historiaId: number;
    consultaFecha: string;
    consultaMotivo: string;
    consultaDescripcion: string;
    consultaImagen: string;
    consultaDescripImagen: string;
    consultaProblema: string;
    examinacionObservacion: string;
    examinacionInspeccion: string;
    diagnostico: string;
    fotosExaminacion: [];
    tratamientos: FaseTratamiento[]
}

export interface comentarioForo{    
    comentarioForoId: number;
    comentarioForoMensaje: string;
    usuarioId: number;
    foroId: number;
    usuario?: string;
}

export interface filtroForo{
    fechaDesde:         Date;
    fechaHasta:         Date;
    pacienteId:         number;
    estado:             number;
    problema:           string;
    especialistaId:     number;
}