import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class EditarUsuarioDTO {
  @IsString() @IsOptional() nombre?: string;
  @IsEmail() @IsOptional() email?: string;
  @IsOptional() @IsBoolean() activo?: boolean;
  @IsOptional() @IsString() role?: string;
}
