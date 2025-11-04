import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from '../../entities/usuario.entity';
import { Repository } from 'typeorm';
import { UsuarioDTO } from '../../entities/dto/usuarioDTO';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from '../../entities/dto/loginDTO';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private usersRepository: Repository<UsuarioEntity>,
    private jwtService: JwtService,
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

  async login(login : LoginDTO) : Promise<{accessToken : string, refreshToken : string}> {

    const usuario = await this.usersRepository.findOne({
      where: { email: login.email },
    });

    if (!usuario) throw new Error('Usuario no encontrado');

    if(usuario.email !== login.email || !await bcrypt.compare(login.password, usuario.password))
      throw new UnauthorizedException('Credenciales incorrectas');

    const payload = { sub: usuario.id, email: usuario.email, role: usuario.role };

    const accessToken = await this.generateToken(payload, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
    const refreshToken = await this.generateToken(payload, process.env.JWT_REFRESH, process.env.JWT_REFRESH_EXPIRES_IN);

    usuario.refreshToken = await this.hashToken(refreshToken);
    await this.usersRepository.save(usuario);

    return {
      accessToken,
      refreshToken
    };

  }

  async refreshTokens(refreshToken : string) : Promise<{newAccessToken : string, newRefreshToken : string}>{
    try {
      const payload = await this.verifyRefreshToken(refreshToken);

      const usuario = await this.usersRepository.findOne({ where: { id: payload.sub } });
      if (!usuario || !usuario.refreshToken) throw new UnauthorizedException();

      const valid = await bcrypt.compare(refreshToken, usuario.refreshToken);
      if (!valid) throw new UnauthorizedException();

      const newPayload = { sub: usuario.id, email: usuario.email, role: usuario.role };

      const newAccessToken = await this.generateToken(newPayload, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
      const newRefreshToken = await this.generateToken(newPayload, process.env.JWT_REFRESH, process.env.JWT_REFRESH_EXPIRES_IN);

      usuario.refreshToken = await this.hashToken(newRefreshToken);
      await this.usersRepository.save(usuario);

      return {newAccessToken, newRefreshToken};

    }catch(e){
      throw new UnauthorizedException();
    }
  }

  async revokeRefreshToken(usuarioId: string) {
    const usuario = await this.usersRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) return;
    usuario.refreshToken = "";
    await this.usersRepository.save(usuario);
  }

  async verifyRefreshToken(refreshToken: string) {
    return this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH,
    });
  }

  private async generateToken(payload : any, secret : string | undefined , expires : any) : Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: expires,
    });
  }

  private async hashToken(token: string) : Promise<string> {
    return await bcrypt.hash(token, 10);
  }


}
