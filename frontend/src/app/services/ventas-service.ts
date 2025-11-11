import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environment } from '../core/environment';
import { Venta } from '../modelos/venta';

export interface VentaDTO {
  documento?: string;
  productos?: {nombre : string, cantidad : string}[];
}

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private readonly http = inject(HttpClient);

  realizarVenta(ventaDto: VentaDTO) {
    return this.http.post<Venta>(`${Environment.API_URL}/ventas/registrar`, ventaDto);
  }
}
