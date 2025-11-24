export class UsuarioEntity{
    id: string = '';
    email: string = '';
    nombre: string = '';
    role: string = '';
    activo: boolean = false;
    creado: Date = new Date();
    actualizado: Date = new Date();
}