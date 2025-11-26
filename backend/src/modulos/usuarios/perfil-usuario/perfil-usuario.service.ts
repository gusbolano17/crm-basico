import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerfilUsuario } from '../../../entities/perfil-usuario.entity';
import { Repository } from 'typeorm';
import { UsuarioService } from '../usuario.service';
import { PerfilUsuarioDto } from '../../../entities/dto/perfil-usuario-dto';
import { CloudinaryService } from '../../../core/cloudinary.service';

@Injectable()
export class PerfilUsuarioService {
  constructor(
    @InjectRepository(PerfilUsuario)
    private readonly perfilUsuarioRepo : Repository<PerfilUsuario>,
    private readonly  usuarioService : UsuarioService,
    private readonly cloudinaryService : CloudinaryService
  ) {}

  // Obtiene el perfil del usuario logueado
  async obtenerPerfil(usuarioId: string) {
    const usuario = await this.usuarioService.obtenerUsuarioId(usuarioId);

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    // Si no tiene perfil lo creamos vacío
    if (!usuario.perfil) {
      const perfil = this.perfilUsuarioRepo.create({ usuario });
      return await this.perfilUsuarioRepo.save(perfil);
    }

    return usuario.perfil;
  }

  // Edita o crea el perfil del usuario logueado
  async editarPerfil(usuarioId: string, dto: PerfilUsuarioDto,   file?: Express.Multer.File) {
    const usuario = await this.usuarioService.obtenerUsuarioId(usuarioId);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    let perfil = usuario.perfil;

    if (file) {
      const upload = await this.cloudinaryService.uploadImage(file, usuario.nombre);
      dto.avatarUrl = upload?.secure_url;
    }

    if (!perfil) {
      perfil = this.perfilUsuarioRepo.create({ ...dto, usuario });
    } else {
      Object.assign(perfil, dto);
    }

    return await this.perfilUsuarioRepo.save(perfil);
  }

}
