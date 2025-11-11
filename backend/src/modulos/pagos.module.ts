import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from '../entities/pago.entity';
import { VentasModule } from './ventas/ventas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago]),
    VentasModule,
  ],
  controllers: [PagosController],
  providers: [PagosService],
})
export class PagosModule {}
