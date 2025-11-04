import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('resumen')
  async obtenerResumen() {
    return await this.dashboardService.obtenerResumen();
  }

  @Get('ventas/mes')
  async obtenerVentasPorMes() {
    return await this.dashboardService.obtenerVentasPorMes();
  }

  @Get('ventas/dia')
  async obtenerVentasPorDia() {
    return await this.dashboardService.obtenerVentasPorDia();
  }

  @Get('top-productos')
  async topProductos(){
    return await this.dashboardService.topProductos();
  }
}
