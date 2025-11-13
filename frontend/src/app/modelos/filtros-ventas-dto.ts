import { FiltroGeneralDto } from "./filtro-general-dto";

export interface FiltrosVentasDTO extends FiltroGeneralDto{

    tipoDocumento? : string;
    documento? : string;
    estado? : string;

}