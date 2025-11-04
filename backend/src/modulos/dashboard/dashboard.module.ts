import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from '../../entities/venta.entity';
import { DetalleVenta } from '../../entities/detalle-venta.entity';
import { ClienteEntity } from '../../entities/cliente.entity';
import { ProductoEntity } from '../../entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteEntity,ProductoEntity,Venta, DetalleVenta])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
