import { FiltroGeneralDto } from "./filtro-general-dto";

export class FiltroUsuarioDto extends FiltroGeneralDto{
  role?: string;
  estado?: boolean;
}