import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from '../../entities/venta.entity';
import { DetalleVenta } from '../../entities/detalle-venta.entity';
import { ClientesModule } from '../clientes/clientes.module';
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, DetalleVenta]),
    ClientesModule,
    ProductosModule
  ],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService]
})
export class VentasModule {}
