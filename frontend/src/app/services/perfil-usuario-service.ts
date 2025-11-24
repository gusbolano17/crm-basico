import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environment } from '../core/environment';
import { Observable } from 'rxjs';
import { PerfilUsuarioEntity } from '../modelos/perfil-usuario';

export interface PerfilUsuarioReq {
  biografia?: string;
  avatarUrl?: string;
  telefono?: string;
  direccion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PerfilUsuarioService {
  private readonly http = inject(HttpClient);

  obtenerPerfilUsuario() : Observable<PerfilUsuarioEntity> {
    return this.http.get<PerfilUsuarioEntity>(`${Environment.API_URL}/perfil-usuario/obtener-perfil`);
  }

  actualizarPerfilUsuario(body: any) {
    return this.http.put(`${Environment.API_URL}/perfil-usuario/actualizar-perfil/`, body);
  }
}
