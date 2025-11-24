import { Body, Controller, Get, Put } from '@nestjs/common';
import { PerfilUsuarioService } from './perfil-usuario.service';
import { User } from '../../../core/user-decorator';
import { PerfilUsuarioDto } from '../../../entities/dto/perfil-usuario-dto';

@Controller('perfil-usuario')
export class PerfilUsuarioController {
  constructor(private readonly perfilUsuarioService: PerfilUsuarioService) {}

  @Get("obtener-perfil")
  async obtenerPerfilUsuario(@User('sub') usuarioId : string){
    return this.perfilUsuarioService.obtenerPerfil(usuarioId);
  }

  @Put("actualizar-perfil")
  async editarPerfilUsuario(@User('sub') usuarioId : string, @Body() body : PerfilUsuarioDto){
    return this.perfilUsuarioService.editarPerfil(usuarioId, body);
  }
}
