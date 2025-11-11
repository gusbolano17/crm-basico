import { Body, Controller, Post } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { Pago } from '../entities/pago.entity';
import { PagoDTO } from '../entities/dto/pagoDTO';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post("/pagar")
  async realizarPago(@Body() body : PagoDTO) : Promise<Pago>{
    return await this.pagosService.realizarPago(body);
  }
}
