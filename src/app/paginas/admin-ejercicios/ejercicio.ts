export interface Ejercicio{
  ejercicioId?:              number;
  ejercicioNombre:          string;
  ejercicioGrafico:         string;
  ejercicioDescripcion:     string;
  ejercicioEstado?:          boolean;
  ejercicioTratamientos?:    EjercicioTratamiento[];
}
export interface EjercicioTratamiento {
    ejercicioTratamientoId:             number;
    tratamientoDiaId:                   number;
    ejercicioId:                        number;
    ejercicioTratamientoRepeticiones:   number;
    ejercicioTratamientoSerie:          number;
    ejercicioEstado:                    number;
    ejercicioDescanso:                  number;
    ejercicioObservacion:               string;
    ejercicio:                          string;
    tratamientoDia:                     number;
   
}

