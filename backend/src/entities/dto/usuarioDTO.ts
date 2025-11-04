import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UsuarioDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  nombre: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
