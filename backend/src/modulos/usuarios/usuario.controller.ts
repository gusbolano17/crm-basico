import { Body, Controller, Post } from '@nestjs/common';
import { UsuarioDTO } from '../../entities/dto/usuarioDTO';
import { UsuarioEntity } from '../../entities/usuario.entity';
import { UsuarioService } from './usuario.service';
import { Public } from '../../core/public-edpoint';

@Controller('usuario')
export class UsuarioController {

  constructor(private usuarioService: UsuarioService) {}

  @Public()
  @Post('registrar')
  async registrarUsuario(@Body() usuarioDTO: UsuarioDTO) : Promise<UsuarioEntity> {
    return await this.usuarioService.registrarUsuario(usuarioDTO);
  }



}
