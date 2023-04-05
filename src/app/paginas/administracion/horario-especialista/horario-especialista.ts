export interface HorarioEspecialista {
    horarioEspecialistaId:      number;
    especialistaId:             number;
    horarioId:             number;
    horarioEspecialistaEstado:  boolean;
    horarioTrabajoId:           number;
}

export interface HorarioDia {
    horarioId:              number;
    horarioNombre:          string;
    horarioEspecialistaId:  number;
    horarioTrabajos?:        HorarioTrabajo[];
}

export interface HorarioTrabajo {
    horarioTrabajoId:      number;
    horarioTrabajoDesde:    string;
    horarioTrabajoHasta:    string;
}

export interface HorarioPorEspecialista {
    horarioDiaId:     number;
    horarioDiaNombre: string;
    horarioTrabajo:   HorarioTrabajoPorEspecialista[];
}

export interface HorarioTrabajoPorEspecialista {
    id:        number;
    horaDesde: string;
    horaHasta: string;
}
