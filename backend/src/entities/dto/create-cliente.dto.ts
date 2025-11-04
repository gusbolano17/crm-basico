import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateClienteDto {

  @IsNotEmpty()
  nombre: string;
  @IsNotEmpty()
  apellido: string;
  @IsNotEmpty()
  tipoDocumento: string;
  @IsNotEmpty()
  documento: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  telefono: string;
  @IsNotEmpty()
  direccion: string;
}
