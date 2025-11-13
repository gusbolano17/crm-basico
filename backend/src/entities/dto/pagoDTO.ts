import { IsNotEmpty, IsNumber } from 'class-validator';

export class PagoDTO {
  @IsNotEmpty()
  @IsNumber()
  monto : number;
  @IsNotEmpty()
  formaPago : string;
  @IsNotEmpty()
  ventaId : string;
}