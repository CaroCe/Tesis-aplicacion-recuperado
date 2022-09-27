
export interface Usuario {
    usuarioId:              number;
    lateralidadId:          number;
    rolId:                  number;
    sedeId:                 number;
    usuarioNombre:          string;
    usuarioIdentificacion:  string;
    usuarioFechaNacimiento: Date;
    usuarioDireccion:       string;
    usuarioTelefono:        string;
    usuarioCorreo:          string;
    usuarioOcupacion:       string;
    usuarioProfesion:       string;
    historiaId?:             number;
    usuarioEstado:           boolean;
    fecha:                   string;
}
export interface FiltroUsuarios {
    nombre: string;
    cedula: string;
    sede:   number;
    rol:    number;
}
