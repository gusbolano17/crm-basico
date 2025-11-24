import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UsuarioEntity } from '../modelos/usuario-entity';
import { Environment } from '../core/environment';
import { RespFiltros } from '../modelos/resp-filtros';
import { FiltroUsuarioDto } from '../modelos/filtros-usuarios-dto';

export interface UsuarioReq {
  email: string;
  nombre: string;
  password?: string;
  role?: string;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly http = inject(HttpClient);

  listarUsuarios(filtros: FiltroUsuarioDto) {
    let params = new HttpParams();

    Object.keys(filtros).forEach((key) => {
      const typedKey = key as keyof FiltroUsuarioDto;
      if (
        filtros[typedKey] !== null &&
        filtros[typedKey] !== '' &&
        filtros[typedKey] !== undefined
      ) {
        params = params.set(key, String(filtros[typedKey]));
      }
    });

    return this.http.get<RespFiltros<UsuarioEntity>>(
      `${Environment.API_URL}/usuario/listarusuarios`,
      { params }
    );
  }

  registrarUsuario(usuarioDTO: UsuarioReq) {
    return this.http.post<UsuarioEntity>(`${Environment.API_URL}/usuario/registrar`, usuarioDTO);
  }

  editarUsuario(id: string, usuarioDTO: any) {
    return this.http.put<UsuarioEntity>(
      `${Environment.API_URL}/usuario/actualizarUsuario/${id}`,
      usuarioDTO
    );
  }

  cambiarPassword(id: string, password: string) {
    return this.http.put<UsuarioEntity>(`${Environment.API_URL}/usuario/cambiarpassword`, {
      usuarioId: id,
      password,
    });
  }
}
