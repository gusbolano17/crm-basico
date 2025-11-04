import { IsArray, IsNotEmpty } from 'class-validator';

export class VentasDTO {

  @IsNotEmpty()
  clienteId: string;
  @IsArray()
  @IsNotEmpty()
  productos: string[];
}