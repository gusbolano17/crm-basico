import { Body, Controller, Get, Post } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasDTO } from '../../entities/dto/ventasDTO';
import { Venta } from '../../entities/venta.entity';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post("registrar")
  async registrarVentas(@Body() venta : VentasDTO) : Promise<Venta>{
    return await this.ventasService.registrarVenta(venta);
  }

  @Get("listar")
  async listarVentas() : Promise<Venta[]>{
    return await this.ventasService.listarVentas();
  }
}
