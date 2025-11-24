import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from '../../entities/usuario.entity';
import { Repository } from 'typeorm';
import { UsuarioDTO } from '../../entities/dto/usuarioDTO';
import * as bcrypt from 'bcrypt';
import { EditarUsuarioDTO } from '../../entities/dto/editar-usuarioDTO';
import { FiltroUsuarioDto } from '../../entities/dto/filtro-cliente-dto';


@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private usersRepository: Repository<UsuarioEntity>
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

  async listarUsuarios(filtro : FiltroUsuarioDto){
    const {
      search,
      estado,
      role,
      desde,
      hasta,
      page = '1',
      limit = '10',
      sort = 'creado',
      dir = 'desc'
    } = filtro;

    const qb = this.usersRepository.createQueryBuilder('usuario');

    if (search){
      qb.andWhere(
        '(LOWER(usuario.nombre) LIKE :s OR LOWER(usuario.email) LIKE :s)',
        { s: `%${search.toLowerCase()}%` },
      );
    }

    if(estado) qb.andWhere('usuario.activo = :estado', { estado });

    if(role && role !== 'todos') qb.andWhere('usuario.role = :role', { role });

    if (desde) qb.andWhere('usuario.creado >= :desde', { desde: new Date(desde) });
    if (hasta) qb.andWhere('usuario.creado <= :hasta', { hasta: new Date(hasta) });

    qb.orderBy(`usuario.${sort}`, dir.toUpperCase() as 'ASC' | 'DESC');

    const skip = (parseInt(page) - 1) * parseInt(limit);
    qb.skip(skip).take(parseInt(limit));

    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      total,
      page: +page,
    }


  }

  async obtenerUsuarioEmail(email: string) : Promise<UsuarioEntity | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async obtenerUsuarioId(id: string) {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['perfil'],
    });
  }

  async modificarRefreshToken(usuarioId: string, refreshToken: string) {
    const usuario = await this.obtenerUsuarioId(usuarioId);
    if (!usuario) throw new Error('Usuario no encontrado');
    usuario.refreshToken = refreshToken;
    await this.usersRepository.save(usuario);
  }

  async actualizarUsuario(userId: string, usuarioDTO: EditarUsuarioDTO) {
    const usuario = await this.obtenerUsuarioId(userId);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return await this.usersRepository.save({
      ...usuario
      ,...usuarioDTO
      ,actualizado : new Date()
    });
  }

  async cambiarPassword(usuarioId : string, newPassword : string){
    const usuario = await this.obtenerUsuarioId(usuarioId);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    usuario.password = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.save(usuario);
  }

}
