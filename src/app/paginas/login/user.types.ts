export interface User
{
    id: string;
    name: string;
    email: string;
}
export interface EntRegistro {
    id:              number;
    nombre?:          string;
    cedula?:          string;
    fechaNacimiento?:    Date;
    telefono?:        string;
    domicilio?:       string;
    email?:           string;
    password?:        string;
    rolId:            number;
}
