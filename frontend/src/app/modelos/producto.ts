import { Categoria } from "./categoria";

export class Productos{
    id: string = '';
    nombre: string = '';
    descripcion: string = '';
    precio: number = 0;
    stock: number = 0;
    categoria: Categoria = new Categoria();
}