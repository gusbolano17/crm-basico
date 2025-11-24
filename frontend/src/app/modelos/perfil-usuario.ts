import { UsuarioEntity } from "./usuario-entity";

export class PerfilUsuarioEntity {
  id: string = '';
  biografia: string = '';
  avatarUrl: string = ''
  telefono: string = '';
  direccion: string = '';
  usuario: UsuarioEntity = new UsuarioEntity();
}