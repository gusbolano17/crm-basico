import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../modelos/cliente';
import { FiltrosClientesDTO } from '../modelos/filtros-clientes-dto';
import { RespFiltros } from '../modelos/resp-filtros';
import { Environment } from '../core/environment';

export interface ClienteReq{
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  documento: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private http = inject(HttpClient);

  listarClientes() : Observable<Cliente[]>{
    return this.http.get<Cliente[]>(`${Environment.API_URL}/clientes/listar`);
  }

  filtrarClientes(filtros: FiltrosClientesDTO) : Observable<RespFiltros<Cliente>> {

    let params = new HttpParams();

    Object.keys(filtros).forEach((key) => {
      const typedKey = key as keyof FiltrosClientesDTO;
      if (filtros[typedKey] !== null && filtros[typedKey] !== '' && filtros[typedKey] !== undefined) {
        params = params.set(key, String(filtros[typedKey]));
      }
    });

    return this.http.get<RespFiltros<Cliente>>(`${Environment.API_URL}/clientes/filtrar`, { params });
  }

  crearCliente(cliente : ClienteReq) : Observable<Cliente>{
    return this.http.post<Cliente>(`${Environment.API_URL}/clientes/registrar`, cliente);
  }

  actualizarCliente(id: string, cliente: ClienteReq): Observable<Cliente> {
    return this.http.put<Cliente>(`${Environment.API_URL}/clientes/actualizar/${id}`, cliente);
  }

  eliminarCliente(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${Environment.API_URL}/clientes/eliminar/${id}`);
  }
}
