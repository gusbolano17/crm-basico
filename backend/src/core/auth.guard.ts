import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public-edpoint';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenHeader(request);

    if(!token) throw new UnauthorizedException('Token no proporcionado');

    try{
      request['usuario'] = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    }catch{
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenHeader(req: Request) : string | undefined {
    const [type,token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
