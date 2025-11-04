import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { UsuarioDTO } from '../../entities/dto/usuarioDTO';
import { UsuarioEntity } from '../../entities/usuario.entity';
import { UsuarioService } from './usuario.service';
import { Public } from '../../core/public-edpoint';
import { LoginDTO } from '../../entities/dto/loginDTO';

@Controller('usuario')
export class UsuarioController {

  constructor(private usuarioService: UsuarioService) {}

  @Public()
  @Post('registrar')
  async registrarUsuario(@Body() usuarioDTO: UsuarioDTO) : Promise<UsuarioEntity> {
    return await this.usuarioService.registrarUsuario(usuarioDTO);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDTO: LoginDTO) : Promise<{accessToken : string, refreshToken : string}> {
    return await this.usuarioService.login(loginDTO);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) : Promise<{newAccessToken : string, newRefreshToken : string}> {
    if (!refreshToken) throw new UnauthorizedException('Refresh token requerido');
    return this.usuarioService.refreshTokens(refreshToken);
  }

  @Public()
  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string) : Promise<{ok : boolean}> {
    if (!refreshToken) return { ok: true };
    try {
      const payload = await this.usuarioService.verifyRefreshToken(refreshToken);
      await this.usuarioService.revokeRefreshToken(payload.sub);
    } catch (err) {
    }
    return { ok: true };
  }

}
