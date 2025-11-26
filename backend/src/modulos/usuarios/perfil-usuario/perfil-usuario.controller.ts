import {
  Body,
  Controller,
  Get,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PerfilUsuarioService } from './perfil-usuario.service';
import { User } from '../../../core/user-decorator';
import { PerfilUsuarioDto } from '../../../entities/dto/perfil-usuario-dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('perfil-usuario')
export class PerfilUsuarioController {
  constructor(private readonly perfilUsuarioService: PerfilUsuarioService) {}

  @Get("obtener-perfil")
  async obtenerPerfilUsuario(@User('sub') usuarioId : string){
    return this.perfilUsuarioService.obtenerPerfil(usuarioId);
  }

  @Put("actualizar-perfil")
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits : {fileSize : 10 * 1024 * 1024}
    })
  )
  async editarPerfilUsuario(
    @UploadedFile() file : Express.Multer.File,
    @User('sub') usuarioId : string, 
    @Body() body : PerfilUsuarioDto
  ){
    return this.perfilUsuarioService.editarPerfil(usuarioId, body, file);
  }
}
