import { Cliente } from "./cliente";
import { Productos } from "./producto";

export class Venta{
    id : string = '';
    total : number = 0;
    cliente : Cliente = new Cliente();
    detalles : DetalleVenta[] = [];
    estado : 'ACTIVA' | 'CANCELADA' | 'FINALIZADA' = 'ACTIVA';
}

export class DetalleVenta{
    id : string = '';
    subtotal : number = 0;
    producto : Productos = new Productos();
    venta : Venta = new Venta();
}