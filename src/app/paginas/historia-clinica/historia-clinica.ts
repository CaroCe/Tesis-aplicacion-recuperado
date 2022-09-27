export interface HistoriaClinicaConsulta {
    historiaId?:                    number;
    pacienteId:                     number;
    especialistaId:                 number;
    historiaFuente?:                string;
    historiaAntecedentes?:          string;
    historiaPatologicos?:           string;
    historiaHabitos?:               string;
    historiaVivienda?:              string;
    historiaAlergias?:              string;
    historiaActFisica?:             string;
    historiaFecha:                  Date;
}

export interface Lateralidad{
    lateralidadId: number;
    lateralidadNombre: string;
}