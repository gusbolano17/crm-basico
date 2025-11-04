import { FiltroGeneralDto } from "./filtro-general-dto";

export interface FiltrosClientesDTO extends FiltroGeneralDto{
  tipoDocumento?: string;
  documento?: string;
}
