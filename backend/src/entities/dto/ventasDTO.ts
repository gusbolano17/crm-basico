import { IsArray, IsNotEmpty } from 'class-validator';

export class VentasDTO {
  @IsNotEmpty()
  documento: string;
  @IsArray()
  @IsNotEmpty()
  productos: { nombre: string, cantidad: number }[];
}