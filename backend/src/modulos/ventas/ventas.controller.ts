import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasDTO } from '../../entities/dto/ventasDTO';
import { Venta } from '../../entities/venta.entity';
import { FiltroVentaDto } from '../../entities/dto/filtro-cliente-dto';
import { EstadosVentas } from '../../entities/estados-enums';
import { User } from '../../core/user-decorator';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post('registrar')
  async registrarVentas(@Body() venta: VentasDTO, @User('sub') userId: string): Promise<Venta> {
    return await this.ventasService.registrarVenta(venta, userId);
  }

  @Get('listar')
  async listarVentas(@Query() filtro: FiltroVentaDto) {
    return await this.ventasService.listarVentas(filtro);
  }

  @Put('anularVenta/:id')
  async anularVenta(@Param('id') venta: string, @User('sub') userId: string): Promise<Venta> {
    return await this.ventasService.cambiarEstadoVenta(
      venta,
      EstadosVentas.CANCELADA,
      userId
    );
  }
}
