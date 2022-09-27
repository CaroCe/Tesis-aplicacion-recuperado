export interface FaseTratamiento {
    tratamientoId:            number;
    consultaId:               number;
    tratamientoFechaCreacion: Date;
    tratamientoDias:          number;
    tratamientoFechaInicio:   Date;
    tratamientoObservacion:   string;
    tratamientoDescripcion:   string;
    tratamientoRecomendacion: string;
    tratamientoFase:          string;
    tratamientoCompleto:      boolean;
}
export interface TratamientoDia {
    tratamientoDiaId:    number;
    tratamientoId:       number;
    tratamientoDiaFecha: Date;
    fecha:               string;
    ejercicios:         EjercicioTratamiento[];
}
export interface EjercicioTratamiento {
    ejercicioTratamientoId:           number;
    tratamientoDiaId:                 number;
    ejercicioId:                      number;
    ejercicioTratamientoRepeticiones: number;
    ejercicioTratamientoSerie:        number;
    ejercicioNombre:                  string;
    ejercicioEstado:                  boolean;
    ejercicioDescanso:                string;
    ejercicioObservacion:             string;
}
