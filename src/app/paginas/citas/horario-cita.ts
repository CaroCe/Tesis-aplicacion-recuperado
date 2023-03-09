
export interface HorarioDisponibleCita {
    horarioDiaId:     number;
    horarioDiaNombre: string;
    horarioDiaFecha:  Date;
    horarioCitas:     HorarioCita[];
}

export interface HorarioCita {
    id:          number;
    horaCita:    string;
    disponibles: number;
}
export interface FiltroCitas {
    sedeId:         number;
    especialistaId: number;
    fechaDesde:     Date;
    fechaHasta:     Date;
}
export interface CitaPost {
    diaId?:     number;
    citaId:     number;
    usuarioId:  number;
    especialistaId: number;
    citaFecha:  Date;
    citaHora:   string;
    citaEstado: number;
    citaObservacion: string
}
