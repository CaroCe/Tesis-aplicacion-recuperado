export interface HistoriaClinicaConsulta {
    historiaId?:                    number;
    pacienteId?:                     number;
    especialistaId?:                 number;
    historiaFuente?:                string;
    historiaAntecedentes?:          string;
    historiaPatologicos?:           string;
    historiaHabitos?:               string;
    historiaVivienda?:              string;
    historiaAlergias?:              string;
    historiaActFisica?:             string;
    historiaFecha?:                  Date;
    usuarioId?:                     number;
    lateralidadId?:                 number;
    rolId?:                         number;
    sedeId?:                        number;
    usuarioNombre?:                 string;
    usuarioIdentificacion?:         string;
    usuarioFechaNacimiento?:        Date;
    usuarioDireccion?:              string;
    usuarioTelefono?:               string;
    usuarioCorreo?:                 string;
    usuarioOcupacion?:              string;
    usuarioProfesion?:              string;
    usuarioEstado?:                 boolean;
    lateralidadNombre?:             string;
}

export interface Lateralidad{
    lateralidadId: number;
    lateralidadNombre: string;
}

export interface FiltroHistoria{
    fechaDesde: Date;
    fechaHasta: Date;
    pacienteId: number;
    cedula: string
  }