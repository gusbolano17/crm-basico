import { IsOptional, IsString } from 'class-validator';

export class PerfilUsuarioDto {
  @IsOptional()
  @IsString()
  biografia?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}