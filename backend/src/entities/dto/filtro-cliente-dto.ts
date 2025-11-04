import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

abstract class FiltroGeneral {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() sort?: string;
  @IsOptional() @IsString() dir?: 'asc' | 'desc';
  @IsOptional() @IsNumberString() page?: string;
  @IsOptional() @IsNumberString() limit?: string;
  @IsOptional() @IsDateString() desde?: string;
  @IsOptional() @IsDateString() hasta?: string;
}

export class FiltroClienteDto extends FiltroGeneral{
  @IsOptional() @IsString() tipoDocumento?: string;
  @IsOptional() @IsString() documento?: string;
}

export class FiltroProductoDto extends FiltroGeneral{
  @IsOptional() @IsString() categoria?: string;
  @IsOptional() @IsString() precio?: number;
  @IsOptional() @IsString() stock?: number;
}