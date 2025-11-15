import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from '../../entities/dto/loginDTO';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuarios/usuario.service';


@Injectable()
export class AutenticacionService {

  constructor(
    private jwtService: JwtService,
    private  usuarioService : UsuarioService
  ) {}

  async login(login : LoginDTO) : Promise<{accessToken : string, refreshToken : string}> {

    const usuario = await this.usuarioService.obtenerUsuarioEmail(login.email);

    if (!usuario) throw new Error('Usuario no encontrado');

    if(usuario.email !== login.email || !await bcrypt.compare(login.password, usuario.password))
      throw new UnauthorizedException('Credenciales incorrectas');

    const payload = { sub: usuario.id, email: usuario.email, role: usuario.role };

    const accessToken = await this.generateToken(payload, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
    const refreshToken = await this.generateToken(payload, process.env.JWT_REFRESH, process.env.JWT_REFRESH_EXPIRES_IN);

    const rtHash = await this.hashToken(refreshToken);

    await this.usuarioService.modificarRefreshToken(usuario.id, rtHash);

    return {
      accessToken,
      refreshToken
    };

  }

  async refreshTokens(refreshToken : string) : Promise<{newAccessToken : string, newRefreshToken : string}>{
    try {
      const payload = await this.verifyRefreshToken(refreshToken);

      const usuario = await this.usuarioService.obtenerUsuarioId(payload.sub);
      if (!usuario || !usuario.refreshToken) throw new UnauthorizedException();

      const valid = await bcrypt.compare(refreshToken, usuario.refreshToken);
      if (!valid) throw new UnauthorizedException();

      const newPayload = { sub: usuario.id, email: usuario.email, role: usuario.role };

      const newAccessToken = await this.generateToken(newPayload, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
      const newRefreshToken = await this.generateToken(newPayload, process.env.JWT_REFRESH, process.env.JWT_REFRESH_EXPIRES_IN);

      const rtHash = await this.hashToken(newRefreshToken);
      await this.usuarioService.modificarRefreshToken(usuario.id, rtHash);

      return {newAccessToken, newRefreshToken};

    }catch(e){
      throw new UnauthorizedException();
    }
  }

  async revokeRefreshToken(usuarioId: string) {
    const usuario = await this.usuarioService.obtenerUsuarioId(usuarioId);
    if (!usuario) return;
    await this.usuarioService.modificarRefreshToken(usuario.id, "");
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
