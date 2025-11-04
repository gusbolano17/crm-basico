import { IsNotEmpty, IsNumber } from 'class-validator';

export class ProductoDTO {

  @IsNotEmpty()
  nombre: string;
  @IsNotEmpty()
  descripcion: string;
  @IsNumber()
  @IsNotEmpty()
  precio: number;
  @IsNumber()
  @IsNotEmpty()
  stock: number;
  @IsNotEmpty()
  categoria: string;
}