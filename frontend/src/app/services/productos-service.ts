import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Productos } from '../modelos/producto';
import { Environment } from '../core/environment';
import { FiltrosProductoDTO } from '../modelos/filtros-productos-dto';
import { RespFiltros } from '../modelos/resp-filtros';

export interface ProductoReq {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductosServices {
  private readonly http = inject(HttpClient);

  agregarProductos(body: ProductoReq): Observable<Productos> {
    return this.http.post<Productos>(`${Environment.API_URL}/productos/agregar`, body);
  }

  editarProductos(id : string, body: ProductoReq) : Observable<Productos> {
    return this.http.put<Productos>(`${Environment.API_URL}/productos/actualizar/${id}`, body)
  }

  eliminarProducto(id : string):Observable<{ message: string }>{
    return this.http.delete<{ message: string }>(`${Environment.API_URL}/productos/eliminar/${id}`);
  }

  filtrarProductos(filtros: FiltrosProductoDTO): Observable<RespFiltros<Productos>> {
    let params = new HttpParams();

    Object.keys(filtros).forEach((key) => {
      const typedKey = key as keyof FiltrosProductoDTO;
      if (
        filtros[typedKey] !== null &&
        filtros[typedKey] !== '' &&
        filtros[typedKey] !== undefined
      ) {
        params = params.set(key, String(filtros[typedKey]));
      }
    });

    return this.http.get<RespFiltros<Productos>>(`${Environment.API_URL}/productos/filtrar`, {
      params,
    });
  }
}
