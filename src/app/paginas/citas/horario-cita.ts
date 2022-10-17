export interface HorarioCita {
    fch1: string;
    fch2: string;
    fch3: string;
    fch4: string;
    fch5: string;
}
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
    citaId:     number;
    usuarioId:  number;
    citaFecha:  Date;
    citaHora:   string;
    citaEstado: number;
}
