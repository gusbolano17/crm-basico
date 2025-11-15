import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { Public } from '../../core/public-edpoint';
import { LoginDTO } from '../../entities/dto/loginDTO';

@Controller('auth')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Public()
  @Post('login')
  async login(
    @Body() loginDTO: LoginDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.autenticacionService.login(loginDTO);
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ newAccessToken: string; newRefreshToken: string }> {
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token requerido');
    return this.autenticacionService.refreshTokens(refreshToken);
  }

  @Public()
  @Post('logout')
  async logout(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ ok: boolean }> {
    if (!refreshToken) return { ok: true };
    try {
      const payload =
        await this.autenticacionService.verifyRefreshToken(refreshToken);
      await this.autenticacionService.revokeRefreshToken(payload.sub);
    } catch (err) {}
    return { ok: true };
  }
}
