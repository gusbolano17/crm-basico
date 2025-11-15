import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from '../../entities/usuario.entity';
import { Repository } from 'typeorm';
import { UsuarioDTO } from '../../entities/dto/usuarioDTO';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private usersRepository: Repository<UsuarioEntity>,
  ) {}

  async registrarUsuario(usuario: UsuarioDTO): Promise<UsuarioEntity> {

    const countUsers = await this.usersRepository.count();
    const roleAsign = countUsers === 0 ? 'admin' : 'usuario';

    const existUser = await this.usersRepository.findOne({
      where: { email: usuario.email },
    });

    if (existUser) throw new Error('El usuario ya existe');
    const hashPass = await bcrypt.hash(usuario.password, 10);

    const newUser = this.usersRepository.create({
      ...usuario,
      password: hashPass,
      role: roleAsign,
      activo: true,
      creado: new Date(),
      actualizado: new Date(),
    });

    return this.usersRepository.save(newUser);
  }

  async obtenerUsuarioEmail(email: string) : Promise<UsuarioEntity | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async obtenerUsuarioId(id: string) : Promise<UsuarioEntity | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async modificarRefreshToken(usuarioId: string, refreshToken: string) {
    const usuario = await this.obtenerUsuarioId(usuarioId);
    if (!usuario) throw new Error('Usuario no encontrado');
    usuario.refreshToken = refreshToken;
    await this.usersRepository.save(usuario);
  }



}
