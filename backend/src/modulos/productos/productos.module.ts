import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from '../../entities/producto.entity';
import { CategoriaModule } from '../categoria/categoria.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity]), CategoriaModule],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService]
})
export class ProductosModule {}
