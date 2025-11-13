import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environment } from '../core/environment';
import { Venta } from '../modelos/venta';
import { FiltrosVentasDTO } from '../modelos/filtros-ventas-dto';
import { Observable } from 'rxjs';
import { RespFiltros } from '../modelos/resp-filtros';

export interface VentaDTO {
  documento?: string;
  productos?: { nombre: string; cantidad: string }[];
}

export interface PagoDTO {
  monto?: number;
  formaPago? : string;
  ventaId : string;
}

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private readonly http = inject(HttpClient);

  realizarVenta(ventaDto: VentaDTO) {
    return this.http.post<Venta>(`${Environment.API_URL}/ventas/registrar`, ventaDto);
  }

  listarVentas(filtros: FiltrosVentasDTO): Observable<RespFiltros<Venta>> {
    let params = new HttpParams();

    Object.keys(filtros).forEach((key) => {
      const typedKey = key as keyof FiltrosVentasDTO;
      if (
        filtros[typedKey] !== null &&
        filtros[typedKey] !== '' &&
        filtros[typedKey] !== undefined
      ) {
        params = params.set(key, String(filtros[typedKey]));
      }
    });

    return this.http.get<RespFiltros<Venta>>(`${Environment.API_URL}/ventas/listar`, {
      params,
    });
  }

  anularVenta(ventaId: string) {
    return this.http.put<Venta>(`${Environment.API_URL}/ventas/anularVenta/${ventaId}`, {});
  }

  realizarPago(pagoDto: PagoDTO) {
    return this.http.post<Venta>(`${Environment.API_URL}/pagos/pagar`, pagoDto);
  }
}
