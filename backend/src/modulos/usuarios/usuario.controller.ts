import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsuarioDTO } from '../../entities/dto/usuarioDTO';
import { UsuarioEntity } from '../../entities/usuario.entity';
import { UsuarioService } from './usuario.service';
import { Public } from '../../core/public-edpoint';
import { EditarUsuarioDTO } from '../../entities/dto/editar-usuarioDTO';
import { FiltroUsuarioDto } from '../../entities/dto/filtro-cliente-dto';

@Controller('usuario')
export class UsuarioController {

  constructor(private usuarioService: UsuarioService) {}

  @Public()
  @Post('registrar')
  async registrarUsuario(@Body() usuarioDTO: UsuarioDTO) : Promise<UsuarioEntity> {
    return await this.usuarioService.registrarUsuario(usuarioDTO);
  }

  @Get("listarusuarios")
  async listarUsuarios(@Query() filtro : FiltroUsuarioDto) {
    return await this.usuarioService.listarUsuarios(filtro);
  }

  @Put("actualizarUsuario/:id")
  async actualizarUsuario(@Param('id') idUsuario: string, @Body() usuarioDTO: EditarUsuarioDTO) : Promise<UsuarioEntity> {
    return await this.usuarioService.actualizarUsuario(idUsuario, usuarioDTO);
  }

  @Put("cambiarpassword")
  async cambiarPassword(@Body('usuarioId') usuarioId : string, @Body('password') newPassword : string){
    return await this.usuarioService.cambiarPassword(usuarioId, newPassword);
  }



}
