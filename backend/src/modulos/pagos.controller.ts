import { Body, Controller, Post } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { Pago } from '../entities/pago.entity';
import { PagoDTO } from '../entities/dto/pagoDTO';
import { User } from '../core/user-decorator';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post("pagar")
  async realizarPago(@Body() body : PagoDTO, @User('sub') userId: string) : Promise<Pago>{
    return await this.pagosService.realizarPago(body, userId);
  }
}
