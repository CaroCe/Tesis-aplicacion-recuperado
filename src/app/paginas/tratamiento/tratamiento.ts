import { Ejercicio } from '../administracion/admin-ejercicios/ejercicio';
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
    tratamientosDia:          TratamientoDia[],
    tratamientoDia?:          TratamientoDia[]
}
export interface TratamientoDia {
    tratamientoDiaId:    number;
    tratamientoId:       number;
    tratamientoDiaFecha: Date;
    fecha?:               string;
    ejercicioTratamientos?:         EjercicioTratamiento[];
}
export interface EjercicioTratamiento {
    ejercicioTratamientoId:             number;
    tratamientoDiaId:                   number;
    ejercicioId:                        number;
    ejercicioTratamientoRepeticiones:   number;
    ejercicioTratamientoSerie:          number;
    ejercicioNombre:                    string;
    ejercicioEstado:                    boolean;
    ejercicioDescanso:                  string;
    ejercicioObservacion:               string;
    ejercicio?:                         Ejercicio;
}
