
export interface Usuario {
    usuarioId:              number;
    lateralidadId:          number | null;
    rolId:                  number;
    sedeId:                 number;
    usuarioNombre:          string;
    usuarioIdentificacion:  string;
    usuarioFechaNacimiento: Date|undefined;
    usuarioDireccion:       string;
    usuarioTelefono:        string;
    usuarioCorreo:          string;
    usuarioOcupacion:       string;
    usuarioProfesion:       string;
    historiaId?:             number;
    usuarioEstado:           boolean;
    fecha:                   string;
    password?:        string;
}
export interface FiltroUsuarios {
    nombre: string;
    cedula: string;
    sede:   number;
    rol:    number;
}

