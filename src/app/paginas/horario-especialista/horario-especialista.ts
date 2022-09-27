export interface HorarioEspecialista {
    horarioEspecialistaId?:      number;
    especialistaId:             number;
    horarioEspecialistaEstado:  boolean;
    horarioDia?:                HorarioDia[];
}

export interface HorarioDia {
    horarioId:              number;
    horarioNombre:          string;
    horarioEspecialistaId:  number;
    horarioTrabajos?:        HorarioTrabajo[];
}

export interface HorarioTrabajo {
    horarioTrabajoId:      number;
    horarioId:             number;
    horarioTrabajoDesde:    string;
    horarioTrabajoHasta:    string;
}