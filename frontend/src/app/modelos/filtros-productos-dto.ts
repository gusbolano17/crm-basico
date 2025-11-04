import { FiltroGeneralDto } from "./filtro-general-dto";

export interface FiltrosProductoDTO extends FiltroGeneralDto{
  categoria? : string;
  precio? : string;
  stock? : string;
}
